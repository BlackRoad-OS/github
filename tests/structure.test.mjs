import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();

describe('Repository Structure', () => {
  const requiredFiles = [
    'README.md',
    'LICENSE',
    'CONTRIBUTING.md',
    'CODE_OF_CONDUCT.md',
    '.github/PULL_REQUEST_TEMPLATE.md',
    '.github/ISSUE_TEMPLATE/bug_report.md',
    '.github/ISSUE_TEMPLATE/feature_request.md',
  ];

  for (const file of requiredFiles) {
    it(`should have required file: ${file}`, () => {
      const filePath = join(ROOT, file);
      assert.ok(existsSync(filePath), `Missing required file: ${file}`);
    });
  }

  const requiredDirs = [
    '.github',
    '.github/ISSUE_TEMPLATE',
  ];

  for (const dir of requiredDirs) {
    it(`should have required directory: ${dir}`, () => {
      const dirPath = join(ROOT, dir);
      assert.ok(existsSync(dirPath), `Missing required directory: ${dir}`);
      assert.ok(statSync(dirPath).isDirectory(), `${dir} should be a directory`);
    });
  }

  it('should have non-empty README.md', () => {
    const stat = statSync(join(ROOT, 'README.md'));
    assert.ok(stat.size > 0, 'README.md should not be empty');
  });

  it('should have non-empty LICENSE', () => {
    const stat = statSync(join(ROOT, 'LICENSE'));
    assert.ok(stat.size > 0, 'LICENSE should not be empty');
  });

  it('should have a .git directory (valid git repo)', () => {
    assert.ok(existsSync(join(ROOT, '.git')), 'Repository should be a git repo');
  });
});
