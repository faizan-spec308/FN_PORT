import { profile } from "../data/profile.js";
import { highlights } from "../data/highlights.js";
import { skillCategories } from "../data/skills.js";
import { achievements } from "../data/achievements.js";
import { tag } from "./ui.js";
import { escapeHtml, html, list } from "../lib/dom.js";

export function AboutSection() {
  return html`
    <section id="about" class="section-shell about-journey" data-section>
      <div class="about-cinematic" aria-label="About introduction">
        <div class="about-zoom-sticky">
          <p class="section-kicker">02 / ABOUT ME</p>
          <h2 class="about-zoom-title">Six million transactions. Four AI agents. <span>First-class</span> predicted.</h2>
          <p class="about-zoom-copy">This is what Year 2 looks like when you learn by building, not watching.</p>
        </div>
      </div>

      <div class="about-content">
        <div class="about-dashboard">
        <div class="about-block about-summary" id="about-summary">
          <div class="section-heading reveal">
            <p class="section-kicker">02.1 / Summary</p>
            <h2>More than a CV section: this is the story behind the work.</h2>
          </div>
          <div class="about-profile-grid">
            <article class="glass-card about-copy about-panel--summary reveal">
              ${list(profile.about, paragraph => `<p>${escapeHtml(paragraph)}</p>`)}
            </article>
            <aside class="about-side about-panel--identity">
              <div class="glass-card identity-card reveal">
                <span>Current direction</span>
                <strong>Bachelors of Computer Science at Brunel University London</strong>
                <p>Completed 2nd year, preparing to join industrial placement year.</p>
              </div>
              <div class="stats-grid">
                ${list(profile.stats, item => `
                  <div class="stat-card reveal">
                    <strong>${escapeHtml(item.value)}</strong>
                    <span>${escapeHtml(item.label)}</span>
                  </div>
                `)}
              </div>
            </aside>
          </div>
        </div>

        <div class="about-block" id="about-signals">
          <div class="about-block__header reveal">
            <p class="section-kicker">02.2 / Quick Signals</p>
            <h3>At a glance.</h3>
          </div>
          <div class="highlight-grid">
            ${list(highlights, (item, index) => `
              <article class="glass-card highlight-card reveal">
                <span>${String(index + 1).padStart(2, "0")}</span>
                <p>${escapeHtml(item)}</p>
              </article>
            `)}
          </div>
        </div>

        <div class="about-block" id="about-skills">
          <div class="about-block__header reveal">
            <p class="section-kicker">02.3 / Skills</p>
            <h3>Technical range, grouped for fast scanning.</h3>
          </div>
          <div class="skills-grid">
            ${list(skillCategories, (category, index) => `
              <article class="glass-card skill-card skill-card--terminal reveal">
                <div class="skill-card__header">
                  <span class="skill-card__dots"><i></i><i></i><i></i></span>
                  <span class="skill-card__title">${escapeHtml(category.title)}</span>
                  <span class="skill-card__idx">${String(index + 1).padStart(2, "0")}</span>
                </div>
                <div class="skill-card__body">
                  <span class="skill-card__comment">// ${escapeHtml(category.title.toLowerCase())}</span>
                  <div class="tag-cloud">${list(category.skills, skill => tag(skill))}</div>
                </div>
              </article>
            `)}
          </div>
        </div>

        <div class="about-block" id="about-recognition">
          <div class="about-block__header reveal">
            <p class="section-kicker">02.4 / Recognition</p>
            <h3>A space dedicated to the milestones that shaped my journey, from hackathons and university awards to project delivery and impact.</h3>
          </div>
          <div class="award-grid recognition-wall">
            ${list(achievements, (item, index) => `
              <article class="glass-card award-card reveal">
                <span class="award-card__number">${String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>${escapeHtml(item.title)}</h3>
                  <p>${escapeHtml(item.detail)}</p>
                </div>
              </article>
            `)}
          </div>
        </div>

        <div class="about-block" id="about-philosophy">
          <div class="about-block__header reveal">
            <p class="section-kicker">02.5 / My Philosophy</p>
            <h3>The human side of building.</h3>
          </div>
          <article class="philosophy-card reveal">
            <p>${escapeHtml(profile.philosophy)}</p>
          </article>
        </div>
        </div>
      </div>
    </section>
  `;
}
