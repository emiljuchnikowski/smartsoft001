const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const packageJson = require(path.join(rootDir, 'package.json'));
const version = packageJson.version;

const pluginsDir = path.join(rootDir, 'src', 'plugins');

function updatePluginVersions(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      const pluginJsonPath = path.join(
        fullPath,
        '.claude-plugin',
        'plugin.json',
      );

      if (fs.existsSync(pluginJsonPath)) {
        const pluginJson = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf8'));
        pluginJson.version = version;
        fs.writeFileSync(
          pluginJsonPath,
          JSON.stringify(pluginJson, null, 2) + '\n',
        );
        console.log(`Updated ${pluginJsonPath} to version ${version}`);
      }

      updatePluginVersions(fullPath);
    }
  }
}

console.log(`Updating plugin versions to ${version}...`);
updatePluginVersions(pluginsDir);
console.log('Done!');
