/// <reference types="cypress" />

/**
 * Custom Cypress commands shared across the CRUD Storybook e2e specs.
 *
 * All commands are intentionally small wrappers — the heavy lifting (selectors,
 * navigation) lives in the `CrudListPage` / `CrudFiltersPage` Page Objects.
 */

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Visit a Storybook story by its id, rendered in isolation via the
       * `iframe.html` entry point (no manager chrome).
       */
      visitStory(storyId: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('visitStory', (storyId: string) => {
  cy.visit(`/iframe.html?id=${storyId}&viewMode=story`);
  // Storybook renders the story root once Angular bootstraps.
  cy.get('#storybook-root', { timeout: 30000 }).should('exist');
});

export {};
