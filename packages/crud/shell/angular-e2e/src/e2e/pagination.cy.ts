/// <reference types="cypress" />

import { CrudListPage } from '../support/pages/crud-list.page';

/**
 * Flow 4 — pagination.
 *
 * Uses the `With single-page pagination` variant (paginationMode: singlePage),
 * which renders the `<smart-paging-standard>` prev/next control. Page 1 returns
 * `links.next`, so `loadNextPage` advances the offset to `limit` (25) and the
 * pager exposes `next`; `loadPrevPage` then walks it back to offset 0.
 *
 * The first list GET (offset 0) is stubbed with page 1; the offset-25 GET with
 * page 2.
 */
describe('CRUD list — pagination', () => {
  const page = new CrudListPage();

  beforeEach(() => {
    // Page 2: offset=25 (must be registered first so it wins for that match).
    cy.intercept('GET', '**/api/paged-notes**offset=25**', {
      statusCode: 200,
      fixture: 'notes-page2.json',
    }).as('readPage2');

    // Page 1: offset=0 (initial read).
    cy.intercept('GET', '**/api/paged-notes**offset=0**', {
      statusCode: 200,
      fixture: 'notes-page1.json',
    }).as('readPage1');
  });

  it('advances the offset/limit query when paging next then prev', () => {
    page.visit(CrudListPage.stories.withPagination);

    // Initial read — page 1, offset 0.
    cy.wait('@readPage1').its('request.url').should('include', 'offset=0');
    page.rows().should('contain.text', 'Page 1 item A');
    page.pager().should('exist');

    // Next → offset advances by the limit (25).
    page.nextPage();
    cy.wait('@readPage2').then(({ request }) => {
      expect(request.url).to.include('offset=25');
      expect(request.url).to.include('limit=25');
    });

    // Prev → offset walks back to 0.
    page.prevPage();
    cy.wait('@readPage1').its('request.url').should('include', 'offset=0');
  });
});
