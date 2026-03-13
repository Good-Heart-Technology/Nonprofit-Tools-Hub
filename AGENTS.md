# Nonprofit Tools Hub — Agent Guidelines

This file provides context for AI coding agents working on the Nonprofit Tools Hub.

## Project Overview

Nonprofit Tools Hub is a **static site** hosted on **Cloudflare Pages**. It serves as a navigation hub for free nonprofit tech tools. Individual tools run on separate subdomains (e.g., `convert.nonprofittools.org`, `ocr.nonprofittools.org`) and are loaded in iframes when embedded, or open in new tabs when marked `target="_blank"`.

- **Live site**: [nonprofittools.org](https://nonprofittools.org)
- **Maintainer**: [Good Heart Tech](https://goodhearttech.org/)

## Tech Stack

- **HTML5** — Single `index.html` with inline CSS
- **Vanilla JavaScript** — No frameworks; `script.js` handles navigation and UI
- **Cloudflare Pages** — Static hosting, no build step

## Project Structure

```
/
├── index.html      # Main page: layout, styles, sidebar nav, welcome screen, iframe
├── script.js       # Navigation, sidebar toggle, mobile menu, iframe loading
├── sitemap.xml     # Sitemap for SEO
├── LICENSE
└── AGENTS.md
```

- **Navigation**: Sidebar nav in `index.html`; each `.nav-item` has `data-url` and `data-label`
- **Embedded tools**: Loaded in `#content-frame` iframe when `data-url` is present and no `target="_blank"`
- **External links**: Items with `target="_blank"` open in new tab (e.g., PDF Editor, Password Pusher, Nonprofit Tech Navigator)

## Do

- Use vanilla HTML, CSS, and JavaScript only
- Keep styles in `index.html`; use CSS variables in `:root` for theming
- Preserve existing structure: sidebar, welcome screen, iframe, mobile menu
- Add new tools by adding `.nav-item` links with `data-url` and `data-label`
- Use Font Awesome icons (`fas fa-*`) and Noto Sans font as in the current design
- Keep the site static and deployable to Cloudflare Pages with no build step

## Don't

- Do not add build tools, bundlers, or frameworks (React, Vue, etc.)
- Do not set up local dev servers or emulators; assume remote-only workflows
- Do not change tool URLs without verifying they exist and work
- Do not remove Sentry or other third-party scripts without explicit approval
- Do not add new heavy dependencies or external libraries without approval

## Cloudflare Pages Deployment

- **Build command**: (empty)
- **Build output directory**: `/`
- The repo root is served as-is; no build or compilation

## Safety and Permissions

**Allowed without explicit approval:**
- Read and edit `index.html`, `script.js`, `sitemap.xml`
- Add or update nav items, styles, and minor UI changes

**Ask first:**
- Adding or removing third-party scripts (Sentry, analytics, etc.)
- Changing deployment configuration or domain references
- Structural changes to the layout or navigation model

## When Stuck

- Ask a clarifying question or propose a short plan before making large changes
- Do not push broad speculative changes without confirmation
