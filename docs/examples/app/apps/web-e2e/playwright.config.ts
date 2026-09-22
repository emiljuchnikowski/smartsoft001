import { defineConfig, devices } from 'playwright/test';

import { resolve } from 'node:path';

/**
 * The suite drives the real stack: the NestJS API on :3000 (against the
 * MongoDB from `docker compose up`) and the Angular dev server on :4200, both
 * started here so a single command runs the whole loop. `reuseExistingServer`
 * lets a developer keep `nx serve` running between runs.
 */
const workspaceRoot = resolve(__dirname, '../../../../..');

export default defineConfig({
  testDir: './src',
  fullyParallel: false,
  workers: 1,
  retries: process.env['CI'] ? 1 : 0,
  reporter: process.env['CI'] ? 'line' : 'list',
  outputDir: resolve(workspaceRoot, 'dist/docs/examples/app/apps/web-e2e'),
  timeout: 60_000,
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command:
        'npx nx run docs-examples-app-api:build:development && node dist/docs/examples/app/apps/api/main.js',
      cwd: workspaceRoot,
      url: 'http://localhost:3000/api/notes',
      reuseExistingServer: !process.env['CI'],
      timeout: 240_000,
    },
    {
      command: 'npx nx serve docs-examples-app-web',
      cwd: workspaceRoot,
      url: 'http://localhost:4200',
      reuseExistingServer: !process.env['CI'],
      timeout: 240_000,
    },
  ],
});
