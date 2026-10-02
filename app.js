import { Navbar } from "./components/Navbar.js";
import { HeroSection } from "./components/HeroSection.js";
import { AboutSection } from "./components/AboutSection.js";
import { ProjectsSection, drawerTemplate } from "./components/ProjectsSection.js";
import { ExperienceTimeline } from "./components/ExperienceTimeline.js";
import { ContactSection } from "./components/ContactSection.js";
import { Footer } from "./components/Footer.js";
import { GlobalFluidCometCursor } from "./components/visuals/GlobalFluidCometCursor.js";
import { setupAmbientBackground } from "./effects/ambient.js";
import { setupFluidCursor } from "./effects/fluid-cursor.js";
import { projects } from "./data/projects.js";
import { qs, qsa } from "./lib/dom.js";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function render() {
  qs("#app").innerHTML = `
    ${GlobalFluidCometCursor()}
    ${Navbar()}
    <main id="main">
      ${HeroSection()}
      ${AboutSection()}
      ${ExperienceTimeline()}
      ${ProjectsSection()}
      ${ContactSection()}
    </main>
    ${Footer()}
  `;
}

// Long enough for the terminal lines to read as intentional, short enough not
// to hold up the page. Skipped entirely for reduced-motion users.
const LOADER_MIN_MS = 650;

function hideLoader() {
  const loader = qs("#loader");
  if (!loader) return;
  const elapsed = performance.now();
  const wait = prefersReducedMotion ? 0 : Math.max(0, LOADER_MIN_MS - elapsed);
  window.setTimeout(() => {
    loader.classList.add("is-hidden");
    loader.addEventListener("transitionend", () => loader.remove(), { once: true });
  }, wait);
}

