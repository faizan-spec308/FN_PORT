import { Navbar } from "./components/Navbar.js";
import { HeroSection } from "./components/HeroSection.js";
import { AboutSection } from "./components/AboutSection.js";
import { ProjectsSection, drawerTemplate } from "./components/ProjectsSection.js";
import { ExperienceTimeline } from "./components/ExperienceTimeline.js";
import { ContactSection } from "./components/ContactSection.js";
import { Footer } from "./components/Footer.js";
import { GlobalFluidCometCursor } from "./components/visuals/GlobalFluidCometCursor.js";
import { projects } from "./data/projects.js";
import { qs, qsa } from "./lib/dom.js";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function render() {
  qs("#app").innerHTML = `
    ${GlobalFluidCometCursor()}
    ${Navbar()}
    <main id="main">
      ${HeroSection()}
      ${AboutSection()}
      ${ExperienceTimeline()}
      ${ProjectsSection()}
      ${ContactSection()}
    </main>
    ${Footer()}
  `;
}

function setupLoader() {
  const loader = qs("#loader");
  window.setTimeout(() => loader?.classList.add("is-hidden"), 1350);
}

function setupTheme() {
  document.documentElement.dataset.theme = "dark";
}

function setupNavigation() {
  const toggle = qs("#navToggle");
  const links = qs("#navLinks");
  toggle?.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  qsa(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      links.classList.remove("is-open");
      toggle?.setAttribute("aria-expanded", "false");
    });
  });

  const sections = qsa("[data-section]");
  const navItems = qsa("[data-nav]");
  const setActiveSection = () => {
    const marker = window.scrollY + Math.min(window.innerHeight * 0.34, 280);
    let current = sections[0]?.id;

    sections.forEach(section => {
      if (section.offsetTop <= marker) current = section.id;
    });

    navItems.forEach(link => link.classList.toggle("is-active", link.dataset.nav === current));

    const indicator = qs("#navIndicator");
    const activeLink = qs(".nav-links a.is-active");
    if (indicator && activeLink) {
      const linkRect = activeLink.getBoundingClientRect();
      const navRect = activeLink.parentElement.getBoundingClientRect();
      indicator.style.left = `${linkRect.left - navRect.left}px`;
      indicator.style.width = `${linkRect.width}px`;
      indicator.style.opacity = "1";
    }
  };

  setActiveSection();
  window.addEventListener("scroll", setActiveSection, { passive: true });
  window.addEventListener("resize", setActiveSection);

  const header = qs("#siteHeader");
  const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 40);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

function setupReveal() {
  const revealItems = qsa(".reveal");
  const cardSelector = [
    ".glass-card",
    ".stat-card",
    ".highlight-card",
    ".skill-card",
    ".project-card",
    ".timeline-item",
    ".award-card",
    ".mood-card",
    ".contact-panel",
    ".contact-form",
    ".philosophy-card",
    ".projects-grid"
  ].join(",");

  qsa("[data-section]").forEach(section => {
    section.classList.add("reveal-space");
    qsa(".reveal", section).forEach((item, index) => {
      item.style.setProperty("--reveal-delay", `${Math.min(index * 60, 360)}ms`);
      if (item.matches(cardSelector)) item.dataset.reveal = item.dataset.reveal || "card";
      if (item.matches(".section-heading")) item.dataset.reveal = item.dataset.reveal || "section";
      if (item.matches(".timeline-item")) item.dataset.reveal = "timeline";
    });
  });

  if (prefersReducedMotion) {
    revealItems.forEach(el => el.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: "0px 0px -8% 0px",
    threshold: 0.18
  });

  revealItems.forEach(el => revealObserver.observe(el));
}

