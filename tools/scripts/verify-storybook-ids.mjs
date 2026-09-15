/**
 * Checks that every `{% storybook %}` tag on the documentation site points at a
 * story that the matching static Storybook build actually contains, so a
 * deploy cannot ship an iframe that resolves to nothing.
 *
 * Usage: node tools/scripts/verify-storybook-ids.mjs [--root <repoRoot>]
 *   [--dist dist/storybook] [--pages docs/site/src/app]
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

/** The parsed contents of `file`, or `null` when it is missing or malformed. */
function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}

const TAG = /\{%\s*storybook\s+([^%]*?)\/%\}/g;

/** The `{% storybook %}` tags of one page, with the line each sits on. */
export function collectStorybookTags(markdown, file) {
  return [...markdown.matchAll(TAG)].map((match) => {
    const attributes = {};

    for (const attribute of match[1].matchAll(
      /(\w+)=(?:"([^"]*)"|'([^']*)')/g,
    )) {
      attributes[attribute[1]] = attribute[2] ?? attribute[3];
    }

    return {
      project: attributes.project ?? '',
      story: attributes.story ?? '',
      file,
      line: markdown.slice(0, match.index).split('\n').length,
    };
  });
}

/**
 * The problems in `tags`, given the built index of each project referenced by
 * the pages (`null` when that project has no build).
 */
export function verifyTags(tags, indexes) {
  const findings = [];

  for (const tag of tags) {
    const index = indexes[tag.project];
    const finding = (message) =>
      findings.push({
        file: tag.file,
        line: tag.line,
        project: tag.project,
        story: tag.story,
        message,
      });

    if (!index) {
      finding(`no Storybook build for project "${tag.project}"`);

      continue;
    }

    const entry = index.entries?.[tag.story];

    if (!entry) {
      finding(`unknown story "${tag.story}" for project "${tag.project}"`);

      continue;
    }

    if (entry.type !== 'story') {
      finding(`"${tag.story}" is a docs entry, not a story`);
    }
  }

  return findings;
}

/** The command line, defaulting to the layout of this repository. */
export function parseArgs(argv) {
  const value = (name, fallback) => {
    const index = argv.indexOf(name);

    return index === -1 ? fallback : argv[index + 1];
  };
  const defaultRoot = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '..',
    '..',
  );

  return {
    // `--root` is used by the tests to point the check at a fixture workspace.
    repoRoot: path.resolve(value('--root', defaultRoot)),
    dist: value('--dist', 'dist/storybook'),
    pages: value('--pages', 'docs/site/src/app'),
  };
}

/** Every `page.md` below `dir`, sorted so the output is stable. */
export function findPages(dir) {
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir, { recursive: true })
    .filter((entry) => path.basename(entry) === 'page.md')
    .map((entry) => path.join(dir, entry))
    .sort();
}

function main(argv) {
  const { repoRoot, dist, pages } = parseArgs(argv);
  const pagesRoot = path.join(repoRoot, pages);

  const tags = findPages(pagesRoot).flatMap((page) =>
    collectStorybookTags(
      fs.readFileSync(page, 'utf8'),
      path.relative(pagesRoot, page).split(path.sep).join('/'),
    ),
  );

  const projects = [...new Set(tags.map((tag) => tag.project))].sort();
  const indexPath = (project) => path.join(dist, project, 'index.json');
  const indexes = Object.fromEntries(
    projects.map((project) => [
      project,
      readJson(path.join(repoRoot, indexPath(project))),
    ]),
  );

  const findings = verifyTags(tags, indexes);

  for (const finding of findings) {
    // Only the CLI knows where a build was looked for, so it is the CLI that
    // turns a missing index into an actionable path.
    const where = indexes[finding.project]
      ? ''
      : ` (expected ${indexPath(finding.project).split(path.sep).join('/')})`;

    console.log(`${finding.file}:${finding.line}: ${finding.message}${where}`);
  }

  console.log(
    `verify-storybook-ids: ${tags.length} tags, ${projects.length} projects, ${findings.length} errors`,
  );

  return findings.length ? 1 : 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
