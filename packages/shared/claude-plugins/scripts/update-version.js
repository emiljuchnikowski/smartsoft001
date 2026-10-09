const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const pluginsDir = path.join(rootDir, 'src', 'plugins');

/** The top-level `"version"` of a Prettier-formatted manifest (two-space indent). */
const TOP_LEVEL_VERSION = /^( {2}"version"\s*:\s*)"[^"]*"/m;

/**
 * Sets the version of one manifest. Only the version string is replaced, so
 * the rest of the file keeps its Prettier formatting (a `"dependencies"` array
 * stays on one line); a manifest without a version gets one appended.
 */
function withVersion(source, version) {
  if (TOP_LEVEL_VERSION.test(source)) {
    return source.replace(
      TOP_LEVEL_VERSION,
      (_, key) => `${key}${JSON.stringify(version)}`,
    );
  }

  const manifest = JSON.parse(source);
  manifest.version = version;

  return JSON.stringify(manifest, null, 2) + '\n';
}

/**
 * Writes `version` into the `.claude-plugin/plugin.json` of every plugin below
 * `dir` (smart-core, smart-angular, smart-react and any plugin added later), so
 * the plugins of the marketplace ship with the version of the npm package.
 * Returns the manifests it updated.
 */
function updatePluginVersions(dir, version) {
  const updated = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    const fullPath = path.join(dir, entry.name);
    const pluginJsonPath = path.join(fullPath, '.claude-plugin', 'plugin.json');

    if (fs.existsSync(pluginJsonPath)) {
      const source = fs.readFileSync(pluginJsonPath, 'utf8');
      fs.writeFileSync(pluginJsonPath, withVersion(source, version));
      updated.push(pluginJsonPath);
    }

    updated.push(...updatePluginVersions(fullPath, version));
  }

  return updated;
}

module.exports = { updatePluginVersions, withVersion };

if (require.main === module) {
  const { version } = require(path.join(rootDir, 'package.json'));

  console.log(`Updating plugin versions to ${version}...`);
  for (const file of updatePluginVersions(pluginsDir, version)) {
    console.log(`Updated ${file} to version ${version}`);
  }
  console.log('Done!');
}