function setupNavigation() {
  const toggle = qs("#navToggle");
  const links = qs("#navLinks");
  const header = qs("#siteHeader");
  const indicator = qs("#navIndicator");
  const sections = qsa("[data-section]");
  const navItems = qsa("[data-nav]");

  const setMenuOpen = open => {
    links.classList.toggle("is-open", open);
    toggle?.setAttribute("aria-expanded", String(open));
    toggle?.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  };

  toggle?.addEventListener("click", () => setMenuOpen(!links.classList.contains("is-open")));
  navItems.forEach(link => link.addEventListener("click", () => setMenuOpen(false)));

  let ticking = false;
  const update = () => {
    ticking = false;
    header?.classList.toggle("is-scrolled", window.scrollY > 24);

    const marker = window.scrollY + Math.min(window.innerHeight * 0.34, 280);
    let current = sections[0]?.id;
    sections.forEach(section => {
      if (section.offsetTop <= marker) current = section.id;
    });

    let activeLink = null;
    navItems.forEach(link => {
      const active = link.dataset.nav === current;
      link.classList.toggle("is-active", active);
      if (active) {
        link.setAttribute("aria-current", "true");
        activeLink = link;
      } else {
        link.removeAttribute("aria-current");
      }
    });

    if (indicator && activeLink) {
      const linkRect = activeLink.getBoundingClientRect();
      const navRect = activeLink.parentElement.getBoundingClientRect();
      indicator.style.left = `${linkRect.left - navRect.left}px`;
      indicator.style.width = `${linkRect.width}px`;
      indicator.style.opacity = "1";
    }
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  update();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
}

function setupReveal() {
  const revealItems = qsa(".reveal");
  const cardSelector = [
    ".glass-card",
    ".stat-card",
    ".skill-card",
    ".project-card",
    ".timeline-item",
    ".award-card",
    ".contact-panel",
    ".contact-form",
    ".philosophy-card",
    ".projects-grid"
  ].join(",");

  qsa("[data-section]").forEach(section => {
    section.classList.add("reveal-space");
    qsa(".reveal", section).forEach((item, index) => {
      item.style.setProperty("--reveal-delay", `${Math.min(index * 60, 360)}ms`);
      if (item.matches(cardSelector)) item.dataset.reveal = item.dataset.reveal || "card";
      if (item.matches(".section-heading")) item.dataset.reveal = item.dataset.reveal || "section";
      if (item.matches(".timeline-item")) item.dataset.reveal = "timeline";
    });
  });

  if (prefersReducedMotion) {
    revealItems.forEach(el => el.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: "0px 0px -8% 0px",
    threshold: 0.18
  });

  revealItems.forEach(el => revealObserver.observe(el));
}

function setupAboutReveal() {
  const section = qs(".about-journey");
  const stage = qs(".about-cinematic", section);
  const title = qs(".about-zoom-title", section);
  const copy = qs(".about-zoom-copy", section);
  const content = qs(".about-content", section);
  if (!section || !stage || !title || !content) return;

  if (prefersReducedMotion) {
    section.style.setProperty("--about-content-opacity", "1");
    section.style.setProperty("--about-content-y", "0px");
    title.style.cssText += "opacity:1;transform:none;filter:none;";
    return;
  }

  title.style.cssText += "opacity:0;transform:translateY(36px);filter:blur(10px);";
  if (copy) copy.style.cssText += "opacity:0;transform:translateY(22px);";

  let ticking = false;
  const clamp = v => Math.min(1, Math.max(0, v));
  const smoothstep = v => v * v * (3 - 2 * v);

  const update = () => {
    ticking = false;
    const rect = stage.getBoundingClientRect();
    const zone = Math.max(1, stage.offsetHeight - window.innerHeight);
    const p = clamp(-rect.top / zone);

    const te = smoothstep(clamp(p / 0.38));
    title.style.opacity = te.toFixed(3);
    title.style.transform = `translateY(${((1 - te) * 36).toFixed(1)}px)`;
    title.style.filter = `blur(${((1 - te) * 10).toFixed(1)}px)`;

    if (copy) {
      const ce = smoothstep(clamp((p - 0.28) / 0.26));
      copy.style.opacity = (ce * 0.82).toFixed(3);
      copy.style.transform = `translateY(${((1 - ce) * 22).toFixed(1)}px)`;
    }

    const contentE = smoothstep(clamp((p - 0.68) / 0.32));
    section.style.setProperty("--about-content-opacity", contentE.toFixed(3));
    section.style.setProperty("--about-content-y", `${(40 * (1 - contentE)).toFixed(1)}px`);
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  update();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
}


function setupProjects() {
  const app = qs("#app");
  const grid = qs("#projectsGrid");
  const drawer = qs("#projectDrawer");
  const content = qs("#drawerContent");
  const scrim = qs("#drawerScrim");
  const closeButton = qs("#drawerClose");
  if (!grid || !drawer || !content || !scrim) return;

  // Move out of #app so the rest of the page can be made inert while it's open.
  document.body.append(scrim, drawer);

  let returnFocusTo = null;
  const isOpen = () => drawer.getAttribute("aria-hidden") === "false";

  const open = (project, trigger) => {
    returnFocusTo = trigger;
    content.innerHTML = drawerTemplate(project);
    drawer.inert = false;
    drawer.setAttribute("aria-hidden", "false");
    scrim.hidden = false;
    app.inert = true;
    document.body.classList.add("drawer-open");
    drawer.scrollTop = 0;
    closeButton?.focus({ preventScroll: true });
  };

  const close = () => {
    if (!isOpen()) return;
    drawer.setAttribute("aria-hidden", "true");
    drawer.inert = true;
    scrim.hidden = true;
    app.inert = false;
    document.body.classList.remove("drawer-open");
    returnFocusTo?.focus({ preventScroll: true });
  };

  grid.addEventListener("click", event => {
    const card = event.target.closest("[data-project]");
    const project = card && projects.find(item => item.slug === card.dataset.project);
    if (project) open(project, card.querySelector("button"));
  });

  closeButton?.addEventListener("click", close);
  scrim.addEventListener("click", close);
  window.addEventListener("keydown", event => {
    if (event.key === "Escape") close();
  });
}

function setupContactForm() {
  qs("#contactForm")?.addEventListener("submit", event => {
    event.preventDefault();
    const form = event.currentTarget;
    const status = qs("#formStatus");
    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const message = form.elements.message.value.trim();

    if (name.length < 2) return setFormStatus(status, "Please enter your name.", true);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setFormStatus(status, "Please enter a valid email address.", true);
    if (message.length < 10) return setFormStatus(status, "Please write at least 10 characters.", true);

    setFormStatus(status, "Message validated. Email sending is not connected yet, so please use the email link for now.", false);
    form.reset();
  });
}

function setFormStatus(status, text, error) {
  status.textContent = text;
  status.className = error ? "is-error" : "is-success";
}

function setupMagnetic() {
  if (prefersReducedMotion || window.matchMedia("(pointer: coarse)").matches) return;
  qsa(".magnetic").forEach(el => {
    el.addEventListener("mousemove", event => {
      const rect = el.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.18;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.18;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  });
}

function setupCardLight() {
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const mobileLike = coarse || window.matchMedia("(max-width: 620px)").matches;
  qsa(".glass-card, .project-card__button").forEach(card => {
    const setLightPosition = (clientX, clientY) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--card-x", `${clientX - rect.left}px`);
      card.style.setProperty("--card-y", `${clientY - rect.top}px`);
    };

    if (!mobileLike) {
      card.addEventListener("mousemove", event => setLightPosition(event.clientX, event.clientY));
      return;
    }

    const release = () => window.setTimeout(() => card.classList.remove("is-touch-active"), 180);
    card.addEventListener("pointerdown", event => {
      setLightPosition(event.clientX, event.clientY);
      card.classList.add("is-touch-active");
    }, { passive: true });
    card.addEventListener("pointermove", event => setLightPosition(event.clientX, event.clientY), { passive: true });
    card.addEventListener("pointerup", release, { passive: true });
    card.addEventListener("pointercancel", release, { passive: true });
  });
}

render();
hideLoader();
setupNavigation();
setupReveal();
setupAboutReveal();
setupProjects();
setupContactForm();
setupMagnetic();
setupCardLight();
setupAmbientBackground({ reducedMotion: prefersReducedMotion });
setupFluidCursor({ reducedMotion: prefersReducedMotion });
