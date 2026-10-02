import { experiences } from "../data/experience.js";
import { sectionHeader, tag } from "./ui.js";
import { escapeHtml, html, list } from "../lib/dom.js";

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
                <span>${escapeHtml(item.dates)}</span>
              </div>
              <h3>${escapeHtml(item.role)}</h3>
              <p class="timeline-org">${escapeHtml(item.organisation)} · ${escapeHtml(item.location)}</p>
              <p>${escapeHtml(item.summary)}</p>
              <ul>${list(item.bullets, bullet => `<li>${escapeHtml(bullet)}</li>`)}</ul>
              <div class="tag-cloud">${list(item.skills, skill => tag(skill))}</div>
            </div>
          </article>
        `)}
      </div>
    </section>
  `;
}
