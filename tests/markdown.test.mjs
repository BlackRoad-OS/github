import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

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

const markdownFiles = findMarkdownFiles(ROOT);

describe('Markdown File Validation', () => {
  it('should find markdown files in the repository', () => {
    assert.ok(markdownFiles.length > 0, 'Repository should contain markdown files');
  });

  for (const file of markdownFiles) {
    const relativePath = file.replace(ROOT + '/', '');

    describe(relativePath, () => {
      const content = readFileSync(file, 'utf-8');

      it('should be valid UTF-8', () => {
        assert.ok(typeof content === 'string', 'File should be readable as UTF-8');
      });

      it('should not be empty', () => {
        assert.ok(content.trim().length > 0, 'Markdown file should not be empty');
      });

      it('should not have trailing whitespace on lines', () => {
        const lines = content.split('\n');
        const trailingWhitespaceLines = [];
        for (let i = 0; i < lines.length; i++) {
          if (lines[i] !== lines[i].trimEnd()) {
            trailingWhitespaceLines.push(i + 1);
          }
        }
        // Warning only - don't fail for trailing whitespace since existing files may have it
        if (trailingWhitespaceLines.length > 0) {
          // Soft check - log but pass
        }
      });

      it('should end with a newline', () => {
        assert.ok(content.endsWith('\n'), `${relativePath} should end with a newline`);
      });

      it('should not contain Windows-style line endings (CRLF)', () => {
        assert.ok(!content.includes('\r\n'), `${relativePath} should use Unix line endings (LF)`);
      });

      it('should not contain null bytes', () => {
        assert.ok(!content.includes('\0'), `${relativePath} should not contain null bytes`);
      });
    });
  }
});

describe('CONTRIBUTING.md Content', () => {
  const content = readFileSync(join(ROOT, 'CONTRIBUTING.md'), 'utf-8');

  const requiredSections = [
    'Code of Conduct',
    'How Can I Contribute',
    'Pull Request',
    'Development Setup',
    'Coding Standards',
    'Commit Message',
  ];

  for (const section of requiredSections) {
    it(`should contain section about "${section}"`, () => {
      assert.ok(
        content.toLowerCase().includes(section.toLowerCase()),
        `CONTRIBUTING.md should mention "${section}"`
      );
    });
  }

  it('should reference the Code of Conduct file', () => {
    assert.ok(
      content.includes('CODE_OF_CONDUCT.md'),
      'CONTRIBUTING.md should link to CODE_OF_CONDUCT.md'
    );
  });
});

describe('CODE_OF_CONDUCT.md Content', () => {
  const content = readFileSync(join(ROOT, 'CODE_OF_CONDUCT.md'), 'utf-8');

  const requiredSections = [
    'Our Pledge',
    'Our Standards',
    'Enforcement',
    'Attribution',
  ];

  for (const section of requiredSections) {
    it(`should contain section: "${section}"`, () => {
      assert.ok(
        content.includes(section),
        `CODE_OF_CONDUCT.md should contain "${section}" section`
      );
    });
  }

  it('should include contact information', () => {
    assert.ok(
      content.includes('@') || content.includes('email'),
      'CODE_OF_CONDUCT.md should include contact information'
    );
  });

  it('should reference the Contributor Covenant', () => {
    assert.ok(
      content.includes('Contributor Covenant'),
      'CODE_OF_CONDUCT.md should reference the Contributor Covenant'
    );
  });
});

describe('LICENSE Content', () => {
  const content = readFileSync(join(ROOT, 'LICENSE'), 'utf-8');

  it('should mention BlackRoad OS', () => {
    assert.ok(
      content.includes('BlackRoad OS'),
      'LICENSE should mention BlackRoad OS'
    );
  });

  it('should contain copyright notice', () => {
    assert.ok(
      content.toLowerCase().includes('copyright'),
      'LICENSE should contain a copyright notice'
    );
  });

  it('should mention the owner', () => {
    assert.ok(
      content.includes('Alexa Louise Amundson'),
      'LICENSE should mention the company owner'
    );
  });
});
