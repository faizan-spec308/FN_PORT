import { profile, skills, projects, experience, achievements } from '../data/portfolio.js'
import { initCanvas }        from './canvas.js'
import { initReveal, initScrollProgress } from './reveal.js'
import { initCursor }        from './cursor.js'

/* ── Helpers ─────────────────────────────────────────────── */
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
const list = (arr, fn) => arr.map((item, i) => fn(item, i)).join('')
const tag  = text => `<span class="tag">${esc(text)}</span>`

/* ── Typewriter ──────────────────────────────────────────── */
function initTypewriter(el, words) {
  let wi = 0, display = '', phase = 'typing'
  const SPEEDS = { type: 75, del: 35, pause: 2000 }
  const tick = () => {
    const word = words[wi]
    if (phase === 'typing') {
      if (display.length < word.length) {
        display = word.slice(0, display.length + 1)
        el.textContent = display
        setTimeout(tick, SPEEDS.type)
      } else {
        setTimeout(() => { phase = 'deleting'; tick() }, SPEEDS.pause)
      }
    } else {
      if (display.length > 0) {
        display = display.slice(0, -1)
        el.textContent = display
        setTimeout(tick, SPEEDS.del)
      } else {
        wi = (wi + 1) % words.length
        phase = 'typing'
        tick()
      }
    }
  }
  tick()
}

/* ── Navbar ──────────────────────────────────────────────── */
function renderNavbar() {
  const NAV = ['About','Skills','Projects','Experience','Achievements','Contact']
  document.getElementById('navbar').innerHTML = `
    <div class="container">
      <div class="nav-inner">
        <a href="#hero" class="nav-logo" aria-label="Home">FN</a>
        <ul class="nav-links" role="list">
          ${list(NAV, n => `<li><a href="#${n.toLowerCase()}">${esc(n)}</a></li>`)}
        </ul>
        <a href="${esc(profile.cv)}" target="_blank" rel="noreferrer" class="nav-cv">CV ↓</a>
        <button class="nav-hamburger" id="hamburger" aria-label="Toggle menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
      <nav class="mobile-nav" id="mobile-nav" aria-label="Mobile navigation">
        ${list(NAV, n => `<a href="#${n.toLowerCase()}">${esc(n)}</a>`)}
        <a href="${esc(profile.cv)}" target="_blank" rel="noreferrer">CV ↓</a>
      </nav>
    </div>
  `
}

function initNavbar() {
  const navbar = document.getElementById('navbar')
  const burger = document.getElementById('hamburger')
  const mobileNav = document.getElementById('mobile-nav')
  const links = document.querySelectorAll('.nav-links a')
  const sections = document.querySelectorAll('[data-section]')

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50)
  }, { passive: true })

  burger?.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('is-open')
    burger.setAttribute('aria-expanded', open)
  })

  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault()
      const target = document.querySelector(a.getAttribute('href'))
      target?.scrollIntoView({ behavior: 'smooth' })
      mobileNav.classList.remove('is-open')
    })
  })

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id
        links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === `#${id}`))
      }
    })
  }, { threshold: 0.3 })
  sections.forEach(s => io.observe(s))
}

