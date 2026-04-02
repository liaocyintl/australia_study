# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Chinese-language static website about studying in Australia, deployed on GitHub Pages. Pure HTML/CSS/JS with no build tools or frameworks.

## Local Development

```bash
python3 -m http.server 8001
# Open http://localhost:8001
```

A local HTTP server is required — `file://` won't work because the app uses `fetch()` to load JSON data.

## Architecture

**Single Page Application** with hash-based routing (`#/`, `#/cities`, `#/work`, `#/career`).

- `index.html` — SPA shell with shared nav, hamburger menu, footer
- `js/router.js` — Hash router with dynamic `import()`, per-page CSS lazy loading via `loadCSS()`, and a `navigating` lock to prevent double-initialization
- Each page module (`js/universities.js`, `js/cities.js`, `js/work.js`, `js/career.js`) exports:
  - `init(container, loadCSS)` — renders HTML into container, fetches data, wires up event listeners
  - `destroy()` — teardown (critical for Leaflet map cleanup via `map.remove()`)
- Page modules must scope all DOM queries to the `container` parameter, not `document`, to avoid event listener leaks across navigations

**Data separation**: All content data lives in `data/*.json`. Page JS fetches and renders this data. When adding/editing content, modify only the JSON files.

**CSS structure**: `css/base.css` is always loaded. Page-specific CSS (`css/universities.css`, etc.) is loaded on demand by the router's `loadCSS()` and stays in the DOM permanently. Shared styles (`.hero-small`, `.section-desc`, `.container-wide`, hamburger menu) are in base.css — don't duplicate them in page CSS.

## Key Constraints

- **Leaflet.js** is loaded dynamically only when the universities page is visited. The `destroy()` function must call `map.remove()` or re-navigation will crash with "Map container is already initialized."
- **JSON content must not contain unescaped ASCII double quotes** inside string values (e.g., Chinese quotation marks `"..."` that are actually U+0022 will break JSON parsing). Use `「」` instead.
- **GitHub Pages compatibility**: all paths must be relative (no leading `/`). Hash routing is used because GitHub Pages has no server-side URL rewriting.
- Content is in Chinese (zh-CN). The target audience is Chinese students considering studying in Australia.
