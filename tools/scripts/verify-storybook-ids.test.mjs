import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { collectStorybookTags, verifyTags } from './verify-storybook-ids.mjs';

describe('collectStorybookTags', () => {
  test('reads project and story whatever the attribute order and quotes', () => {
    const markdown = [
      '# Button',
      '',
      '{% storybook project="angular" story="components-button--playground" height=320 /%}',
      '',
      "{% storybook story='smart-form-form--playground' project='crud-shell-angular' /%}",
      '',
      'Plain text with no tag.',
    ].join('\n');

    const tags = collectStorybookTags(
      markdown,
      'docs/components/button/page.md',
    );

    assert.deepEqual(tags, [
      {
        project: 'angular',
        story: 'components-button--playground',
        file: 'docs/components/button/page.md',
        line: 3,
      },
      {
        project: 'crud-shell-angular',
        story: 'smart-form-form--playground',
        file: 'docs/components/button/page.md',
        line: 5,
      },
    ]);
  });
});

const indexes = {
  angular: {
    v: 5,
    entries: {
      'components-button--playground': {
        id: 'components-button--playground',
        type: 'story',
      },
      'components-button--docs': {
        id: 'components-button--docs',
        type: 'docs',
      },
    },
  },
  'crud-shell-angular': null,
};

function tag(overrides) {
  return {
    project: 'angular',
    story: 'components-button--playground',
    file: 'docs/components/button/page.md',
    line: 19,
    ...overrides,
  };
}

describe('verifyTags', () => {
  test('reports nothing when every tag resolves to a story', () => {
    assert.deepEqual(verifyTags([tag()], indexes), []);
  });

  test('reports a project without a build', () => {
    const findings = verifyTags(
      [tag({ project: 'crud-shell-angular' })],
      indexes,
    );

    assert.equal(findings.length, 1);
    assert.equal(findings[0].project, 'crud-shell-angular');
    assert.match(
      findings[0].message,
      /no Storybook build for project "crud-shell-angular"/,
    );
  });

  test('reports an unknown story id', () => {
    const findings = verifyTags(
      [tag({ story: 'components-button--gone' })],
      indexes,
    );

    assert.equal(findings.length, 1);
    assert.deepEqual(
      { file: findings[0].file, line: findings[0].line },
      { file: 'docs/components/button/page.md', line: 19 },
    );
    assert.match(
      findings[0].message,
      /unknown story "components-button--gone" for project "angular"/,
    );
  });

  test('reports a docs entry used as a story', () => {
    const findings = verifyTags(
      [tag({ story: 'components-button--docs' })],
      indexes,
    );

    assert.equal(findings.length, 1);
    assert.match(
      findings[0].message,
      /"components-button--docs" is a docs entry, not a story/,
    );
  });
});

const cli = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  'verify-storybook-ids.mjs',
);

function write(file, contents) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, contents);
}

/** A workspace with one page and one built Storybook, as the real repo has. */
function fixtureRoot({
  story = 'components-button--playground',
  build = true,
}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sb-ids-'));

  write(
    path.join(root, 'docs/site/src/app/docs/components/button/page.md'),
    `# Button\n\n{% storybook project="angular" story="${story}" height=320 /%}\n`,
  );

  if (build) {
    write(
      path.join(root, 'dist/storybook/angular/index.json'),
      JSON.stringify({
        v: 5,
        entries: {
          'components-button--playground': {
            id: 'components-button--playground',
            type: 'story',
          },
        },
      }),
    );
  }

  return root;
}

function run(root) {
  return spawnSync(process.execPath, [cli, '--root', root], {
    encoding: 'utf8',
  });
}

describe('verify-storybook-ids CLI', () => {
  test('exits 0 and counts the tags when every id resolves', () => {
    const result = run(fixtureRoot({}));

    assert.equal(result.status, 0);
    assert.match(
      result.stdout,
      /verify-storybook-ids: 1 tags, 1 projects, 0 errors/,
    );
  });

  test('exits 1 and points at the page and line for an unknown id', () => {
    const result = run(fixtureRoot({ story: 'components-button--gone' }));

    assert.equal(result.status, 1);
    assert.match(
      result.stdout,
      /docs\/components\/button\/page\.md:3: unknown story "components-button--gone" for project "angular"/,
    );
    assert.match(
      result.stdout,
      /verify-storybook-ids: 1 tags, 1 projects, 1 errors/,
    );
  });

  test('exits 1 and names the missing index.json when a project has no build', () => {
    const result = run(fixtureRoot({ build: false }));

    assert.equal(result.status, 1);
    assert.match(
      result.stdout,
      /no Storybook build for project "angular" \(expected dist\/storybook\/angular\/index\.json\)/,
    );
  });
});