/* ── Hero ────────────────────────────────────────────────── */
function renderHero() {
  return `
    <section id="hero" class="hero" data-section="hero">
      <div class="container">
        <div class="hero__content">
          <div class="hero__badge reveal">
            <span class="pulse"></span>
            Available · Placement 2026
          </div>
          <p class="kicker reveal" data-delay="1">01 / Origin</p>
          <h1 class="hero__name reveal" data-delay="2">
            <span class="hero__name-solid">${esc(profile.firstName)}</span>
            <span class="hero__name-outline">${esc(profile.lastName)}</span>
          </h1>
          <div class="hero__role reveal" data-delay="3">
            <span id="role-text"></span><span class="cursor-blink">|</span>
          </div>
          <p class="hero__tagline reveal" data-delay="3">
            ${esc(profile.tagline)}<br>
            ${esc(profile.subTagline)}
          </p>
          <div class="hero__ctas reveal" data-delay="4">
            <button class="btn-primary" id="cta-work">View My Work →</button>
            <a href="${esc(profile.cv)}" target="_blank" rel="noreferrer" class="btn-ghost">Download CV ↓</a>
          </div>
          <div class="hero__currently reveal" data-delay="5">
            <span class="label">currently →</span>
            ${list(profile.currently, s => `<span>${esc(s)}</span>`)}
          </div>
        </div>
        <div class="hero__code-card reveal" data-delay="3">
          <div class="glass-card code-window">
            <div class="code-window__bar">
              <span class="code-window__dot" style="background:#ff5f57"></span>
              <span class="code-window__dot" style="background:#febc2e"></span>
              <span class="code-window__dot" style="background:#28c840"></span>
              <span class="code-window__filename">faizan.py</span>
            </div>
            <div><span class="t-comment"># Faizan Naveed</span></div>
            <div><span class="t-var">status</span><span class="t-sep"> = </span><span class="t-str">"Seeking Placement 2026"</span></div>
            <div><span class="t-var">skills</span><span class="t-sep"> = [</span><span class="t-str">"Python"</span><span class="t-sep">, </span><span class="t-str">"React"</span><span class="t-sep">, </span><span class="t-str">"PyTorch"</span><span class="t-sep">]</span></div>
            <div><span class="t-var">gpa</span><span class="t-sep"> = </span><span class="t-str">"Predicted 1st"</span></div>
            <div><span class="t-var">built</span><span class="t-sep"> = [</span><span class="t-str">"HillingOne"</span><span class="t-sep">, </span><span class="t-str">"KnownLy"</span><span class="t-sep">, </span><span class="t-str">"FraudDetect"</span><span class="t-sep">]</span></div>
            <div style="margin-top:0.75rem;padding-top:0.75rem;border-top:1px solid rgba(255,255,255,0.07)">
              <span class="t-comment">&gt;&gt;&gt; Let's build something.</span>
            </div>
          </div>
        </div>
      </div>
      <div class="hero__scroll-cue" aria-hidden="true">scroll ↓</div>
    </section>
  `
}

/* ── About ───────────────────────────────────────────────── */
function renderAbout() {
  return `
    <section id="about" class="section-shell" data-section="about">
      <div class="container">
        <div class="about__cinematic reveal">
          <p class="kicker" style="text-align:center">02 / About Me</p>
          <h2>The story<br>behind the work.</h2>
          <p>More than a CV — this is how I think, build, and learn.</p>
        </div>
        <div class="about__grid">
          <div class="glass-card about__bio reveal">
            <p class="kicker">Background</p>
            ${list(profile.about, p => `<p>${esc(p)}</p>`)}
            <blockquote><p>${esc(profile.philosophy)}</p></blockquote>
          </div>
          <div class="about__right">
            <div class="stats-grid">
              ${list(profile.stats, s => `
                <div class="stat-card reveal">
                  <strong>${esc(s.value)}</strong>
                  <span>${esc(s.label)}</span>
                </div>
              `)}
            </div>
            <div class="glass-card edu-card reveal" data-delay="1">
              <div class="edu-card__top">
                <h3>${esc(profile.education.university)}</h3>
                <span class="edu-badge">Predicted 1st</span>
              </div>
              <p class="degree">${esc(profile.education.degree)} · ${esc(profile.education.period)}</p>
              <p class="modules">${profile.education.modules.join(' · ')}</p>
              <p class="award">🏆 ${esc(profile.education.award)}</p>
              <p class="alevels">A-Levels: ${esc(profile.education.alevels)}</p>
            </div>
          </div>
        </div>
        <div class="glass-card about__brings reveal" style="margin-top:1.5rem">
          <p class="kicker">What I bring</p>
          <div class="brings-grid">
            ${list([
              { icon:'⚡', label:'End-to-end delivery', desc:'From Figma wireframe to deployed product' },
              { icon:'🤖', label:'Applied AI / ML',     desc:'PyTorch, Scikit-learn, Gemini API, MLFlow' },
              { icon:'🏗️', label:'Full-stack',          desc:'React + FastAPI + PostgreSQL in production' },
              { icon:'🎯', label:'Product thinking',    desc:'Shipped KnownLy as Product Owner, Brunel 2026' },
            ], (b, i) => `
              <div class="bring-item">
                <div class="icon">${b.icon}</div>
                <h4>${esc(b.label)}</h4>
                <p>${esc(b.desc)}</p>
              </div>
            `)}
          </div>
        </div>
      </div>
    </section>
  `
}

/* ── Skills ──────────────────────────────────────────────── */
const ALL_TOOLS = ['Git','GitHub','Docker','AWS','Power BI','Tableau','Jira','Wireshark','Ubuntu Linux','Google Gemini API','MATLAB','Microsoft 365','VS Code','Postman','Figma','Streamlit','MLFlow','Git','GitHub','Docker','AWS','Power BI','Tableau','Jira','Wireshark','Ubuntu Linux','Google Gemini API','MATLAB','Microsoft 365','VS Code','Postman','Figma','Streamlit','MLFlow']

