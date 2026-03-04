# Gibson Accessible Exhibition Didactics

A fully accessible, mobile-first website for the **Gibson Art Museum at Simon Fraser University**. Visitors scan NFC tags on physical exhibition didactics to access detailed information about artworks — designed primarily for blind and visually impaired users.

Deployed to GitHub Pages at `/accessible-didactics/`.

---

## Features

- **Exhibition-based content model** — a single current exhibition page with all rooms and works, plus an archive of past exhibitions
- **Interactive SVG map** — clickable museum floor plan that jumps to individual room sections; inactive rooms (not part of the current exhibition) are automatically disabled
- **NFC-ready URLs** — tags link to `/exhibitions/current#room-id` for direct anchor navigation
- **Text-to-Speech** — reads artwork descriptions aloud via the Web Speech API
- **Accessibility controls** — high contrast mode toggle, adjustable text size
- **WCAG 2.1 Level AA** — semantic HTML, ARIA labels, keyboard navigation, skip link, visible focus indicators
- **PWA support** — installable and works offline
- **Static site generation** — deployed as flat HTML via `npm run generate`

---

## Tech Stack

| Tool                                                | Purpose                               |
| --------------------------------------------------- | ------------------------------------- |
| [Nuxt 3](https://nuxt.com/)                         | Framework (Vue 3, SSG)                |
| [@nuxt/content v2](https://content.nuxt.com/)       | Markdown content via `queryContent()` |
| [@vite-pwa/nuxt](https://vite-pwa-org.netlify.app/) | PWA / offline support                 |
| [TailwindCSS](https://tailwindcss.com/)             | Utility classes (minimal use)         |
| TypeScript                                          | Type safety throughout                |

---

## Project Structure

```
accessible-didactics/
├── app/
│   └── router.options.ts          # Custom scroll behaviour for hash navigation
├── assets/css/
│   └── main.css                   # Global styles and design tokens
├── components/
│   ├── AccessibilityControls.vue  # Contrast / text size toggles
│   ├── MapSection.vue             # Interactive SVG museum map
│   ├── SkipLink.vue               # Skip to main content
│   └── TextToSpeech.vue           # Read aloud button
├── content/
│   ├── exhibitions/
│   │   └── current.md             # Current exhibition (all rooms + works)
│   └── archive/
│       └── 2025-fall.md           # Past exhibitions (same structure)
├── layouts/
│   └── default.vue                # Site-wide header / footer / accessibility bar
├── pages/
│   ├── index.vue                  # Homepage (current + past exhibition cards)
│   ├── error.vue                  # 404 page
│   └── exhibitions/
│       ├── current.vue            # Current exhibition page with map
│       └── [slug].vue             # Archive exhibition page (e.g. /exhibitions/2025-fall)
├── public/
│   └── museum_map_only.png        # Base map image used by MapSection
├── nuxt.config.ts
└── REQUIREMENTS.md
```

---

## Content Model

### Current Exhibition — `content/exhibitions/current.md`

A single YAML frontmatter file. All rooms and works live here.

```yaml
---
title: 'Plain text title for SEO/meta'
display_title: 'HTML title with <em>italic exhibition names</em>'
description: 'Short description shown on homepage card'
date_start: '2026-03-07'
date_end: '2026-06-14'
rooms:
  - title: 'North Gallery'
    room_id: 'north-gallery' # Must match data-room on SVG + page anchor
    works:
      - anchor: 'work-slug' # Used for in-page anchor ID
        title: 'Work Title'
        year: '2024'
        artist: 'Artist Name'
        materials: 'Oil on canvas'
        collection: 'Collection name'
        location: 'North Gallery'
        description: 'Artwork description for screen readers and TTS.'
---
```

**To exclude a room from the current exhibition**, simply omit it from the `rooms:` array. The map region will be automatically disabled (non-clickable) and the room section will not render on the page.

### Available Room IDs

These `room_id` values correspond to regions on the SVG map. Use them exactly:

| Room                        | `room_id`            |
| --------------------------- | -------------------- |
| Arya and Hamid Eshghi Forum | `forum`              |
| North Gallery               | `north-gallery`      |
| Andrew Petter Hall          | `andrew-petter-hall` |
| Media Gallery               | `media-gallery`      |
| Salon                       | `salon`              |
| South Gallery               | `south-gallery`      |
| Library                     | `library`            |
| Shop                        | `shop`               |

### Archiving an Exhibition

1. Copy `content/exhibitions/current.md` to `content/archive/YYYY-season.md` (e.g. `2026-spring.md`)
2. Update `current.md` with the new exhibition's content
3. Add the archive slug to the prerender routes in `nuxt.config.ts`:
   ```ts
   nitro: {
     prerender: {
       routes: ['/', '/exhibitions/current', '/exhibitions/2026-spring']
     }
   }
   ```

The new archive will appear automatically in the "Past Exhibitions" section on the homepage and on the current exhibition page.

---

## NFC Tag Setup

NFC tags should be programmed with URLs in the format:

```
https://sfu-library.github.io/accessible-didactics/exhibitions/current#room-id
```

For example, a tag placed in the Salon would point to:

```
https://sfu-library.github.io/accessible-didactics/exhibitions/current#salon
```

**Hardware:** NTAG215 stickers + any NFC writing app (e.g. NFC Tools)  
**iPhone:** iOS 13+ reads NFC automatically  
**Android:** Android 5.0+ with NFC enabled  
**Requirement:** URLs must be HTTPS for iPhone compatibility

---

## Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Generate static site
npm run generate

# Preview the generated output
npm run preview
```

The generated static files are in `.output/public/`.

---

## Deployment (GitHub Pages)

The site is configured for GitHub Pages at base path `/accessible-didactics/`. This is set in `nuxt.config.ts`:

```ts
app: {
  baseURL: '/accessible-didactics/',
  cdnURL: '/accessible-didactics/',
}
```

To deploy, generate the site and push `.output/public/` to the `gh-pages` branch, or use a GitHub Actions workflow.

---

## Accessibility Testing

- **macOS VoiceOver:** ⌘ + F5
- **iOS VoiceOver:** Settings → Accessibility
- **NVDA (Windows):** [nvaccess.org](https://www.nvaccess.org/)
- **Keyboard nav:** Tab / Shift+Tab through all interactive elements
- **Automated:** [WAVE extension](https://wave.webaim.org/extension/) or [axe DevTools](https://www.deque.com/axe/devtools/)

Target: **Lighthouse Accessibility 95+**

---

## Troubleshooting

**Dev server won't start:**

```bash
rm -rf .nuxt node_modules package-lock.json
npm install
npm run dev
```

**Map region not clicking:**  
Check that the `room_id` in your content file exactly matches the `data-room` attribute on the SVG shape in `MapSection.vue`.

**Anchor not scrolling to room:**  
Ensure the room's `room_id` is present in the `rooms:` array — omitted rooms have their anchors removed from the DOM.
