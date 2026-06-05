import { experiences } from "../data/experience.js";
import { sectionHeader, tag } from "./ui.js";
import { html, list } from "../lib/dom.js";

export function ExperienceTimeline() {
  return html`
    <section id="experience" class="section-shell" data-section>
      ${sectionHeader("03", "Experience Journey", "A journey of professional growth through technology, leadership, and hands-on impact.")}
      <div class="timeline">
        ${list(experiences, (item, index) => `
          <article class="timeline-item reveal">
            <div class="timeline-node">${String(index + 1).padStart(2, "0")}</div>
            <div class="glass-card timeline-card">
              <div class="timeline-card__top">
                <span>${item.dates}</span>
              </div>
              <h3>${item.role}</h3>
              <p class="timeline-org">${item.organisation} - ${item.location}</p>
              <p>${item.summary}</p>
              <ul>${list(item.bullets, bullet => `<li>${bullet}</li>`)}</ul>
              <div class="tag-cloud">${list(item.skills, tag)}</div>
            </div>
          </article>
        `)}
      </div>
    </section>
  `;
}
