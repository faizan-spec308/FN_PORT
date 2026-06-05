import { projects } from "../data/projects.js";
import { sectionHeader, tag } from "./ui.js";
import { escapeHtml, html, list } from "../lib/dom.js";

export function ProjectsSection() {
  return html`
    <section id="projects" class="section-shell" data-section>
      ${sectionHeader("04", "Selected Projects", "Built ideas, prototypes, and systems.", "Each project here started as an idea and became something practical through curiosity and execution. Click to view details!")}
      <div class="projects-grid" id="projectsGrid">
        ${list(projects, projectCard)}
      </div>
    </section>
    <aside class="project-drawer" id="projectDrawer" aria-hidden="true" aria-label="Project case study">
      <button class="drawer-close" type="button" id="drawerClose" aria-label="Close project details">Close</button>
      <div id="drawerContent"></div>
    </aside>
    <div class="drawer-scrim" id="drawerScrim" hidden></div>
  `;
}

function projectCard(project, index) {
  return html`
    <article class="project-card reveal" data-project="${escapeHtml(project.slug)}">
      <button class="project-card__button" type="button" aria-label="Open ${escapeHtml(project.title)} case study">
        <div class="project-card__num">${String(index + 1).padStart(2, "0")}</div>
        <div class="project-card__body">
          <div class="project-card__meta">
            <span>${escapeHtml(project.year)}</span>
            <span class="project-card__status">${escapeHtml(project.status)}</span>
          </div>
          <h3>${escapeHtml(project.title)}</h3>
          <p>${escapeHtml(project.description)}</p>
          <div class="project-card__foot">
            <div class="tag-cloud">${list(project.techStack.slice(0, 4), tag)}</div>
            <span class="project-card__cta">Explore →</span>
          </div>
        </div>
      </button>
    </article>
  `;
}

export function drawerTemplate(project) {
  return html`
    <div class="drawer-content">
      <p class="section-kicker">Case study / ${escapeHtml(project.year)}</p>
      <h2>${escapeHtml(project.title)}</h2>
      <p class="drawer-lead">${escapeHtml(project.description)}</p>
      <div class="drawer-actions drawer-actions--top">
        ${project.github ? `<a class="btn btn--primary" href="${escapeHtml(project.github)}" target="_blank" rel="noreferrer">GitHub</a>` : ""}
        ${project.demo ? `<a class="btn btn--ghost" href="${escapeHtml(project.demo)}" target="_blank" rel="noreferrer">Demo / Docs</a>` : ""}
      </div>
      <div class="drawer-meta">
        <span>${escapeHtml(project.status)}</span>
      </div>
      <div class="drawer-block">
        <h3>Problem</h3>
        <p>${escapeHtml(project.problem)}</p>
      </div>
      <div class="drawer-block">
        <h3>Solution</h3>
        <p>${escapeHtml(project.solution)}</p>
      </div>
      <div class="drawer-block">
        <h3>Features</h3>
        <ul>${list(project.features, item => `<li>${escapeHtml(item)}</li>`)}</ul>
      </div>
      <div class="drawer-block">
        <h3>Impact</h3>
        <p>${escapeHtml(project.impact)}</p>
      </div>
      <div class="tag-cloud">${list(project.techStack, tag)}</div>
    </div>
  `;
}