function renderSkills() {
  return `
    <section id="skills" class="section-shell section-alt" data-section="skills">
      <div class="container">
        <div class="reveal">
          <p class="kicker">03 / Skills</p>
          <h2 class="section-title">Technical range, <span class="outline">built by building.</span></h2>
        </div>
        <div class="skills__grid" style="margin-top:3rem">
          ${list(skills, (group, gi) => `
            <div class="glass-card skill-card reveal" data-delay="${Math.min(gi+1,5)}">
              <h3>${esc(group.title)}</h3>
              <div class="tag-cloud">${list(group.items, tag)}</div>
            </div>
          `)}
        </div>
        <div class="glass-card cert-card reveal" style="margin-top:1rem">
          <span class="cert-icon">📜</span>
          <div>
            <div class="cert-name">Machine Learning & AI Ethics</div>
            <div class="cert-meta">Coursera · <span class="cert-status">In Progress</span></div>
          </div>
        </div>
        <div class="reveal" style="margin-top:0.5rem">
          <p style="font-family:var(--font-mono);font-size:0.68rem;text-transform:uppercase;letter-spacing:0.14em;color:var(--muted);margin-bottom:0.75rem">Tools & Platforms</p>
          <div class="marquee-wrap">
            <div class="marquee-inner">${list(ALL_TOOLS, t => `<span class="tag">${esc(t)}</span>`)}</div>
          </div>
        </div>
      </div>
    </section>
  `
}

/* ── Projects ────────────────────────────────────────────── */
function renderProjects() {
  const featured  = projects.find(p => p.featured)
  const secondary = projects.filter(p => !p.featured)
  const renderCard = (p, i) => `
    <div class="glass-card project-card ${p.featured ? 'featured' : ''} reveal" data-delay="${Math.min(i,4)}" data-project-id="${esc(p.id)}" role="button" tabindex="0" aria-label="View ${esc(p.title)} case study">
      <div class="project-card__num">${String(i+1).padStart(2,'0')}</div>
      <div class="project-card__badges">
        ${p.featured ? '<span class="project-badge">Featured</span>' : ''}
        ${p.badge ? `<span class="project-badge gold">${esc(p.badge)}</span>` : ''}
        <span class="project-badge">${esc(p.year)}</span>
        <span class="project-badge">${esc(p.status)}</span>
      </div>
      <h3>${esc(p.title)}</h3>
      ${p.role ? `<p class="role-tag">${esc(p.role)}</p>` : ''}
      <p class="project-card__tagline">${esc(p.tagline)}</p>
      <div class="project-card__tech">${list(p.tech, tag)}</div>
      <div class="project-card__footer">
        <div class="project-card__links">
          ${p.github ? `<a href="${esc(p.github)}" target="_blank" rel="noreferrer" onclick="event.stopPropagation()">GitHub ↗</a>` : ''}
          ${p.demo ? `<a href="${esc(p.demo)}" target="_blank" rel="noreferrer" onclick="event.stopPropagation()">Live ↗</a>` : ''}
        </div>
        <span class="project-card__cta">Case study →</span>
      </div>
    </div>
  `
  return `
    <section id="projects" class="section-shell" data-section="projects">
      <div class="container">
        <div class="projects__header reveal">
          <p class="kicker">04 / Projects</p>
          <h2 class="section-title">Things I've <span class="outline">actually built.</span></h2>
          <p class="section-desc" style="margin-top:0.5rem">Click any project to open the full case study.</p>
        </div>
        <div class="projects__grid">
          ${featured ? renderCard(featured, 0) : ''}
          ${featured && secondary[0] ? renderCard(secondary[0], 1) : ''}
          ${list(secondary.slice(featured ? 1 : 0), (p,i) => renderCard(p, i + (featured ? 2 : 0)))}
        </div>
      </div>
    </section>
  `
}

/* ── Experience ──────────────────────────────────────────── */
function renderExperience() {
  return `
    <section id="experience" class="section-shell section-alt" data-section="experience">
      <div class="container">
        <div class="reveal">
          <p class="kicker">05 / Experience</p>
          <h2 class="section-title">Where I've worked.</h2>
        </div>
        <div class="timeline" style="margin-top:3rem">
          ${list(experience, (job, i) => `
            <div class="timeline-item reveal" data-delay="${i+1}">
              <div class="timeline-dot"></div>
              <div class="glass-card timeline-card">
                <div class="timeline-card__top">
                  <h3>${esc(job.title)}</h3>
                  <span class="timeline-period">${esc(job.period)}</span>
                </div>
                <p class="timeline-company">${esc(job.company)} · ${esc(job.location)}</p>
                <ul class="timeline-bullets">
                  ${list(job.bullets, b => `<li>${esc(b)}</li>`)}
                </ul>
              </div>
            </div>
          `)}
        </div>
      </div>
    </section>
  `
}

