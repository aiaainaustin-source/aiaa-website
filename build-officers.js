#!/usr/bin/env node
/**
 * Reads officers/*.md (YAML frontmatter), writes officers.json for the Officer Team page.
 * Run from project root: node build-officers.js
 */
const fs = require('fs');
const path = require('path');

const OFFICERS_DIR = path.join(__dirname, 'officers');
const OUT_PATH = path.join(__dirname, 'officers.json');
const SKIP = new Set(['README.md', 'template.md']);

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const block = match[1];
  const obj = {};
  const lines = block.split(/\r?\n/);
  let key = null;
  let value = '';
  for (const line of lines) {
    const colon = line.indexOf(':');
    if (colon > 0 && /^\s*[a-z]+\s*:/.test(line)) {
      if (key) obj[key] = value.trim().replace(/^["']|["']$/g, '');
      key = line.slice(0, colon).trim();
      value = line.slice(colon + 1).trim();
      if ((value.startsWith('"') && !value.endsWith('"')) || (value.startsWith("'") && !value.endsWith("'"))) {
        value = value.slice(1) + '\n';
        continue;
      }
    } else if (key && (line.startsWith('  ') || line.startsWith('\t'))) {
      value += '\n' + line;
      continue;
    }
    if (key) obj[key] = value.trim().replace(/^["']|["']$/g, '');
  }
  if (key) obj[key] = value.trim().replace(/^["']|["']$/g, '');
  return obj;
}

function main() {
  const names = fs.readdirSync(OFFICERS_DIR).filter((n) => n.endsWith('.md') && !SKIP.has(n));
  const officers = [];
  for (const name of names) {
    const filePath = path.join(OFFICERS_DIR, name);
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = parseFrontmatter(raw);
    if (data && data.name) {
      officers.push({
        name: data.name,
        role: data.role || '',
        image: data.image || '',
        sentence: data.sentence || '',
        quote: data.quote || '',
        linkedin: data.linkedin || '',
        email: data.email || '',
      });
    }
  }
  officers.sort((a, b) => a.name.localeCompare(b.name));
  fs.writeFileSync(OUT_PATH, JSON.stringify(officers, null, 2), 'utf8');
  console.log('Wrote', officers.length, 'officers to', OUT_PATH);
}

main();
