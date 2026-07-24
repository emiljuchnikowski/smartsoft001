import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { defineConfig } from 'cypress';

/**
 * Cypress e2e configuration for the CRUD shell Storybook stories.
 *
 * The suite drives the already-published Storybook stories of
 * `crud-shell-angular` and stubs every REST call with `cy.intercept`, so no
 * real backend is required. The dev server (Storybook) is started by the
 * `@nx/cypress:cypress` executor via `devServerTarget` and serves on port 4401
 * (see `crud-shell-angular`'s `storybook` target), hence the matching
 * `baseUrl` below.
 */
export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      bundler: 'webpack',
    }),
    baseUrl: 'http://localhost:4401',
    specPattern: 'src/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'src/support/e2e.ts',
    fixturesFolder: 'src/fixtures',
    // Storybook story shells are small; give the iframe a generous default.
    defaultCommandTimeout: 10000,
    // Storybook dev-server start-up is slow on a cold cache.
    pageLoadTimeout: 120000,
    video: false,
    screenshotOnRunFailure: false,
    retries: { runMode: 1, openMode: 0 },
  },
});
