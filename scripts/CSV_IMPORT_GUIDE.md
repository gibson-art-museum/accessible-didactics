# CSV Import Guide

This guide explains how to bulk import exhibition and artwork data using CSV files.

## Quick Start

1. Create a CSV file with your exhibition and works data
2. Run the import script:
   ```bash
   npm run import-csv path/to/your/file.csv
   ```
3. The script will generate markdown files in `content/exhibitions/`

## CSV Format

Your CSV file must have the following columns (in this order):

| Column | Description | Required | Example |
|--------|-------------|----------|---------|
| `exhibition_id` | Unique ID for the exhibition (used in URL) | Yes | `post-impressionism` |
| `exhibition_title` | Full title of the exhibition | Yes | `Post-Impressionism Masters` |
| `exhibition_description` | Brief description of the exhibition | Yes | `A collection of masterworks...` |
| `exhibition_location` | Physical location in the gallery | No | `Main Gallery, Second Floor` |
| `work_anchor` | Anchor ID for the work (used in URL hash) | Yes | `starry-night` |
| `work_title` | Title of the artwork | Yes | `Starry Night` |
| `work_artist` | Artist name | No | `Vincent van Gogh` |
| `work_location` | Specific location of the work | No | `Gallery A, East Wall` |
| `work_description` | Description of the artwork | No | `This iconic painting...` |
| `work_technical_details` | Technical information | No | `Oil on canvas, 73.7 cm × 92.1 cm` |
| `work_historical_context` | Historical background | No | `Van Gogh created this...` |

## Important Rules

### Multiple Works in One Exhibition

To add multiple works to the same exhibition, repeat the exhibition information on each row:

```csv
exhibition_id,exhibition_title,exhibition_description,exhibition_location,work_anchor,work_title,work_artist,work_location,work_description,work_technical_details,work_historical_context
post-impressionism,"Post-Impressionism Masters","A collection...","Main Gallery",starry-night,"Starry Night","Vincent van Gogh","Gallery A","Description...","Technical...","Context..."
post-impressionism,"Post-Impressionism Masters","A collection...","Main Gallery",sunflowers,"Sunflowers","Vincent van Gogh","Gallery B","Description...","Technical...","Context..."
```

The script will automatically group all works with the same `exhibition_id` into one exhibition file.

### Handling Commas and Quotes

- **Commas in text**: Wrap the field in double quotes
  ```csv
  "A collection of works from Van Gogh, Cézanne, and others"
  ```

- **Quotes in text**: Escape them or use single quotes inside double quotes
  ```csv
  "Van Gogh's 'Starry Night' is one of his most famous works"
  ```

### ID Formatting Guidelines

**Exhibition IDs** (used in URLs):
- Use lowercase letters, numbers, and hyphens only
- No spaces or special characters
- Example: `post-impressionism`, `modern-art-2024`

**Work Anchors** (used in URL hashes):
- Use lowercase letters, numbers, and hyphens only
- Keep them short but descriptive
- Example: `starry-night`, `sunflowers`, `mont-sainte-victoire`

## Sample Template

A sample CSV template is provided at `scripts/sample-template.csv`. You can copy this and modify it with your data.

## Example Usage

### Example 1: Import a single exhibition

Create a file `my-exhibition.csv`:

```csv
exhibition_id,exhibition_title,exhibition_description,exhibition_location,work_anchor,work_title,work_artist,work_location,work_description,work_technical_details,work_historical_context
impressionism,"Impressionist Landscapes","Beautiful landscapes from the Impressionist movement","East Wing",water-lilies,"Water Lilies","Claude Monet","Room 101","Monet's famous water lily pond series","Oil on canvas, 100 cm × 200 cm","Painted in his garden at Giverny"
impressionism,"Impressionist Landscapes","Beautiful landscapes from the Impressionist movement","East Wing",poppies,"Poppies","Claude Monet","Room 101","A field of vibrant red poppies","Oil on canvas, 50 cm × 65 cm","One of Monet's earliest Impressionist works"
```

Import it:
```bash
npm run import-csv my-exhibition.csv
```

This creates `/content/exhibitions/impressionism.md` with 2 works.

### Example 2: Google Sheets Workflow

1. Create a Google Sheet with the columns above
2. Fill in your exhibition and works data
3. Download as CSV: File → Download → Comma Separated Values (.csv)
4. Import the CSV file

## Generated URLs

After importing, your content will be accessible at:

- Exhibition page: `https://yoursite.com/exhibition/{exhibition_id}`
- Specific work: `https://yoursite.com/exhibition/{exhibition_id}#{work_anchor}`

For example, with the CSV above:
- `https://yoursite.com/exhibition/impressionism` - Shows all works
- `https://yoursite.com/exhibition/impressionism#water-lilies` - Jumps to Water Lilies
- `https://yoursite.com/exhibition/impressionism#poppies` - Jumps to Poppies

## NFC Tag Programming

When programming your NFC tags, use the full URL with the anchor:

```
https://yoursite.com/exhibition/impressionism#water-lilies
```

This will:
1. Load the exhibition page
2. Automatically scroll to the specific artwork
3. Focus the heading for screen readers

## Troubleshooting

**Error: File not found**
- Check the path to your CSV file
- Use relative or absolute paths

**Error: Missing columns**
- Ensure your CSV has all required columns in the correct order
- Check for typos in column names

**Malformed output**
- Check for unescaped quotes in your CSV data
- Ensure commas within fields are properly wrapped in quotes

**Works not grouped correctly**
- Verify the `exhibition_id` is identical across all rows for the same exhibition
- Check for extra spaces or typos

## After Import

1. Check the generated files in `content/exhibitions/`
2. Preview your site: `npm run dev`
3. Update `nuxt.config.ts` to add the new exhibition route to `nitro.prerender.routes`
4. Build for production: `npm run generate`
