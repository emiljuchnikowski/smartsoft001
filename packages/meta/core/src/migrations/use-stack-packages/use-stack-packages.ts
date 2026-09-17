import { Tree, logger, updateJson } from '@nx/devkit';

/**
 * The meta packages and the packages each of them pins.
 *
 * This mirrors the `dependencies` block of every `package.json` under
 * `packages/meta` and has to be kept in step with them by hand: a consumer's
 * `node_modules` is not guaranteed to contain the meta packages, so the
 * migration cannot read the lists at runtime.
 *
 * `@smartsoft001/core` comes first, and is itself a member of the Angular and
 * the NestJS stack, so a project that pulls in the whole core set collapses to
 * `core` and from there into the framework stack.
 */
const STACKS: Record<string, string[]> = {
  '@smartsoft001/core': [
    '@smartsoft001/models',
    '@smartsoft001/domain-core',
    '@smartsoft001/utils',
    '@smartsoft001/users',
    '@smartsoft001/auth-domain',
    '@smartsoft001/crud-domain',
    '@smartsoft001/crud-shell-dtos',
    '@smartsoft001/auth-shell-dtos',
    '@smartsoft001/crud-shell-app-services',
    '@smartsoft001/auth-shell-app-services',
  ],
  '@smartsoft001/angular-stack': [
    '@smartsoft001/core',
    '@smartsoft001/angular',
    '@smartsoft001/crud-shell-angular',
  ],
  '@smartsoft001/nestjs-stack': [
    '@smartsoft001/core',
    '@smartsoft001/nestjs',
    '@smartsoft001/mongo',
    '@smartsoft001/crud-shell-nestjs',
    '@smartsoft001/auth-shell-nestjs',
  ],
  '@smartsoft001/payments-stack': [
    '@smartsoft001/trans-domain',
    '@smartsoft001/trans-shell-app-services',
    '@smartsoft001/trans-shell-nestjs',
    '@smartsoft001/paypal',
    '@smartsoft001/payu',
    '@smartsoft001/paynow',
    '@smartsoft001/revolut',
  ],
};

/** Every package a stack pins, the stacks themselves excluded. */
const MEMBERS = new Set(
  Object.values(STACKS)
    .flat()
    .filter((name) => !(name in STACKS)),
);

const SECTIONS = ['dependencies', 'devDependencies'] as const;

type Deps = Record<string, string>;
type Entry = [string, string];

interface PackageJson {
  dependencies?: Deps;
  devDependencies?: Deps;
}

interface Replacement {
  stack: string;
  version: string;
  replaced: string[];
  versions: string[];
}

/** Compares the numbers in two npm specifiers, so `^2.143.0` beats `2.140.0`. */
function compareVersions(a: string, b: string): number {
  const numbers = (value: string): number[] =>
    (value.match(/\d+/g) ?? []).map(Number);

  const left = numbers(a);
  const right = numbers(b);

  for (let index = 0; index < Math.max(left.length, right.length); index++) {
    const difference = (left[index] ?? 0) - (right[index] ?? 0);

    if (difference !== 0) {
      return difference;
    }
  }

  return 0;
}

function highestVersion(versions: string[]): string {
  return versions.reduce((highest, version) =>
    compareVersions(version, highest) > 0 ? version : highest,
  );
}

function isSorted(names: string[]): boolean {
  return names.every((name, index) => index === 0 || names[index - 1] <= name);
}

/**
 * Replaces every group of two or more members of one stack with the stack,
 * in the position of the first entry it replaces.
 */
function collapse(deps: Deps): { deps: Deps; replacements: Replacement[] } {
  const keepSorted = isSorted(Object.keys(deps));
  const replacements: Replacement[] = [];
  let entries = Object.entries(deps);

  for (const [stack, members] of Object.entries(STACKS)) {
    const present = entries.filter(([name]) => members.includes(name));

    if (present.length < 2) {
      continue;
    }

    // An entry for the stack itself is folded in rather than left duplicated.
    const replaces = ([name]: Entry): boolean =>
      members.includes(name) || name === stack;
    const versions = entries.filter(replaces).map(([, version]) => version);
    const version = highestVersion(versions);

    replacements.push({
      stack,
      version,
      versions,
      replaced: present.map(([name]) => name),
    });

    const next: Entry[] = [];

    for (const entry of entries) {
      if (!replaces(entry)) {
        next.push(entry);
      } else if (next.every(([name]) => name !== stack)) {
        next.push([stack, version]);
      }
    }

    entries = next;
  }

  if (keepSorted) {
    entries.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  }

  return { deps: Object.fromEntries(entries), replacements };
}

function describeReplacement(
  section: string,
  replacement: Replacement,
): string {
  const { stack, version, versions, replaced } = replacement;
  const disagreed = versions.some((other) => other !== versions[0])
    ? `, versions differed (${versions.join(', ')}), kept the highest`
    : '';

  return `${section}: ${replaced.join(', ')} -> ${stack}@${version}${disagreed}`;
}

export default async function update(tree: Tree): Promise<void> {
  const leftovers: string[] = [];

  updateJson(tree, 'package.json', (json: PackageJson) => {
    for (const section of SECTIONS) {
      const current = json[section];

      if (!current) {
        continue;
      }

      const { deps, replacements } = collapse(current);

      json[section] = deps;

      for (const replacement of replacements) {
        logger.info(describeReplacement(section, replacement));
      }

      for (const name of Object.keys(deps)) {
        if (MEMBERS.has(name) && !leftovers.includes(name)) {
          leftovers.push(name);
        }
      }
    }

    return json;
  });

  if (leftovers.length > 0) {
    logger.info(`Still installed individually: ${leftovers.join(', ')}`);
  }
}
