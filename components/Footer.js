import { profile } from "../data/profile.js";
import { socials } from "../data/socials.js";
import { escapeHtml, html, list } from "../lib/dom.js";

export function Footer() {
  return html`
    <footer class="footer">
      <a class="brand" href="#origin" aria-label="Back to top"><span>${escapeHtml(profile.initials)}</span></a>
      <p>&copy; 2026 ${escapeHtml(profile.name)}. Designed and built by hand.</p>
      <div>${list(socials, item => `<a href="${escapeHtml(item.href)}" target="_blank" rel="noreferrer">${escapeHtml(item.label)}</a>`)}</div>
    </footer>
  `;
}
