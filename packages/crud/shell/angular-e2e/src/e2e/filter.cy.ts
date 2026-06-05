/// <reference types="cypress" />

import { CrudFiltersPage } from '../support/pages/crud-filters.page';

/**
 * Flow 2 — filter.
 *
 * Driven through the standalone `Smart-Crud/Filters` story (see the Page Object
 * docs for why the in-list panel is not reachable in Storybook). Setting a
 * filter value runs `facade.read(filter)` which issues a stubbed list GET; we
 * assert the new query param appears, then clear it and assert it is gone.
 *
 * `refresh()` is debounced 500ms in the filter base component, so each assertion
 * waits on the intercept rather than racing it.
 */
describe('CRUD list — filter', () => {
  const page = new CrudFiltersPage();

  beforeEach(() => {
    cy.intercept('GET', '**/api/articles**', {
      statusCode: 200,
      fixture: 'articles-filtered.json',
    }).as('readArticles');
  });

  it('issues a GET carrying the typed filter as a query param', () => {
    page.visit();
    page.panel().should('exist');

    // `title` is a `list.filter` text field → query `title=<value>`.
    page.textInput().clear().type('Signals');

    cy.wait('@readArticles')
      .its('request.url')
      .should('include', 'title=Signals');
  });

  it('removes the filter (clear button) and the param drops from the next GET', () => {
    page.visit();

    page.textInput().clear().type('Signals');
    cy.wait('@readArticles').its('request.url').should('include', 'title=');

    // The text widget exposes a clear affordance (aria-label="clear") once it
    // holds a value; clicking it re-reads without the title query.
    page.clearFirst();

    cy.wait('@readArticles')
      .its('request.url')
      .should('not.include', 'title=Signals');
  });
});