function setupAboutReveal() {
  const section = qs(".about-journey");
  const stage = qs(".about-cinematic", section);
  const title = qs(".about-zoom-title", section);
  const copy = qs(".about-zoom-copy", section);
  const content = qs(".about-content", section);
  if (!section || !stage || !title || !content) return;

  if (prefersReducedMotion) {
    section.style.setProperty("--about-content-opacity", "1");
    section.style.setProperty("--about-content-y", "0px");
    title.style.cssText += "opacity:1;transform:none;filter:none;";
    return;
  }

  title.style.cssText += "opacity:0;transform:translateY(36px);filter:blur(10px);";
  if (copy) copy.style.cssText += "opacity:0;transform:translateY(22px);";

  let ticking = false;
  const clamp = v => Math.min(1, Math.max(0, v));
  const smoothstep = v => v * v * (3 - 2 * v);

  const update = () => {
    ticking = false;
    const rect = stage.getBoundingClientRect();
    const zone = Math.max(1, stage.offsetHeight - window.innerHeight);
    const p = clamp(-rect.top / zone);

    const te = smoothstep(clamp(p / 0.38));
    title.style.opacity = te.toFixed(3);
    title.style.transform = `translateY(${((1 - te) * 36).toFixed(1)}px)`;
    title.style.filter = `blur(${((1 - te) * 10).toFixed(1)}px)`;

    if (copy) {
      const ce = smoothstep(clamp((p - 0.28) / 0.26));
      copy.style.opacity = (ce * 0.82).toFixed(3);
      copy.style.transform = `translateY(${((1 - ce) * 22).toFixed(1)}px)`;
    }

    const contentE = smoothstep(clamp((p - 0.68) / 0.32));
    section.style.setProperty("--about-content-opacity", contentE.toFixed(3));
    section.style.setProperty("--about-content-y", `${(40 * (1 - contentE)).toFixed(1)}px`);
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  update();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
}


function setupProgress() {
  const updateProgress = () => {
    qs("#siteHeader")?.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
}

function setupProjects() {
  const grid = qs("#projectsGrid");
  const drawer = qs("#projectDrawer");
  const content = qs("#drawerContent");
  const scrim = qs("#drawerScrim");

  if (drawer && scrim && drawer.parentElement !== document.body) {
    document.body.append(scrim, drawer);
  }

  const resetDrawerScroll = () => {
    if (!drawer || !content) return;
    drawer.scrollTop = 0;
    drawer.scrollLeft = 0;
    content.scrollTop = 0;
    content.scrollLeft = 0;
    drawer.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };

  const close = () => {
    drawer?.setAttribute("aria-hidden", "true");
    scrim.hidden = true;
    document.body.classList.remove("drawer-open");
  };

  grid?.addEventListener("click", event => {
    const card = event.target.closest("[data-project]");
    if (!card) return;
    const project = projects.find(item => item.slug === card.dataset.project);
    if (!project) return;
    content.innerHTML = drawerTemplate(project);
    drawer.setAttribute("aria-hidden", "false");
    scrim.hidden = false;
    document.body.classList.add("drawer-open");
    resetDrawerScroll();
    requestAnimationFrame(resetDrawerScroll);
    window.setTimeout(resetDrawerScroll, 0);
  });

  qs("#drawerClose")?.addEventListener("click", close);
  scrim?.addEventListener("click", close);
  window.addEventListener("keydown", event => {
    if (event.key === "Escape") close();
  });
}

function setupContactForm() {
  qs("#contactForm")?.addEventListener("submit", event => {
    event.preventDefault();
    const form = event.currentTarget;
    const status = qs("#formStatus");
    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const message = form.elements.message.value.trim();

    if (name.length < 2) return setFormStatus(status, "Please enter your name.", true);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setFormStatus(status, "Please enter a valid email address.", true);
    if (message.length < 10) return setFormStatus(status, "Please write at least 10 characters.", true);

    setFormStatus(status, "Message validated. Email sending is not connected yet, so please use the email link for now.", false);
    form.reset();
  });
}

function setFormStatus(status, text, error) {
  status.textContent = text;
  status.className = error ? "is-error" : "is-success";
}

function setupMagnetic() {
  if (prefersReducedMotion || window.matchMedia("(pointer: coarse)").matches) return;
  qsa(".magnetic").forEach(el => {
    el.addEventListener("mousemove", event => {
      const rect = el.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.18;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.18;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  });
}

function setupCardLight() {
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const mobileLike = coarse || window.matchMedia("(max-width: 620px)").matches;
  qsa(".glass-card, .project-card__button").forEach(card => {
    const setLightPosition = (clientX, clientY) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--card-x", `${clientX - rect.left}px`);
      card.style.setProperty("--card-y", `${clientY - rect.top}px`);
    };

    if (mobileLike) {
      const activateCard = (clientX, clientY) => {
        setLightPosition(clientX, clientY);
        card.classList.add("is-touch-active");
      };

      card.addEventListener("pointerdown", event => {
        activateCard(event.clientX, event.clientY);
      }, { passive: true });

      card.addEventListener("pointerup", () => {
        window.setTimeout(() => card.classList.remove("is-touch-active"), 180);
      }, { passive: true });

      card.addEventListener("touchstart", event => {
        const touch = event.touches?.[0];
        if (!touch) return;
        activateCard(touch.clientX, touch.clientY);
      }, { passive: true });

      card.addEventListener("touchmove", event => {
        const touch = event.touches?.[0];
        if (!touch) return;
        setLightPosition(touch.clientX, touch.clientY);
      }, { passive: true });

      card.addEventListener("touchend", () => {
        window.setTimeout(() => card.classList.remove("is-touch-active"), 180);
      }, { passive: true });
      return;
    }

    card.addEventListener("mousemove", event => setLightPosition(event.clientX, event.clientY));
  });
}

function setupPortraitInteraction() {
  if (prefersReducedMotion) return;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const mobileLike = coarse || window.matchMedia("(max-width: 620px)").matches;
  qsa("[data-portrait-card]").forEach(card => {
    let frameId = 0;
    const state = {
      rotateX: 0,
      rotateY: 0,
      imageX: 0,
      imageY: 0,
      sheenX: 50,
      sheenY: 50
    };

    const apply = () => {
      frameId = 0;
      card.style.setProperty("--portrait-rx", `${state.rotateX}deg`);
      card.style.setProperty("--portrait-ry", `${state.rotateY}deg`);
      card.style.setProperty("--portrait-image-x", `${state.imageX}px`);
      card.style.setProperty("--portrait-image-y", `${state.imageY}px`);
      card.style.setProperty("--portrait-sheen-x", `${state.sheenX}%`);
      card.style.setProperty("--portrait-sheen-y", `${state.sheenY}%`);
    };

    const schedule = () => {
      if (!frameId) frameId = requestAnimationFrame(apply);
    };

    card.addEventListener("mousemove", event => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const dx = px - 0.5;
      const dy = py - 0.5;

      state.rotateX = dy * -6;
      state.rotateY = dx * 7;
      state.imageX = dx * 8;
      state.imageY = dy * 8;
      state.sheenX = px * 100;
      state.sheenY = py * 100;
      card.classList.add("is-hovered");
      schedule();
    });

    card.addEventListener("mouseleave", () => {
      state.rotateX = 0;
      state.rotateY = 0;
      state.imageX = 0;
      state.imageY = 0;
      state.sheenX = 50;
      state.sheenY = 50;
      card.classList.remove("is-hovered");
      schedule();
    });

    if (mobileLike) {
      const activatePortrait = (clientX, clientY) => {
        const rect = card.getBoundingClientRect();
        const px = (clientX - rect.left) / rect.width;
        const py = (clientY - rect.top) / rect.height;
        state.rotateX = (py - 0.5) * -3;
        state.rotateY = (px - 0.5) * 3.5;
        state.imageX = (px - 0.5) * 5;
        state.imageY = (py - 0.5) * 5;
        state.sheenX = px * 100;
        state.sheenY = py * 100;
        card.classList.add("is-hovered");
        schedule();
      };

      const resetPortrait = () => {
        window.setTimeout(() => {
          state.rotateX = 0;
          state.rotateY = 0;
          state.imageX = 0;
          state.imageY = 0;
          state.sheenX = 50;
          state.sheenY = 50;
          card.classList.remove("is-hovered");
          schedule();
        }, mobileLike ? 1800 : 220);
      };

      card.addEventListener("pointerdown", event => {
        activatePortrait(event.clientX, event.clientY);
      }, { passive: true });

      card.addEventListener("pointerup", resetPortrait, { passive: true });

      const touchPortrait = event => {
        const touch = event.touches?.[0];
        if (!touch) return;
        activatePortrait(touch.clientX, touch.clientY);
      };

      card.addEventListener("touchstart", touchPortrait, { passive: true });
      card.addEventListener("touchmove", touchPortrait, { passive: true });
      card.addEventListener("touchend", resetPortrait, { passive: true });
      return;
    }
  });
}

function setupFluidCometCursor() {
  const canvas = qs("#siteLiquidCanvas");
  const container = qs(".site-liquid");
  if (!canvas || !container) return;

  if (prefersReducedMotion) {
    return;
  }

  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const mobileLike = coarse || window.matchMedia("(max-width: 620px)").matches;
  if (mobileLike) {
    container.classList.add("is-mobile-webgl");
  }
  const readableSelector = [
    ".site-header",
    ".glass-card",
    ".stat-card",
    ".highlight-card",
    ".skill-card",
    ".project-card",
    ".timeline-item",
    ".award-card",
    ".mood-card",
    ".philosophy-card",
    ".contact-panel",
    ".contact-form",
    ".section-heading",
    ".hero-copy",
    ".about-copy",
    ".project-card__body",
    ".btn",
    "h1",
    "h2",
    "h3",
    "h4",
    "p",
    "label",
    "button",
    "a",
    "input",
    "textarea"
  ].join(",");
  let fluidStarted = false;
  let fluidReady = false;
  let pointerSamples = 0;
  let lastPointer = null;
  let touchFluidVisible = false;
  let touchStart = null;

  const showTouchFluid = () => {
    if (!mobileLike || touchFluidVisible) return;
    touchFluidVisible = true;
    const reveal = () => container.classList.add("has-fluid-input", "has-touch-fluid");
    if (fluidReady) {
      reveal();
    } else {
      window.setTimeout(reveal, 950);
    }
  };

  const dispatchFluidInput = (clientX, clientY, pointerType = "touch") => {
    [canvas, window].forEach(target => {
      const common = {
        bubbles: true,
        cancelable: true,
        clientX,
        clientY,
        screenX: clientX,
        screenY: clientY
      };

      if (window.PointerEvent) {
        target.dispatchEvent(new PointerEvent("pointermove", {
          ...common,
          pointerId: 99,
          pointerType,
          isPrimary: true,
          buttons: 1
        }));
        target.dispatchEvent(new PointerEvent("pointerdown", {
          ...common,
          pointerId: 99,
          pointerType,
          isPrimary: true,
          buttons: 1
        }));
        target.dispatchEvent(new PointerEvent("pointerup", {
          ...common,
          pointerId: 99,
          pointerType,
          isPrimary: true
        }));
      }

      target.dispatchEvent(new MouseEvent("mousemove", common));
      target.dispatchEvent(new MouseEvent("mousedown", { ...common, buttons: 1 }));
      target.dispatchEvent(new MouseEvent("mouseup", common));
    });
  };

  const dispatchFluidWarmup = () => {
    const baseX = Math.round(window.innerWidth * (mobileLike ? 0.26 : 0.14));
    const baseY = Math.round(window.innerHeight * (mobileLike ? 0.72 : 0.82));
    const points = [
      [baseX, baseY],
      [baseX + (mobileLike ? 10 : 18), baseY - (mobileLike ? 6 : 10)],
      [baseX + (mobileLike ? 20 : 35), baseY + (mobileLike ? 4 : 6)]
    ];

    points.forEach(([clientX, clientY], index) => {
      window.setTimeout(() => {
        dispatchFluidInput(clientX, clientY, mobileLike ? "touch" : "mouse");
      }, 120 + index * 140);
    });
  };

  const withScrollSafeTouchListeners = callback => {
    if (!mobileLike) return callback();

    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function scrollSafeAddEventListener(type, listener, options) {
      if (type === "touchstart" || type === "touchmove") {
        const safeOptions = typeof options === "object"
          ? { ...options, passive: true }
          : { capture: Boolean(options), passive: true };

        return originalAddEventListener.call(this, type, listener, safeOptions);
      }

      return originalAddEventListener.call(this, type, listener, options);
    };

    try {
      return callback();
    } finally {
      EventTarget.prototype.addEventListener = originalAddEventListener;
    }
  };

  const startFluid = () => {
    if (fluidStarted) return;
    fluidStarted = true;
    import("https://cdn.jsdelivr.net/npm/smokey-fluid-cursor@1.0.7/dist/index.mjs")
      .then(({ initFluid }) => {
        withScrollSafeTouchListeners(() => initFluid({
          id: "siteLiquidCanvas",
          simResolution: mobileLike ? 80 : 160,
          dyeResolution: mobileLike ? 256 : 768,
          captureResolution: 512,
          densityDissipation: mobileLike ? 0.992 : 0.965,
          velocityDissipation: mobileLike ? 0.991 : 0.982,
          pressure: 0.78,
          pressureIteration: mobileLike ? 12 : 18,
          curl: mobileLike ? 54 : 58,
          splatRadius: mobileLike ? 0.26 : 0.115,
          splatForce: mobileLike ? 5000 : 6200,
          shading: true,
          colorUpdateSpeed: 0.035,
          transparent: true,
          backColor: { r: 0, g: 0, b: 0 }
        }));
        dispatchFluidWarmup();
        window.setTimeout(() => {
          fluidReady = true;
          if (mobileLike) {
            container.classList.add("has-fluid-input", "has-touch-fluid");
          }
        }, 900);
      })
      .catch(error => {
        console.warn("Fluid cursor failed to load.", error);
      });
  };

  const syncFluidState = event => {
    if (event && !event.isTrusted) return;
    if (event) startFluid();
    if (mobileLike || event?.pointerType === "touch") showTouchFluid();
    if (event && fluidReady) {
      if (lastPointer) {
        const distance = Math.hypot(event.clientX - lastPointer.x, event.clientY - lastPointer.y);
        if (distance > 2 && distance < Math.max(window.innerWidth, window.innerHeight) * 0.24) {
          pointerSamples += 1;
        }
      }
      lastPointer = { x: event.clientX, y: event.clientY };
      if (pointerSamples >= 5) container.classList.add("has-fluid-input");
    }
    const target = event ? document.elementFromPoint(event.clientX, event.clientY) : null;
    const readable = Boolean(target?.closest(readableSelector));
    container.classList.toggle("is-readable-hover", readable);
  };

  const syncTouchFluid = event => {
    const touch = event.touches?.[0];
    if (!touch) return;
    if (!touchStart) touchStart = { x: touch.clientX, y: touch.clientY };
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    if (Math.abs(deltaY) > 8 && Math.abs(deltaY) > Math.abs(deltaX)) return;

    startFluid();
    showTouchFluid();
    dispatchFluidInput(touch.clientX, touch.clientY, "touch");
    if (!fluidReady) return;

    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    const readable = Boolean(target?.closest(readableSelector));
    container.classList.toggle("is-readable-hover", readable);
  };

  window.addEventListener("pointermove", syncFluidState, { passive: true });
  window.addEventListener("pointerdown", syncFluidState, { passive: true });
  window.addEventListener("touchmove", syncTouchFluid, { passive: true });
  window.addEventListener("touchstart", event => {
    const touch = event.touches?.[0];
    touchStart = touch ? { x: touch.clientX, y: touch.clientY } : null;
    syncTouchFluid(event);
  }, { passive: true });
  window.addEventListener("touchend", () => {
    touchStart = null;
  }, { passive: true });
  window.addEventListener("touchcancel", () => {
    touchStart = null;
  }, { passive: true });
  if (mobileLike) {
    window.addEventListener("scroll", () => {
      startFluid();
      showTouchFluid();
    }, { passive: true });
  }
  window.addEventListener("pointerleave", () => container.classList.remove("is-readable-hover"), { passive: true });

  if (mobileLike) {
    window.setTimeout(startFluid, 250);
  }

  new MutationObserver(() => syncFluidState()).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"]
  });
}

