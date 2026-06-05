import { html } from "../../lib/dom.js";

export function GlobalFluidCometCursor() {
  return html`
    <div class="site-liquid" aria-hidden="true">
      <canvas id="ambientLiquidCanvas" class="ambient-liquid-canvas"></canvas>
      <canvas id="siteLiquidCanvas" class="fluid-cursor-canvas"></canvas>
    </div>
  `;
}
