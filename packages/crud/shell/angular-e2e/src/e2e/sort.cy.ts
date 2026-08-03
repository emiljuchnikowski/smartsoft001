/// <reference types="cypress" />

import { CrudListPage } from '../support/pages/crud-list.page';

/**
 * Flow 3 — sort.
 *
 * The desktop list does NOT expose a clickable sort-header toggle; sort is
 * applied from `config.sort` (default / defaultDesc) and flows into the list
 * GET as `sort=<key>` / `sort=-<key>`. The `With sort + search` variant sets
 * `sort: { default: 'title', defaultDesc: false }`, so the initial read must
 * carry `sort=title` (ascending → no `-` prefix).
 */
describe('CRUD list — sort', () => {
  const page = new CrudListPage();

  beforeEach(() => {
    cy.intercept('GET', '**/api/searchable-notes**', {
      statusCode: 200,
      fixture: 'notes-list.json',
    }).as('readSearchable');
  });

  it('reads with the configured ascending sort param', () => {
    page.visit(CrudListPage.stories.withSortAndSearch);

    cy.wait('@readSearchable').then(({ request }) => {
      expect(request.url).to.include('sort=title');
      // ascending → must NOT be the descending `-title` form.
      expect(request.url).to.not.include('sort=-title');
    });
  });
});
