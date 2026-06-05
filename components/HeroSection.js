import { profile } from "../data/profile.js";
import { buttonLink } from "./ui.js";
import { html } from "../lib/dom.js";

export function HeroSection() {
  return html`
    <section id="origin" class="hero section-shell" data-section>
      <div class="hero__content reveal">
        <p class="eyebrow">01 / Origin</p>
        <h1>${profile.heroSentence.replace("real impact", '<span>real impact</span>')}</h1>
        <p class="identity-line">${profile.identityLine}</p>
        <div class="hero__actions">
          ${buttonLink("#projects", "Explore My Work", "primary")}
          ${buttonLink("#about", "About Me")}
        </div>
      </div>
      <div class="scroll-cue" aria-hidden="true">
        <span>Scroll to explore</span>
        <i></i>
      </div>
    </section>
  `;
}
