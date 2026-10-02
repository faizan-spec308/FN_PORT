# FN Portfolio

Personal portfolio for Faizan Naveed. Plain HTML, CSS and vanilla JS modules, with no build step and no dependencies.

## Run locally

```sh
npm run dev        # or: node tools/static-server.js
```

Then open http://127.0.0.1:5173. Set `PORT` to use a different port.

## Structure

| Path | What it holds |
| --- | --- |
| `index.html` | Shell, loader, and no-JS fallback |
| `app.js` | Renders the page and wires up navigation, reveal animations, project drawer, and contact form |
| `components/` | One function per section, each returning an HTML string |
| `data/` | All copy: profile, experience, projects, skills, achievements, socials |
| `effects/` | Background canvas (`ambient.js`) and the desktop-only WebGL fluid cursor (`fluid-cursor.js`) |
| `lib/dom.js` | `qs`/`qsa` helpers, `escapeHtml`, `list` |
| `styles/main.css` | All styles |

To edit content, change the files in `data/`. Components escape everything they render, so plain text is safe there.

## Deploy

Deployed on Vercel as a static site. `vercel.json` enables clean URLs and sets the security headers.
