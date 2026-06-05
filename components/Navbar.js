import { profile } from "../data/profile.js";
import { html, list } from "../lib/dom.js";

const links = [
  ["origin", "Home"],
  ["about", "About"],
  ["experience", "Experience"],
  ["projects", "Projects"],
  ["contact", "Contact"]
];

export function Navbar() {
  return html`
    <header class="site-header" id="siteHeader">
      <nav class="navbar" aria-label="Primary navigation">
        <a class="brand" href="#origin" aria-label="Faizan Naveed home">
          <span>${profile.initials}</span>
        </a>
        <button class="nav-toggle" id="navToggle" type="button" aria-expanded="false" aria-controls="navLinks" aria-label="Open navigation">
          <span></span><span></span>
        </button>
        <div class="nav-links" id="navLinks">
          <div class="nav-indicator" id="navIndicator"></div>
          ${list(links, ([id, label], i) => `<a href="#${id}" data-nav="${id}"><span class="nav-num">${String(i + 1).padStart(2, "0")}</span>${label}</a>`)}
        </div>
      </nav>
    </header>
  `;
}
