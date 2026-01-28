#!/usr/bin/env node
/**
 * Reads events-content/<category>/*.md (YAML frontmatter), writes events-data.json.
 * Newest event first in each category. Run from project root: node build-events.js
 */
const fs = require('fs');
const path = require('path');

const EVENTS_ROOT = path.join(__dirname, 'events-content');
const OUT_PATH = path.join(__dirname, 'events-data.json');
const CATEGORIES = ['general_meetings', 'workshops', 'socials', 'information_sessions', 'competitions', 'conferences'];
const SKIP = new Set(['README.md', 'template.md']);

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const block = match[1];
  const obj = {};
  const lines = block.split(/\r?\n/);
  let key = null;
  let value = '';
  let inList = false;
  let listKey = null;
  const list = [];

  function flush() {
    if (key) {
      const v = value.trim().replace(/^["']|["']$/g, '');
      if (listKey && listKey === key) obj[key] = list.length ? list.slice() : [v];
      else obj[key] = v;
    }
    key = null;
    value = '';
    listKey = null;
    list.length = 0;
    inList = false;
  }

  for (const line of lines) {
    const listItem = line.match(/^\s*-\s+(.*)$/);
    if (listItem) {
      const v = listItem[1].trim().replace(/^["']|["']$/g, '');
      if (inList && listKey) {
        list.push(v);
        continue;
      }
      if (key) flush();
      key = 'images';
      inList = true;
      listKey = 'images';
      list.push(v);
      continue;
    }
    const colon = line.indexOf(':');
    if (colon > 0 && /^\s*[a-z_]+\s*:/.test(line)) {
      if (key) flush();
      key = line.slice(0, colon).trim();
      value = line.slice(colon + 1).trim();
      inList = key === 'images' && value === '';
      if (!inList) listKey = null;
      continue;
    }
    if (key && (line.startsWith('  ') || line.startsWith('\t'))) {
      value += '\n' + line;
      continue;
    }
  }
  if (key) {
    if (inList && listKey && list.length) obj[listKey] = list.slice();
    else obj[key] = value.trim().replace(/^["']|["']$/g, '');
  }
  if (obj.images && typeof obj.images === 'string') obj.images = [obj.images];
  return obj;
}

function main() {
  const out = {};
  for (const cat of CATEGORIES) {
    const dir = path.join(EVENTS_ROOT, cat);
    if (!fs.existsSync(dir)) {
      out[cat] = [];
      continue;
    }
    const files = fs.readdirSync(dir).filter((n) => n.endsWith('.md') && !SKIP.has(n));
    const events = [];
    for (const name of files) {
      const filePath = path.join(dir, name);
      const raw = fs.readFileSync(filePath, 'utf8');
      const data = parseFrontmatter(raw);
      if (data && data.name) {
        events.push({
          name: data.name,
          date: data.date || '',
          summary: data.summary || '',
          images: Array.isArray(data.images) ? data.images : (data.images ? [data.images] : []),
        });
      }
    }
    events.sort((a, b) => (b.date || '').localeCompare(a.date || '')); // newest first
    out[cat] = events;
  }
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2), 'utf8');
  const total = Object.values(out).reduce((s, arr) => s + arr.length, 0);
  console.log('Wrote', total, 'events across', CATEGORIES.length, 'categories to', OUT_PATH);
}

main();
