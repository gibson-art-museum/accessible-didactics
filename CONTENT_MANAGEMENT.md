# Content Management Guide

This guide explains how to add, edit, and manage content for the Gibson Accessible Exhibition Didactics website.

## Content Structure

All tag content is stored as Markdown files in the `content/tags/` directory. Each file represents one NFC tag.

### File Naming Convention

Files should be named using the tag ID with a `.md` extension:

- `001.md` → Accessible at `/tag/001`
- `gallery-a-painting-5.md` → Accessible at `/tag/gallery-a-painting-5`
- `exhibit-42.md` → Accessible at `/tag/exhibit-42`

**Important:** File names must match exactly what's programmed into the NFC tags.

## Creating New Tag Content

### Method 1: Manual File Creation

1. Create a new `.md` file in `content/tags/`
2. Add frontmatter metadata at the top
3. Write the content in Markdown below the frontmatter

**Example:**

```markdown
---
tag_id: '001'
title: 'Artwork Title'
location: 'Gallery A, East Wall'
created_at: '2025-10-18'
updated_at: '2025-10-18'
related_tags: ['002', '003']
---

Your content goes here. You can use **bold**, _italic_, and other Markdown formatting.

## Subheadings

Add sections with H2 headings like this.

- Bullet points
- Are also supported
- For lists
```

### Method 2: CSV Import (Bulk Upload)

For adding multiple tags at once, you can use a CSV file and convert it to Markdown files.

#### CSV Format

Create a CSV file with these columns:

```csv
tag_id,title,location,content,related_tags
001,"Starry Night","Gallery A, East Wall","This iconic painting from 1889...","002;003"
002,"The Persistence of Memory","Gallery B, North Wall","Created in 1931...","001"
```

**Column Descriptions:**

- `tag_id`: Unique identifier (required)
- `title`: Display title (required)
- `location`: Physical location (optional)
- `content`: Main text content (required)
- `related_tags`: Semicolon-separated list of related tag IDs (optional)

#### CSV to Markdown Conversion Script

Create a simple Node.js script to convert CSV to Markdown files:

```javascript
// csv-to-markdown.js
import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'

const csvFile = process.argv[2]
if (!csvFile) {
  console.error('Usage: node csv-to-markdown.js <csv-file>')
  process.exit(1)
}

const csvContent = fs.readFileSync(csvFile, 'utf-8')
const records = parse(csvContent, {
  columns: true,
  skip_empty_lines: true,
})

const outputDir = './content/tags'
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

records.forEach((record) => {
  const relatedTags = record.related_tags
    ? record.related_tags
        .split(';')
        .map((t) => `'${t.trim()}'`)
        .join(', ')
    : ''

  const frontmatter = `---
tag_id: '${record.tag_id}'
title: '${record.title}'
location: '${record.location || ''}'
created_at: '${new Date().toISOString().split('T')[0]}'
updated_at: '${new Date().toISOString().split('T')[0]}'
related_tags: [${relatedTags}]
---

${record.content}
`

  const filename = path.join(outputDir, `${record.tag_id}.md`)
  fs.writeFileSync(filename, frontmatter)
  console.log(`Created: ${filename}`)
})

console.log(`\nImported ${records.length} tags successfully!`)
```

**To use:**

```bash
npm install csv-parse
node csv-to-markdown.js tags.csv
```

## Editing Existing Content

1. Open the corresponding `.md` file in `content/tags/`
2. Edit the frontmatter or content
3. Update the `updated_at` field to today's date
4. Save the file

The changes will be live immediately in development mode, or after rebuilding in production.

## Frontmatter Fields

### Required Fields

- `tag_id` (string): Unique identifier matching the NFC tag
- `title` (string): Display title for the content
- `created_at` (string): Date in YYYY-MM-DD format
- `updated_at` (string): Date in YYYY-MM-DD format

### Optional Fields

- `location` (string): Physical location of the item
- `related_tags` (array): List of related tag IDs, e.g., `['002', '003']`
- `description` (string): Short description for meta tags

## Markdown Formatting

The content body supports standard Markdown:

```markdown
# H1 Heading (avoid - use H2 instead for semantic hierarchy)

## H2 Heading

### H3 Heading

**Bold text**
_Italic text_

[Link text](https://example.com)

- Bullet point 1
- Bullet point 2

1. Numbered list item 1
2. Numbered list item 2

> Blockquote
```

### Accessibility Best Practices

1. **Use proper heading hierarchy**: Start with H2, then H3, don't skip levels
2. **Write descriptive link text**: "View the gallery map" not "click here"
3. **Keep paragraphs short**: 2-4 sentences for easier reading
4. **Use lists for multiple items**: Helps screen reader users
5. **Avoid ALL CAPS**: Screen readers may read it letter by letter
6. **Spell out abbreviations** on first use

## Testing Your Content

### Development Server

```bash
npm run dev
```

Visit `http://localhost:3000/tag/YOUR-TAG-ID` to preview.

### Accessibility Testing

1. Test with keyboard navigation (Tab, Enter, Shift+Tab)
2. Test with a screen reader:
   - **Mac**: VoiceOver (Cmd+F5)
   - **Windows**: NVDA (free) or JAWS
3. Test the "Read Aloud" button
4. Test high contrast mode toggle

## Deployment

After adding or editing content:

```bash
# Generate static site
npm run generate

# Output will be in .output/public/
# Deploy this folder to your hosting platform
```

## Backup Strategy

Regularly backup the `content/tags/` directory:

```bash
# Create backup
tar -czf tags-backup-$(date +%Y%m%d).tar.gz content/tags/

# Or commit to git
git add content/tags/
git commit -m "Update tag content"
git push
```

## Troubleshooting

### Tag not showing up

1. Check filename matches tag ID exactly
2. Verify frontmatter is valid YAML
3. Ensure file is in `content/tags/` directory
4. Restart dev server

### Formatting looks wrong

1. Check for unclosed Markdown syntax (missing \*\*, ], etc.)
2. Ensure blank lines between sections
3. Verify frontmatter is between `---` markers

### Related tags not working

1. Check that related tag IDs exist as files
2. Verify array format: `['001', '002']` with quotes
3. Make sure tag IDs match exactly (case-sensitive)

## Questions?

Refer to:

- Nuxt Content docs: https://content.nuxt.com
- Markdown guide: https://www.markdownguide.org
- WCAG accessibility: https://www.w3.org/WAI/WCAG21/quickref/
