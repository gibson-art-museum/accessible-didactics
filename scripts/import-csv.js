#!/usr/bin/env node

/**
 * CSV Import Script for Accessible Didactics
 *
 * This script imports exhibition and work data from CSV files and generates
 * markdown content files for Nuxt Content.
 *
 * Usage:
 *   node scripts/import-csv.js <csv-file-path>
 *
 * CSV Format for Exhibitions with Works:
 *   exhibition_id, exhibition_title, exhibition_description, exhibition_location, work_anchor, work_title, work_artist, work_location, work_description, work_technical_details, work_historical_context
 *
 * Example:
 *   post-impressionism,"Post-Impressionism Masters","A collection of masterworks...","Main Gallery",starry-night,"Starry Night","Vincent van Gogh","Gallery A","This iconic painting...","Oil on canvas...","Van Gogh created..."
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Parse CSV line handling quoted fields with commas
function parseCSVLine(line) {
  const result = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }

  result.push(current.trim())
  return result
}

// Parse CSV file
function parseCSV(content) {
  const lines = content.split('\n').filter(line => line.trim())
  const headers = parseCSVLine(lines[0])

  return lines.slice(1).map(line => {
    const values = parseCSVLine(line)
    const obj = {}
    headers.forEach((header, index) => {
      obj[header.trim()] = values[index] || ''
    })
    return obj
  })
}

// Group rows by exhibition_id
function groupByExhibition(rows) {
  const exhibitions = {}

  rows.forEach(row => {
    const exhibitionId = row.exhibition_id

    if (!exhibitions[exhibitionId]) {
      exhibitions[exhibitionId] = {
        exhibition_id: exhibitionId,
        title: row.exhibition_title,
        description: row.exhibition_description,
        location: row.exhibition_location,
        works: []
      }
    }

    // Add work to exhibition
    if (row.work_anchor && row.work_title) {
      exhibitions[exhibitionId].works.push({
        anchor: row.work_anchor,
        title: row.work_title,
        artist: row.work_artist || '',
        location: row.work_location || '',
        description: row.work_description || '',
        technical_details: row.work_technical_details || '',
        historical_context: row.work_historical_context || ''
      })
    }
  })

  return Object.values(exhibitions)
}

// Generate markdown frontmatter
function generateMarkdown(exhibition) {
  const now = new Date().toISOString().split('T')[0]

  let markdown = '---\n'
  markdown += `exhibition_id: '${exhibition.exhibition_id}'\n`
  markdown += `title: '${exhibition.title.replace(/'/g, "\\'")}'\n`
  markdown += `description: '${exhibition.description.replace(/'/g, "\\'")}'\n`
  markdown += `location: '${exhibition.location.replace(/'/g, "\\'")}'\n`
  markdown += `created_at: '${now}'\n`
  markdown += `updated_at: '${now}'\n`

  if (exhibition.works.length > 0) {
    markdown += 'works:\n'
    exhibition.works.forEach(work => {
      markdown += `  - anchor: '${work.anchor}'\n`
      markdown += `    title: '${work.title.replace(/'/g, "\\'")}'\n`
      if (work.artist) markdown += `    artist: '${work.artist.replace(/'/g, "\\'")}'\n`
      if (work.location) markdown += `    location: '${work.location.replace(/'/g, "\\'")}'\n`
      if (work.description) markdown += `    description: '${work.description.replace(/'/g, "\\'")}'\n`
      if (work.technical_details) markdown += `    technical_details: '${work.technical_details.replace(/'/g, "\\'")}'\n`
      if (work.historical_context) markdown += `    historical_context: '${work.historical_context.replace(/'/g, "\\'")}'\n`
    })
  }

  markdown += '---\n'

  return markdown
}

// Main function
function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.error('Usage: node scripts/import-csv.js <csv-file-path>')
    console.error('')
    console.error('CSV Format:')
    console.error('  exhibition_id, exhibition_title, exhibition_description, exhibition_location, work_anchor, work_title, work_artist, work_location, work_description, work_technical_details, work_historical_context')
    process.exit(1)
  }

  const csvPath = args[0]

  if (!existsSync(csvPath)) {
    console.error(`Error: File not found: ${csvPath}`)
    process.exit(1)
  }

  console.log(`Reading CSV file: ${csvPath}`)
  const csvContent = readFileSync(csvPath, 'utf-8')

  console.log('Parsing CSV...')
  const rows = parseCSV(csvContent)

  console.log('Grouping by exhibition...')
  const exhibitions = groupByExhibition(rows)

  console.log(`Found ${exhibitions.length} exhibition(s)`)

  // Create exhibitions directory if it doesn't exist
  const exhibitionsDir = join(__dirname, '..', 'content', 'exhibitions')
  if (!existsSync(exhibitionsDir)) {
    mkdirSync(exhibitionsDir, { recursive: true })
  }

  // Generate markdown files
  exhibitions.forEach(exhibition => {
    const markdown = generateMarkdown(exhibition)
    const filename = `${exhibition.exhibition_id}.md`
    const filepath = join(exhibitionsDir, filename)

    writeFileSync(filepath, markdown, 'utf-8')
    console.log(`✓ Created: ${filename} (${exhibition.works.length} works)`)
  })

  console.log('')
  console.log('Import complete!')
}

main()