function setupAmbientLiveBackground() {
  const canvas = qs("#ambientLiquidCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const mobileQuery = window.matchMedia("(max-width: 620px)");
  const mobileLike = coarse || mobileQuery.matches;
  const particleCount = mobileLike ? 82 : 118;
  const waveCount = mobileLike ? 9 : 10;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let frame = 0;
  let hidden = document.hidden;
  let particles = [];
  let splashes = [];
  let scrollEnergy = 0;
  let lastScrollY = window.scrollY;
  let lastPointerSplash = 0;

  const colorsForTheme = () => ({
    particle: "201, 162, 39",
    line: "201, 162, 39",
    glow: "240, 200, 80",
    fade: "7, 8, 15"
  });

  function resizeAmbient() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.14,
      vy: (Math.random() - 0.5) * 0.1,
      r: 0.45 + Math.random() * 1.25,
      phase: Math.random() * Math.PI * 2
    }));
  }

  function addSplash(x, y, strength = 1) {
    if (!mobileLike || prefersReducedMotion) return;
    splashes.push({
      x,
      y,
      radius: 10 + Math.random() * 14,
      maxRadius: 74 + Math.random() * 58 * strength,
      life: 1,
      strength,
      wobble: Math.random() * Math.PI * 2
    });
    if (splashes.length > 16) splashes.splice(0, splashes.length - 16);
  }

  function addScrollPulse() {
    if (!mobileLike || prefersReducedMotion) return;
    const current = window.scrollY;
    const delta = Math.abs(current - lastScrollY);
    lastScrollY = current;
    scrollEnergy = Math.min(1, scrollEnergy + delta / 520);
    if (delta > 18 && frame % 3 === 0) {
      addSplash(width * (0.24 + Math.random() * 0.52), height * (0.24 + Math.random() * 0.52), 0.55);
    }
  }

  function drawAmbient() {
    if (hidden) return;
    frame += 1;
    const colors = colorsForTheme();
    const light = false;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = `rgba(${colors.fade}, ${light ? 0.025 : 0.05})`;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.globalAlpha = mobileLike ? (light ? 0.22 : 0.16) : (light ? 0.18 : 0.1);
    ctx.strokeStyle = `rgba(${colors.line}, 1)`;
    ctx.lineWidth = mobileLike ? 0.62 : 0.5;
    for (let i = 0; i < waveCount; i++) {
      const yBase = (height / waveCount) * i + Math.sin(frame * 0.004 + i) * (mobileLike ? 22 : 16);
      ctx.beginPath();
      for (let x = -48; x <= width + 48; x += 24) {
        const y = yBase
          + Math.sin(x * 0.0065 + frame * 0.007 + i * 1.7) * (mobileLike ? 10 : 7)
          + Math.cos(x * 0.012 + frame * 0.004 + i) * (mobileLike ? 4.5 : 3);
        if (x === -48) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.restore();

    particles.forEach((particle, index) => {
      particle.phase += 0.0075;
      particle.x += particle.vx + Math.cos(particle.phase) * 0.018;
      particle.y += particle.vy + Math.sin(particle.phase) * 0.014;

      if (particle.x < -12) particle.x = width + 12;
      if (particle.x > width + 12) particle.x = -12;
      if (particle.y < -12) particle.y = height + 12;
      if (particle.y > height + 12) particle.y = -12;

      const pulse = 0.58 + Math.sin(particle.phase + frame * 0.01) * 0.24;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.r * pulse, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${colors.particle}, ${mobileLike ? (light ? 0.28 : 0.24) : (light ? 0.22 : 0.16)})`;
      ctx.fill();

      if (!coarse && index % 4 === 0) {
        const next = particles[(index + 11) % particles.length];
        const distance = Math.hypot(next.x - particle.x, next.y - particle.y);
        if (distance < 132) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(next.x, next.y);
          ctx.strokeStyle = `rgba(${colors.line}, ${(1 - distance / 132) * (light ? 0.085 : 0.045)})`;
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }
      }
    });

    if (mobileLike) {
      scrollEnergy *= 0.92;
      if (scrollEnergy > 0.01) {
        ctx.save();
        ctx.globalAlpha = scrollEnergy * (light ? 0.13 : 0.16);
        ctx.strokeStyle = `rgba(${colors.glow}, 1)`;
        ctx.lineWidth = 0.8;
        for (let i = 0; i < 3; i++) {
          const y = height * (0.2 + i * 0.28) + Math.sin(frame * 0.018 + i) * 24;
          ctx.beginPath();
          for (let x = -40; x <= width + 40; x += 26) {
            const wave = Math.sin(x * 0.018 + frame * 0.018 + i) * 11;
            if (x === -40) ctx.moveTo(x, y + wave);
            else ctx.lineTo(x, y + wave);
          }
          ctx.stroke();
        }
        ctx.restore();
      }

      splashes.forEach((splash, index) => {
        splash.life -= 0.018;
        splash.radius += (splash.maxRadius - splash.radius) * 0.035;
        splash.x += Math.cos(frame * 0.025 + splash.wobble) * 0.22;
        splash.y += Math.sin(frame * 0.022 + splash.wobble) * 0.18;

        const alpha = Math.max(0, splash.life);
        const gradient = ctx.createRadialGradient(splash.x, splash.y, 0, splash.x, splash.y, splash.radius);
        gradient.addColorStop(0, `rgba(${colors.glow}, ${alpha * (light ? 0.13 : 0.18) * splash.strength})`);
        gradient.addColorStop(0.45, `rgba(${colors.line}, ${alpha * (light ? 0.08 : 0.11) * splash.strength})`);
        gradient.addColorStop(1, `rgba(${colors.line}, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(splash.x, splash.y, splash.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(splash.x, splash.y, splash.radius * 0.58, splash.wobble, splash.wobble + Math.PI * 1.25);
        ctx.strokeStyle = `rgba(${colors.line}, ${alpha * (light ? 0.16 : 0.2)})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();

        if (splash.life <= 0) splashes.splice(index, 1);
      });
    }

    if (!prefersReducedMotion) requestAnimationFrame(drawAmbient);
  }

  resizeAmbient();

  if (prefersReducedMotion) {
    drawAmbient();
    return;
  }

  window.addEventListener("resize", resizeAmbient);
  if (mobileLike) {
    window.addEventListener("scroll", addScrollPulse, { passive: true });
    window.addEventListener("mousemove", event => {
      if (window.innerWidth > 620 || frame - lastPointerSplash < 5) return;
      lastPointerSplash = frame;
      addSplash(event.clientX, event.clientY, 0.7);
    }, { passive: true });
    window.addEventListener("pointermove", event => {
      if (window.innerWidth > 620 || frame - lastPointerSplash < 5) return;
      lastPointerSplash = frame;
      addSplash(event.clientX, event.clientY, 0.74);
    }, { passive: true });
    window.addEventListener("touchstart", event => {
      const touch = event.touches?.[0];
      if (touch) addSplash(touch.clientX, touch.clientY, 1);
    }, { passive: true });
    window.addEventListener("touchmove", event => {
      const touch = event.touches?.[0];
      if (touch && frame % 2 === 0) addSplash(touch.clientX, touch.clientY, 0.72);
    }, { passive: true });
    window.addEventListener("pointerdown", event => {
      if (window.innerWidth <= 620) addSplash(event.clientX, event.clientY, 0.9);
    }, { passive: true });
  }
  document.addEventListener("visibilitychange", () => {
    hidden = document.hidden;
    if (!hidden) requestAnimationFrame(drawAmbient);
  });
  requestAnimationFrame(drawAmbient);
}

render();
setupLoader();
setupTheme();
setupNavigation();
setupReveal();
setupAboutReveal();
setupProgress();
setupProjects();
setupContactForm();
setupMagnetic();
setupCardLight();
setupPortraitInteraction();
setupAmbientLiveBackground();
setupFluidCometCursor();