/* ── Achievements ────────────────────────────────────────── */
function renderAchievements() {
  return `
    <section id="achievements" class="section-shell" data-section="achievements">
      <div class="container">
        <div class="reveal">
          <p class="kicker">06 / Achievements</p>
          <h2 class="section-title">Milestones that <span class="outline">shaped the journey.</span></h2>
        </div>
        <div class="achievements-grid" style="margin-top:3rem">
          ${list(achievements, (a, i) => `
            <div class="achievement-card reveal" data-delay="${Math.min(i,4)}">
              <span class="ach-num">${String(i+1).padStart(2,'0')}</span>
              <div>
                <div class="ach-icon">${a.icon}</div>
                <h3>${esc(a.title)}</h3>
                <p>${esc(a.desc)}</p>
              </div>
            </div>
          `)}
        </div>
      </div>
    </section>
  `
}

/* ── Contact ─────────────────────────────────────────────── */
function renderContact() {
  return `
    <section id="contact" class="section-shell section-alt" data-section="contact">
      <div class="container">
        <div class="contact__grid">
          <div class="reveal">
            <p class="kicker">07 / Contact</p>
            <h2 class="contact__heading">Let's build<br><span class="outline">something.</span></h2>
            <p class="contact__desc">Open to placement roles from June 2026. If you're working on something interesting — AI, software, data — I want to hear about it. Response within 24 hours.</p>
            <div class="contact-info">
              <a href="mailto:${esc(profile.email)}">${esc(profile.email)}</a>
              <a href="tel:${esc(profile.phone)}">${esc(profile.phone)}</a>
              <span>${esc(profile.location)}</span>
            </div>
            <div class="contact-socials">
              <a href="${esc(profile.github)}" target="_blank" rel="noreferrer" class="btn-ghost">GitHub ↗</a>
              <a href="${esc(profile.linkedin)}" target="_blank" rel="noreferrer" class="btn-ghost">LinkedIn ↗</a>
            </div>
          </div>
          <div class="reveal" data-delay="1">
            <div class="glass-card contact-form__card">
              <div class="form-success" id="form-success">
                <div class="form-success__check">✓</div>
                <div class="form-success__title">Message sent.</div>
                <div class="form-success__desc">I'll reply within 24 hours.</div>
              </div>
              <form id="contact-form" novalidate>
                <div class="form-field">
                  <label for="from_name">Name</label>
                  <input type="text" id="from_name" name="from_name" placeholder="Your name" required minlength="2" autocomplete="name" />
                </div>
                <div class="form-field">
                  <label for="from_email">Email</label>
                  <input type="email" id="from_email" name="from_email" placeholder="your@email.com" required autocomplete="email" />
                </div>
                <div class="form-field">
                  <label for="message">Message</label>
                  <textarea id="message" name="message" rows="5" placeholder="Tell me about the opportunity..." required minlength="10"></textarea>
                </div>
                <button type="submit" class="btn-primary" id="form-submit">Send Message →</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
}

/* ── Footer ──────────────────────────────────────────────── */
function renderFooter() {
  document.getElementById('footer-root').innerHTML = `
    <footer style="position:relative;z-index:1">
      <div class="container">
        <div class="footer-inner">
          <p class="footer-credit">Faizan Naveed · Built with HTML, CSS & JS · 2026</p>
          <a href="${esc(profile.github)}" target="_blank" rel="noreferrer" class="footer-link">github.com/faizan-spec308</a>
        </div>
      </div>
    </footer>
  `
}

/* ── Drawer ──────────────────────────────────────────────── */
function initDrawer() {
  const scrim   = document.getElementById('drawer-scrim')
  const drawer  = document.getElementById('project-drawer')
  const content = document.getElementById('drawer-content')

  const open = (project) => {
    content.innerHTML = `
      <button class="drawer-close" id="drawer-close">← Close</button>
      ${project.badge ? `<p class="drawer-badge">${esc(project.badge)}</p>` : ''}
      <h2 class="drawer-title">${esc(project.title)}</h2>
      <p class="drawer-tagline">${esc(project.tagline)}</p>
      ${project.role ? `<span class="drawer-role">${esc(project.role)}</span>` : ''}
      ${project.agents ? `
        <div class="drawer-section">
          <p class="drawer-section__label">Agent Architecture</p>
          <div class="drawer-agents">
            ${list(project.agents, a => `
              <div class="agent-card">
                <h4>${esc(a.name)}</h4>
                <p>${esc(a.desc)}</p>
              </div>
            `)}
          </div>
        </div>
      ` : ''}
      <div class="drawer-section">
        <p class="drawer-section__label">Problem</p>
        <div class="drawer-text">${esc(project.problem)}</div>
      </div>
      <div class="drawer-section">
        <p class="drawer-section__label">Solution</p>
        <div class="drawer-text">${esc(project.solution)}</div>
      </div>
      <div class="drawer-section">
        <p class="drawer-section__label">Impact</p>
        <div class="drawer-text">${esc(project.impact)}</div>
      </div>
      <div class="drawer-section">
        <p class="drawer-section__label">Tech Stack</p>
        <div class="drawer-tags">${list(project.tech, t => `<span class="tag" style="color:var(--accent);border-color:rgba(0,255,136,0.25)">${esc(t)}</span>`)}</div>
      </div>
      <div class="drawer-links">
        ${project.github ? `<a href="${esc(project.github)}" target="_blank" rel="noreferrer" class="btn-ghost">GitHub ↗</a>` : ''}
        ${project.demo   ? `<a href="${esc(project.demo)}"   target="_blank" rel="noreferrer" class="btn-primary">Live Demo ↗</a>` : ''}
      </div>
    `
    scrim.classList.add('is-open')
    drawer.classList.add('is-open')
    drawer.setAttribute('aria-hidden', 'false')
    document.body.style.overflow = 'hidden'
    drawer.querySelector('#drawer-close')?.addEventListener('click', close)
    drawer.scrollTop = 0
  }

  const close = () => {
    scrim.classList.remove('is-open')
    drawer.classList.remove('is-open')
    drawer.setAttribute('aria-hidden', 'true')
    document.body.style.overflow = ''
  }

  scrim.addEventListener('click', close)
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close() })

  document.addEventListener('click', e => {
    const card = e.target.closest('[data-project-id]')
    if (!card) return
    const project = projects.find(p => p.id === card.dataset.projectId)
    if (project) open(project)
  })

  document.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const card = e.target.closest('[data-project-id]')
      if (!card) return
      const project = projects.find(p => p.id === card.dataset.projectId)
      if (project) open(project)
    }
  })
}

/* ── Contact form ────────────────────────────────────────── */
async function initContactForm() {
  const form    = document.getElementById('contact-form')
  const success = document.getElementById('form-success')
  const submit  = document.getElementById('form-submit')
  if (!form) return

  form.addEventListener('submit', async e => {
    e.preventDefault()
    submit.textContent = 'Sending...'
    submit.disabled = true

    const data = Object.fromEntries(new FormData(form))
    try {
      const emailjs = await import('https://cdn.jsdelivr.net/npm/@emailjs/browser@4/+esm')
      await emailjs.default.sendForm('service_qxwm38r', 'template_m5bfese', form, 'SOn1DFV--_ZIzb9sj')
      form.style.display = 'none'
      success.classList.add('is-visible')
    } catch {
      const sub  = encodeURIComponent(`Portfolio enquiry from ${data.from_name}`)
      const body = encodeURIComponent(`${data.message}\n\n—\n${data.from_name}\n${data.from_email}`)
      window.open(`mailto:faizangpt4@gmail.com?subject=${sub}&body=${body}`)
      submit.textContent = 'Send Message →'
      submit.disabled = false
    }
  })
}

/* ── Loader ──────────────────────────────────────────────── */
function runLoader() {
  const loader = document.getElementById('loader')
  const fill   = loader?.querySelector('.loader-fill')
  if (!loader) return Promise.resolve()
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      if (fill) fill.style.width = '100%'
      setTimeout(() => {
        loader.classList.add('hidden')
        setTimeout(resolve, 500)
      }, 900)
    })
  })
}

/* ── Init ────────────────────────────────────────────────── */
async function init() {
  renderNavbar()

  const main = document.getElementById('main')
  main.innerHTML = renderHero() + renderAbout() + renderSkills() + renderProjects() + renderExperience() + renderAchievements() + renderContact()
  renderFooter()

  document.querySelector('#cta-work')?.addEventListener('click', () => {
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })
  })

  await runLoader()

  initNavbar()
  initCanvas()
  initReveal()
  initScrollProgress()
  initCursor()
  initDrawer()
  initContactForm()

  const roleEl = document.getElementById('role-text')
  if (roleEl) initTypewriter(roleEl, profile.roles)
}

init()
