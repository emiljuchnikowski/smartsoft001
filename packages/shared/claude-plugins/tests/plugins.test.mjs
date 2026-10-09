import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(here, '../src');
const pluginsDir = path.join(src, 'plugins');
const require = createRequire(import.meta.url);
const { updatePluginVersions } = require('../scripts/update-version.js');

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function manifest(plugin) {
  return readJson(
    path.join(pluginsDir, plugin, '.claude-plugin', 'plugin.json'),
  );
}

function directories(dir) {
  return fs.existsSync(dir)
    ? fs
        .readdirSync(dir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort()
    : [];
}

/** The agents of a plugin: the names of its `agents/*.md` files. */
function agents(plugin) {
  const dir = path.join(pluginsDir, plugin, 'agents');

  return fs.existsSync(dir)
    ? fs
        .readdirSync(dir)
        .filter((file) => file.endsWith('.md'))
        .map((file) => file.slice(0, -'.md'.length))
        .sort()
    : [];
}

const marketplace = readJson(
  path.join(src, '.claude-plugin', 'marketplace.json'),
);
const plugins = directories(pluginsDir);

describe('marketplace', () => {
  test('ships the core plugin and one plugin per framework', () => {
    assert.deepEqual(plugins, ['smart-angular', 'smart-core', 'smart-react']);
  });

  test('lists every plugin directory under its own name', () => {
    assert.deepEqual(
      marketplace.plugins.map(({ name, source }) => ({ name, source })),
      ['smart-core', 'smart-angular', 'smart-react'].map((name) => ({
        name,
        source: `./plugins/${name}`,
      })),
    );

    for (const plugin of plugins) {
      assert.equal(manifest(plugin).name, plugin);
    }
  });

  test('moves installs of the former smart plugin to smart-angular', () => {
    assert.deepEqual(marketplace.renames, { smart: 'smart-angular' });
  });
});

describe('plugin manifests', () => {
  test('the framework plugins depend on smart-core, which depends on nothing', () => {
    assert.equal(manifest('smart-core').dependencies, undefined);
    assert.deepEqual(manifest('smart-angular').dependencies, ['smart-core']);
    assert.deepEqual(manifest('smart-react').dependencies, ['smart-core']);
  });

  test('every plugin carries the same version', () => {
    const versions = new Set(plugins.map((plugin) => manifest(plugin).version));

    assert.equal(versions.size, 1, [...versions].join(', '));
  });

  test('only smart-core ships hooks', () => {
    assert.ok(
      fs.existsSync(path.join(pluginsDir, 'smart-core/hooks/hooks.json')),
    );
    assert.deepEqual(
      plugins.filter((plugin) =>
        fs.existsSync(path.join(pluginsDir, plugin, 'hooks')),
      ),
      ['smart-core'],
    );
  });

  test('framework skills and agents live in the plugin of their framework', () => {
    const owners = {
      'angular-components': 'smart-angular',
      'react-components': 'smart-react',
    };

    for (const plugin of plugins) {
      const names = [
        ...directories(path.join(pluginsDir, plugin, 'skills')),
        ...agents(plugin),
      ];

      for (const name of names) {
        const owner = Object.entries(owners).find(([prefix]) =>
          name.startsWith(prefix),
        );

        if (owner) assert.equal(plugin, owner[1], `${plugin}: ${name}`);
      }
    }

    assert.deepEqual(agents('smart-angular'), ['angular-components']);
    assert.deepEqual(agents('smart-react'), ['react-components']);
  });

  test('every agent is a flat agents/<name>.md file whose frontmatter names it', () => {
    for (const plugin of plugins) {
      const dir = path.join(pluginsDir, plugin, 'agents');

      // Claude Code loads the agents of a plugin from agents/*.md; an agent in
      // a subfolder (agents/<name>/AGENT.md) is never registered.
      assert.deepEqual(directories(dir), [], `${plugin}/agents has subfolders`);

      for (const name of agents(plugin)) {
        const source = fs.readFileSync(path.join(dir, `${name}.md`), 'utf8');
        const frontmatter = source.match(/^---\n([\s\S]*?)\n---\n/)?.[1] ?? '';

        assert.match(frontmatter, new RegExp(`^name: ${name}$`, 'm'), name);
        assert.match(frontmatter, /^description: \S/m, name);
      }
    }
  });
});

describe('update-version.js', () => {
  test('writes the version into every plugin.json and keeps the Prettier layout', () => {
    const copy = fs.mkdtempSync(path.join(os.tmpdir(), 'claude-plugins-'));

    for (const plugin of plugins) {
      const dir = path.join(copy, plugin, '.claude-plugin');
      fs.mkdirSync(dir, { recursive: true });
      fs.copyFileSync(
        path.join(pluginsDir, plugin, '.claude-plugin', 'plugin.json'),
        path.join(dir, 'plugin.json'),
      );
    }

    const updated = updatePluginVersions(copy, '9.8.7');

    assert.equal(updated.length, plugins.length);
    for (const plugin of plugins) {
      const file = path.join(copy, plugin, '.claude-plugin', 'plugin.json');
      const original = fs.readFileSync(
        path.join(pluginsDir, plugin, '.claude-plugin', 'plugin.json'),
        'utf8',
      );

      assert.equal(readJson(file).version, '9.8.7');
      assert.equal(
        fs.readFileSync(file, 'utf8'),
        original.replace(/"version": "[^"]*"/, '"version": "9.8.7"'),
      );
    }
  });
});
