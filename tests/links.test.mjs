import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, extname, dirname, resolve } from 'node:path';

const ROOT = process.cwd();

function findMarkdownFiles(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === '.git' || entry === 'node_modules') continue;
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      findMarkdownFiles(fullPath, files);
    } else if (extname(entry) === '.md') {
      files.push(fullPath);
    }
  }
  return files;
}

function extractInternalLinks(content) {
  const links = [];
  // Match markdown links: [text](path) — only local file paths, not URLs
  const linkRegex = /\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const href = match[2];
    // Skip external URLs, anchors, and template placeholders
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('#') || href.startsWith('mailto:')) {
      continue;
    }
    links.push({ text: match[1], href });
  }
  return links;
}

const markdownFiles = findMarkdownFiles(ROOT);

describe('Internal Link Validation', () => {
  for (const file of markdownFiles) {
    const relativePath = file.replace(ROOT + '/', '');
    const content = readFileSync(file, 'utf-8');
    const links = extractInternalLinks(content);

    if (links.length === 0) continue;

    describe(`Links in ${relativePath}`, () => {
      for (const link of links) {
        it(`link to "${link.href}" should resolve to an existing file`, () => {
          // Strip anchor from path
          const pathWithoutAnchor = link.href.split('#')[0];
          if (!pathWithoutAnchor) return; // Anchor-only link within same file

          const resolvedPath = resolve(dirname(file), pathWithoutAnchor);
          assert.ok(
            existsSync(resolvedPath),
            `Broken link in ${relativePath}: [${link.text}](${link.href}) -> file not found: ${resolvedPath}`
          );
        });
      }
    });
  }
});

describe('External URL Format Validation', () => {
  for (const file of markdownFiles) {
    const relativePath = file.replace(ROOT + '/', '');
    const content = readFileSync(file, 'utf-8');

    // Find all external URLs
    const urlRegex = /\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g;
    const urls = [];
    let match;
    while ((match = urlRegex.exec(content)) !== null) {
      urls.push({ text: match[1], url: match[2] });
    }

    if (urls.length === 0) continue;

    describe(`URLs in ${relativePath}`, () => {
      for (const { text, url } of urls) {
        it(`URL "${url}" should be well-formed`, () => {
          assert.doesNotThrow(() => new URL(url), `Malformed URL: ${url}`);
        });

        it(`URL "${url}" should use HTTPS`, () => {
          const parsed = new URL(url);
          // Allow http for localhost only
          if (parsed.hostname !== 'localhost' && parsed.hostname !== '127.0.0.1') {
            assert.equal(parsed.protocol, 'https:', `URL should use HTTPS: ${url}`);
          }
        });
      }
    });
  }
});
