import { socials } from "../data/socials.js";
import { sectionHeader } from "./ui.js";
import { html, list } from "../lib/dom.js";

export function ContactSection() {
  return html`
    <section id="contact" class="section-shell contact" data-section>
      ${sectionHeader("05", "Transmission", "Let&rsquo;s build <span>ideas</span> with purpose", "Send a note, start a collaboration, or open a conversation around a practical idea.")}
      <div class="contact-grid">
        <div class="contact-panel reveal">
          <figure class="contact-quote">
            <blockquote>&ldquo;Most people overestimate what they can do in one year and underestimate what they can do in ten years.&rdquo;</blockquote>
            <figcaption>Bill Gates</figcaption>
          </figure>
          <div class="contact-links">
            ${list(socials, item => `<a href="${item.href}" target="_blank" rel="noreferrer">${item.label}</a>`)}
            <span>London, United Kingdom</span>
          </div>
        </div>
        <form class="contact-form glass-card reveal" id="contactForm" novalidate>
          <label for="name">Name</label>
          <input id="name" name="name" type="text" autocomplete="name" required>
          <label for="email">Email</label>
          <input id="email" name="email" type="email" autocomplete="email" required>
          <label for="message">Message</label>
          <textarea id="message" name="message" rows="5" required></textarea>
          <button class="btn btn--primary" type="submit">Send Message</button>
          <p id="formStatus" role="status" aria-live="polite"></p>
        </form>
      </div>
    </section>
  `;
}
