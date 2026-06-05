import { escapeHtml, html } from "../lib/dom.js";

export function sectionHeader(number, kicker, title, copy = "") {
  return html`
    <div class="section-heading reveal">
      <p class="section-kicker">${escapeHtml(number)} / ${escapeHtml(kicker)}</p>
      <h2>${title}</h2>
      ${copy ? `<p>${escapeHtml(copy)}</p>` : ""}
    </div>
  `;
}

export function tag(text) {
  return `<span class="tag">${escapeHtml(text)}</span>`;
}

export function buttonLink(href, label, variant = "ghost", extra = "") {
  const safeHref = escapeHtml(href || "#");
  return `<a class="btn btn--${variant} magnetic" href="${safeHref}" ${extra}>${escapeHtml(label)}</a>`;
}
