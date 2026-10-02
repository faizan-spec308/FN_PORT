import { qs } from "../lib/dom.js";

const FLUID_MODULE = "https://cdn.jsdelivr.net/npm/smokey-fluid-cursor@1.0.7/dist/index.mjs";

// Elements the fluid fades behind, so text stays readable.
const READABLE_SELECTOR = [
  ".site-header",
  ".glass-card",
  ".project-card",
  ".timeline-item",
  ".philosophy-card",
  ".contact-panel",
  ".section-heading",
  ".btn",
  "h1", "h2", "h3", "h4", "p",
  "label", "button", "a", "input", "textarea"
].join(",");

// Desktop-only: the WebGL simulation is too heavy for phones, which get the
// cheaper 2D splashes from the ambient background instead.
export function setupFluidCursor({ reducedMotion }) {
  const canvas = qs("#siteLiquidCanvas");
  const container = qs(".site-liquid");
  if (!canvas || !container || reducedMotion) return;

  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.matchMedia("(max-width: 620px)").matches;
  if (coarse || narrow) return;

  let started = false;
  let ready = false;
  let pointerSamples = 0;
  let lastPointer = null;
  let pendingEvent = null;

  // The library only reacts to pointer input, so a few synthetic moves give it
  // an initial wisp instead of an empty canvas.
  const dispatchInput = (clientX, clientY) => {
    const common = { bubbles: true, cancelable: true, clientX, clientY, screenX: clientX, screenY: clientY };
    const pointer = { ...common, pointerId: 99, pointerType: "mouse", isPrimary: true };
    [canvas, window].forEach(target => {
      if (window.PointerEvent) {
        target.dispatchEvent(new PointerEvent("pointermove", { ...pointer, buttons: 1 }));
        target.dispatchEvent(new PointerEvent("pointerdown", { ...pointer, buttons: 1 }));
        target.dispatchEvent(new PointerEvent("pointerup", pointer));
      }
      target.dispatchEvent(new MouseEvent("mousemove", common));
      target.dispatchEvent(new MouseEvent("mousedown", { ...common, buttons: 1 }));
      target.dispatchEvent(new MouseEvent("mouseup", common));
    });
  };

  const warmUp = () => {
    const baseX = Math.round(window.innerWidth * 0.14);
    const baseY = Math.round(window.innerHeight * 0.82);
    [[baseX, baseY], [baseX + 18, baseY - 10], [baseX + 35, baseY + 6]].forEach(([clientX, clientY], index) => {
      window.setTimeout(() => dispatchInput(clientX, clientY), 120 + index * 140);
    });
  };

  const start = () => {
    if (started) return;
    started = true;
    import(FLUID_MODULE)
      .then(({ initFluid }) => {
        initFluid({
          id: "siteLiquidCanvas",
          simResolution: 160,
          dyeResolution: 768,
          captureResolution: 512,
          densityDissipation: 0.965,
          velocityDissipation: 0.982,
          pressure: 0.78,
          pressureIteration: 18,
          curl: 58,
          splatRadius: 0.115,
          splatForce: 6200,
          shading: true,
          colorUpdateSpeed: 0.035,
          transparent: true,
          backColor: { r: 0, g: 0, b: 0 }
        });
        warmUp();
        window.setTimeout(() => { ready = true; }, 900);
      })
      .catch(error => console.warn("Fluid cursor failed to load.", error));
  };

  const sync = () => {
    const event = pendingEvent;
    pendingEvent = null;
    if (!event) return;

    if (ready) {
      if (lastPointer) {
        const distance = Math.hypot(event.clientX - lastPointer.x, event.clientY - lastPointer.y);
        if (distance > 2 && distance < Math.max(window.innerWidth, window.innerHeight) * 0.24) pointerSamples += 1;
      }
      lastPointer = { x: event.clientX, y: event.clientY };
      if (pointerSamples >= 5) container.classList.add("has-fluid-input");
    }

    const target = document.elementFromPoint(event.clientX, event.clientY);
    container.classList.toggle("is-readable-hover", Boolean(target?.closest(READABLE_SELECTOR)));
  };

  const onPointer = event => {
    if (!event.isTrusted || event.pointerType === "touch") return;
    start();
    if (!pendingEvent) requestAnimationFrame(sync);
    pendingEvent = event;
  };

  window.addEventListener("pointermove", onPointer, { passive: true });
  window.addEventListener("pointerdown", onPointer, { passive: true });
  document.documentElement.addEventListener("pointerleave", () => container.classList.remove("is-readable-hover"));
}
