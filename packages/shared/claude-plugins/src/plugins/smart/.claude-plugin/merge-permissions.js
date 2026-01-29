#!/usr/bin/env node
/**
 * Merge smart plugin settings into project's .claude/settings.json
 *
 * Usage:
 *   npx @smartsoft001/claude-plugins smart:merge-permissions
 *
 * Or directly:
 *   node node_modules/@smartsoft001/claude-plugins/plugins/smart/.claude-plugin/merge-permissions.js
 */

const fs = require('fs');
const path = require('path');

const SETTINGS_PATH = path.join(process.cwd(), '.claude', 'settings.json');
const TEMPLATE_PATH = path.join(__dirname, 'settings.template.json');

function loadJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    return null;
  }
}

function mergeArrays(existing, template) {
  return [...new Set([...existing, ...template])];
}

function mergeHooks(existing, template) {
  if (!template) return existing;
  if (!existing) return template;

  const merged = { ...existing };

  for (const [event, hooks] of Object.entries(template)) {
    if (!merged[event]) {
      merged[event] = hooks;
    } else {
      // Merge by checking _description to avoid duplicates
      const existingDescriptions = merged[event].map(h => h._description).filter(Boolean);
      for (const hook of hooks) {
        if (hook._description && !existingDescriptions.includes(hook._description)) {
          merged[event].push(hook);
        } else if (!hook._description) {
          merged[event].push(hook);
        }
      }
    }
  }

  return merged;
}

function main() {
  console.log('Smart Plugin - Merge Settings\n');

  // Load template
  const template = loadJson(TEMPLATE_PATH);
  if (!template) {
    console.error('ERROR: Could not load template from:', TEMPLATE_PATH);
    process.exit(1);
  }

  // Load or create settings
  let settings = loadJson(SETTINGS_PATH);
  if (!settings) {
    console.log('Creating new .claude/settings.json...');
    fs.mkdirSync(path.dirname(SETTINGS_PATH), { recursive: true });
    settings = { permissions: { allow: [], deny: [], ask: [] }, hooks: {} };
  }

  // Ensure structures exist
  settings.permissions = settings.permissions || { allow: [], deny: [], ask: [] };
  settings.permissions.allow = settings.permissions.allow || [];
  settings.permissions.ask = settings.permissions.ask || [];
  settings.permissions.deny = settings.permissions.deny || [];
  settings.hooks = settings.hooks || {};

  // Count before
  const beforeAllow = settings.permissions.allow.length;
  const beforeHooks = Object.keys(settings.hooks).length;

  // Merge permissions
  settings.permissions.allow = mergeArrays(settings.permissions.allow, template.permissions.allow);

  // Merge hooks
  settings.hooks = mergeHooks(settings.hooks, template.hooks);

  // Enable plugin
  settings.enabledPlugins = settings.enabledPlugins || {};
  settings.enabledPlugins['smart@smartsoft'] = true;

  // Write back
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2) + '\n');

  // Report
  const addedAllow = settings.permissions.allow.length - beforeAllow;
  const afterHooks = Object.keys(settings.hooks).length;

  console.log('Settings merged successfully!\n');
  console.log(`  permissions.allow: ${beforeAllow} -> ${settings.permissions.allow.length} (+${addedAllow})`);
  console.log(`  hooks events: ${beforeHooks} -> ${afterHooks}`);
  console.log(`\nPlugin enabled: smart@smartsoft`);
  console.log(`\nFile updated: ${SETTINGS_PATH}`);
}

main();