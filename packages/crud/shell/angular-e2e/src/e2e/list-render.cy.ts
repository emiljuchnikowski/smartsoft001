/// <reference types="cypress" />

import { CrudListPage } from '../support/pages/crud-list.page';

/**
 * Flow 1 — list render.
 *
 * Intercepts the list GET (returning 3 fixture rows) BEFORE visiting the story
 * so the rendered table is deterministic, then asserts the title and rows.
 */
describe('CRUD list — render', () => {
  const page = new CrudListPage();

  beforeEach(() => {
    // `…/api/notes?…` is hit by the `With export` story on init.
    cy.intercept('GET', '**/api/notes**', {
      statusCode: 200,
      fixture: 'notes-list.json',
    }).as('readNotes');
  });

  it('renders the page title and the fixture rows', () => {
    page.visit(CrudListPage.stories.listExport);

    cy.wait('@readNotes');

    page.title().should('contain.text', 'Note');
    page.rows().should('have.length', 3);

    // Cell values come straight from the fixture.
    page.cell('title').first().should('contain.text', 'Release planning');
    cy.contains(
      'td[smart-item-key="body"]',
      'Review reported regressions',
    ).should('exist');
  });

  it('issues the initial GET with the configured pagination limit', () => {
    page.visit(CrudListPage.stories.listExport);

    cy.wait('@readNotes').its('request.url').should('include', 'limit=25');
  });
});
