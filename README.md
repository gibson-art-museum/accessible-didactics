# Gibson Accessible Exhibition Didactics Website

A fully accessible, mobile-first website for providing detailed content to blind and visually impaired users who tap NFC tags on physical exhibits, didactics, or informational materials.

## Features

### Core Functionality

- **Dynamic routing** for NFC tags at `/tag/[id]` URLs
- **Content management** using Nuxt Content with Markdown files
- **Progressive Web App (PWA)** support for offline access
- **Text-to-Speech** integration using Web Speech API

### Accessibility First

- **WCAG 2.1 Level AA compliant** design
- **Screen reader optimized** with semantic HTML and ARIA labels
- **Keyboard navigation** support with visible focus indicators
- **High contrast mode** toggle
- **Adjustable text size** controls
- **Skip to content** link for keyboard users
- **No keyboard traps** or auto-playing content

### User Experience

- Mobile-first responsive design
- Touch targets minimum 44x44px
- Fast load times optimized for 3G networks
- Clean, distraction-free layout
- Graceful error handling with helpful 404 page

## Tech Stack

- **Framework:** [Nuxt 3](https://nuxt.com/) (Vue.js)
- **Content:** [Nuxt Content](https://content.nuxt.com/) (Markdown-based)
- **Styling:** Custom SCSS with accessibility-first design tokens
- **PWA:** [@vite-pwa/nuxt](https://vite-pwa-org.netlify.app/)
- **TypeScript:** For type safety

## Project Structure

```
accessible-didactics/
├── assets/
│   └── css/
│       ├── _variables.scss       # Design tokens
│       └── main.scss              # Global styles
├── components/
│   ├── AccessibilityControls.vue # Contrast/text size controls
│   ├── SkipLink.vue               # Skip to main content
│   └── TextToSpeech.vue           # Read aloud functionality
├── content/
│   └── tags/                      # Tag content (Markdown files)
│       ├── 001.md
│       ├── 002.md
│       └── gallery-a-sculpture-1.md
├── layouts/
│   └── default.vue                # Main layout with header/footer
├── pages/
│   ├── index.vue                  # Home page
│   ├── error.vue                  # 404/error page
│   └── tag/
│       └── [id].vue               # Dynamic tag page
├── public/                        # Static assets
├── nuxt.config.ts                 # Nuxt configuration
├── CONTENT_MANAGEMENT.md          # Content editing guide
└── REQUIREMENTS.md                # Full project requirements
```

## Getting Started

### Prerequisites

- Node.js 20.17.0 or higher
- npm 10.x or higher

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server (with hot reload)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Adding Content

1. Create a new Markdown file in `content/tags/`:

```bash
# Example: Create tag for ID "003"
touch content/tags/003.md
```

2. Add frontmatter and content:

```markdown
---
tag_id: '003'
title: 'Your Title Here'
location: 'Gallery A, West Wall'
created_at: '2025-10-18'
updated_at: '2025-10-18'
related_tags: ['001', '002']
---

Your content goes here in Markdown format.

## Subheadings

Use H2 for main sections.
```

3. The tag will be immediately available at `/tag/003`

See [CONTENT_MANAGEMENT.md](./CONTENT_MANAGEMENT.md) for detailed instructions, including CSV bulk import.

## Building for Production

```bash
# Generate static site
npm run generate

# Preview the generated site
npm run preview
```

The static files will be in `.output/public/` ready for deployment.

## Deployment

### GitHub Pages

1. Update `nuxt.config.ts` with your site URL:

```typescript
runtimeConfig: {
  public: {
    siteUrl: 'https://yourusername.github.io/accessible-didactics'
  }
}
```

2. Generate and deploy:

```bash
npm run generate
# Push the .output/public/ directory to your gh-pages branch
```

### Netlify

1. Connect your Git repository
2. Build command: `npm run generate`
3. Publish directory: `.output/public`
4. Deploy!

### Vercel

```bash
npm install -g vercel
vercel
```

Follow the prompts to deploy.

## NFC Tag Setup

### Hardware Needed

- **NFC Reader/Writer:** ACR122U USB NFC Reader
- **NFC Tags:** NTAG215 stickers (compatible with iPhone and Android)
- **Software:** Any NFC writing app (e.g., NFC Tools)

### Programming Tags

1. Write the URL to each tag in NDEF format:

   ```
   https://yourdomain.com/tag/001
   ```

2. Test with your phone:
   - **iPhone:** iOS 13+ automatically reads NFC tags
   - **Android:** Most devices with Android 5.0+ support NFC

3. **Important:** URLs must use HTTPS for iPhone compatibility

### Tag ID Best Practices

- Use **alphanumeric characters** only (letters, numbers, hyphens)
- Keep IDs **short and memorable** (e.g., "001", "gallery-a-1")
- Use a **consistent naming scheme**
- Document your ID system in a spreadsheet

## Accessibility Testing

### Automated Testing

```bash
# Run Lighthouse audit
npm run build
npx lighthouse http://localhost:3000 --view
```

Target scores:

- Accessibility: 95+
- Performance: 85+
- Best Practices: 95+

### Manual Testing

#### Screen Readers

- **macOS:** VoiceOver (⌘ + F5)
- **Windows:** [NVDA](https://www.nvaccess.org/) (free)
- **iOS:** VoiceOver (Settings > Accessibility)
- **Android:** TalkBack (Settings > Accessibility)

#### Keyboard Navigation

1. Press `Tab` to move through interactive elements
2. Press `Enter` or `Space` to activate buttons/links
3. Press `Shift + Tab` to move backwards
4. Ensure all functionality is accessible

#### Color Contrast

Use browser extensions:

- [WAVE](https://wave.webaim.org/extension/)
- [axe DevTools](https://www.deque.com/axe/devtools/)

## Configuration

### Environment Variables

Create a `.env` file:

```bash
NUXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### PWA Settings

Edit `nuxt.config.ts` to customize PWA manifest:

```typescript
pwa: {
  manifest: {
    name: 'Your Site Name',
    short_name: 'Short Name',
    description: 'Your description',
    theme_color: '#0066cc'
  }
}
```

### Styling

Edit design tokens in `assets/css/_variables.scss`:

```scss
$color-primary: #0066cc; // Primary color
$font-size-base: 18px; // Base font size
$color-text: #1a1a1a; // Text color
```

## Browser Support

- iOS Safari 13+
- Android Chrome 5.0+
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Works without JavaScript (progressive enhancement)

## Performance Optimization

- Static site generation for instant loading
- Lazy-loaded components
- Optimized images (use `.webp` format)
- Minimal JavaScript bundle
- Service worker for offline caching

## Troubleshooting

### Dev server won't start

```bash
# Clear Nuxt cache and reinstall
rm -rf .nuxt node_modules package-lock.json
npm install
npm run dev
```

### Tags not loading

1. Check file exists in `content/tags/`
2. Verify filename matches tag ID
3. Check frontmatter YAML is valid
4. Restart dev server

### Accessibility issues

1. Run Lighthouse audit for specific problems
2. Test with actual screen readers
3. Verify keyboard navigation works
4. Check color contrast ratios

## Contributing

When contributing, please:

1. Follow existing code style
2. Test with screen readers
3. Maintain WCAG 2.1 Level AA compliance
4. Update documentation as needed
5. Write accessible, semantic HTML

## Support

For questions or issues:

- Review [REQUIREMENTS.md](./REQUIREMENTS.md) for project details
- Check [CONTENT_MANAGEMENT.md](./CONTENT_MANAGEMENT.md) for content help

## Acknowledgments

Built with accessibility as the top priority to make physical spaces more inclusive for blind and visually impaired visitors.

---

**Project Goals:** 95+ Lighthouse Accessibility Score | WCAG 2.1 Level AA | Fast Load Times | Offline Support
