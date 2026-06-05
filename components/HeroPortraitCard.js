import { profile } from "../data/profile.js";
import { html } from "../lib/dom.js";

export function HeroPortraitCard() {
  return html`
    <div class="hero__portrait-wrap reveal">
      <figure class="portrait-card" data-portrait-card>
        <div class="portrait-card__aura" aria-hidden="true"></div>
        <div class="portrait-card__sheen" aria-hidden="true"></div>
        <div class="portrait-card__image-layer" data-portrait-image>
          ${profile.photo
            ? `<img class="portrait-card__image portrait-card__image--dark" src="${profile.photo}" alt="Portrait of ${profile.name}" loading="eager">`
            : `<div class="portrait-card__initials" aria-label="Portrait of ${profile.name}">${profile.initials}</div>`
          }
        </div>
      </figure>
      <a class="portrait-contact-flyout" href="#contact" aria-label="Go to contact section">
        <span>Contact Me</span>
      </a>
    </div>
  `;
}
