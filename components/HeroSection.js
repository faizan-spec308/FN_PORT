import { profile } from "../data/profile.js";
import { buttonLink } from "./ui.js";
import { escapeHtml, html } from "../lib/dom.js";

export function HeroSection() {
  return html`
    <section id="origin" class="hero section-shell" data-section>
      <div class="hero__content reveal">
        <p class="eyebrow">01 / Origin</p>
        <h1 class="hero__name">${escapeHtml(profile.name)}</h1>
        <p class="hero__lead">${escapeHtml(profile.heroSentence)}</p>
        <p class="identity-line">${escapeHtml(profile.identityLine)}</p>
        <div class="hero__actions">
          ${buttonLink("#projects", "Explore My Work", "primary")}
          ${buttonLink(profile.cv, "Download CV", "ghost", 'target="_blank" rel="noreferrer"')}
        </div>
      </div>
      <div class="scroll-cue" aria-hidden="true">
        <span>Scroll to explore</span>
        <i></i>
      </div>
    </section>
  `;
}
