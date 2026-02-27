import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const frontmatter = {};
  for (const line of match[1].split('\n')) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > -1) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim().replace(/^['"]|['"]$/g, '');
      frontmatter[key] = value;
    }
  }
  return frontmatter;
}

describe('Bug Report Template', () => {
  const filePath = join(ROOT, '.github/ISSUE_TEMPLATE/bug_report.md');
  const content = readFileSync(filePath, 'utf-8');

  it('should have valid frontmatter', () => {
    const fm = parseFrontmatter(content);
    assert.ok(fm, 'Bug report template should have YAML frontmatter');
  });

  it('should have a name in frontmatter', () => {
    const fm = parseFrontmatter(content);
    assert.ok(fm.name, 'Bug report template should have a name');
    assert.ok(fm.name.toLowerCase().includes('bug'), 'Template name should mention "bug"');
  });

  it('should have an about description', () => {
    const fm = parseFrontmatter(content);
    assert.ok(fm.about, 'Bug report template should have an "about" field');
  });

  it('should have labels defined', () => {
    const fm = parseFrontmatter(content);
    assert.ok(fm.labels, 'Bug report template should define labels');
    assert.ok(fm.labels.includes('bug'), 'Bug report should include "bug" label');
  });

  it('should have a title prefix', () => {
    const fm = parseFrontmatter(content);
    assert.ok(fm.title, 'Bug report template should have a title prefix');
    assert.ok(fm.title.includes('[BUG]'), 'Title should include [BUG] prefix');
  });

  const requiredSections = [
    'Bug Description',
    'Steps to Reproduce',
    'Expected Behavior',
    'Actual Behavior',
    'Environment',
  ];

  for (const section of requiredSections) {
    it(`should contain section: "${section}"`, () => {
      assert.ok(
        content.includes(section),
        `Bug report template should contain "${section}" section`
      );
    });
  }
});

describe('Feature Request Template', () => {
  const filePath = join(ROOT, '.github/ISSUE_TEMPLATE/feature_request.md');
  const content = readFileSync(filePath, 'utf-8');

  it('should have valid frontmatter', () => {
    const fm = parseFrontmatter(content);
    assert.ok(fm, 'Feature request template should have YAML frontmatter');
  });

  it('should have a name in frontmatter', () => {
    const fm = parseFrontmatter(content);
    assert.ok(fm.name, 'Feature request template should have a name');
    assert.ok(
      fm.name.toLowerCase().includes('feature'),
      'Template name should mention "feature"'
    );
  });

  it('should have an about description', () => {
    const fm = parseFrontmatter(content);
    assert.ok(fm.about, 'Feature request template should have an "about" field');
  });

  it('should have labels defined', () => {
    const fm = parseFrontmatter(content);
    assert.ok(fm.labels, 'Feature request template should define labels');
    assert.ok(fm.labels.includes('enhancement'), 'Feature request should include "enhancement" label');
  });

  it('should have a title prefix', () => {
    const fm = parseFrontmatter(content);
    assert.ok(fm.title, 'Feature request template should have a title prefix');
    assert.ok(fm.title.includes('[FEATURE]'), 'Title should include [FEATURE] prefix');
  });

  const requiredSections = [
    'Feature Description',
    'Proposed Solution',
    'Alternatives Considered',
    'Impact',
    'Acceptance Criteria',
  ];

  for (const section of requiredSections) {
    it(`should contain section: "${section}"`, () => {
      assert.ok(
        content.includes(section),
        `Feature request template should contain "${section}" section`
      );
    });
  }

  it('should include BlackRoad OS alignment checklist', () => {
    assert.ok(
      content.includes('BlackRoad OS Alignment'),
      'Feature request should include BlackRoad OS alignment section'
    );
  });

  it('should check for sovereignty principle', () => {
    assert.ok(
      content.toLowerCase().includes('sovereignty') || content.toLowerCase().includes('user control'),
      'Feature request should check for sovereignty principle'
    );
  });

  it('should check for privacy principle', () => {
    assert.ok(
      content.toLowerCase().includes('privacy') || content.toLowerCase().includes('telemetry'),
      'Feature request should check for privacy principle'
    );
  });

  it('should check for offline-first principle', () => {
    assert.ok(
      content.toLowerCase().includes('offline'),
      'Feature request should check for offline-first principle'
    );
  });
});

describe('Pull Request Template', () => {
  const filePath = join(ROOT, '.github/PULL_REQUEST_TEMPLATE.md');
  const content = readFileSync(filePath, 'utf-8');

  it('should have a description section', () => {
    assert.ok(
      content.includes('Description'),
      'PR template should include a Description section'
    );
  });

  it('should have a related issue section', () => {
    assert.ok(
      content.includes('Related Issue') || content.includes('Fixes #'),
      'PR template should reference related issues'
    );
  });

  it('should have a change type section', () => {
    assert.ok(
      content.includes('Type of Change'),
      'PR template should include a Type of Change section'
    );
  });

  const changeTypes = ['Bug fix', 'New feature', 'Breaking change', 'Documentation'];

  for (const type of changeTypes) {
    it(`should list change type: "${type}"`, () => {
      assert.ok(
        content.includes(type),
        `PR template should list "${type}" as a change type`
      );
    });
  }

  it('should have a testing section', () => {
    assert.ok(
      content.includes('Testing'),
      'PR template should include a Testing section'
    );
  });

  it('should have a testing checklist', () => {
    assert.ok(
      content.includes('existing tests pass'),
      'PR template should check that existing tests pass'
    );
    assert.ok(
      content.includes('New tests added'),
      'PR template should encourage new tests'
    );
  });

  it('should include BlackRoad OS principles checklist', () => {
    assert.ok(
      content.includes('BlackRoad OS Principles'),
      'PR template should include BlackRoad OS Principles section'
    );
  });

  it('should check for sovereignty in PR review', () => {
    assert.ok(
      content.toLowerCase().includes('sovereignty'),
      'PR template should verify sovereignty principle'
    );
  });

  it('should check for privacy in PR review', () => {
    assert.ok(
      content.toLowerCase().includes('privacy'),
      'PR template should verify privacy principle'
    );
  });

  it('should check for offline capability in PR review', () => {
    assert.ok(
      content.toLowerCase().includes('offline'),
      'PR template should verify offline capability'
    );
  });
});
