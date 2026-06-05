import { hobbies } from "../data/hobbies.js";
import { sectionHeader } from "./ui.js";
import { escapeHtml, html, list } from "../lib/dom.js";

export function HobbiesSection() {
  return html`
    <section id="hobbies" class="section-shell human-layer" data-section>
      ${sectionHeader("05", "Human Layer", "The person behind the projects.", "Curious, driven, and active outside the screen.")}
      <div class="moodboard">
        ${list(hobbies, (item, index) => `
          <article class="glass-card mood-card reveal">
            <span class="mood-card__index">${String(index + 1).padStart(2, "0")}</span>
            <div>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.detail)}</p>
            </div>
          </article>
        `)}
      </div>
    </section>
  `;
}
