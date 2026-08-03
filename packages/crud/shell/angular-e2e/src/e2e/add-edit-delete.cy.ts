/// <reference types="cypress" />

import { CrudListPage } from '../support/pages/crud-list.page';

/**
 * Flow 5 — add / edit / delete.
 *
 * Driven through the `With add / edit / remove` variant (`action-notes`).
 *
 * REACHABLE in Storybook:
 *  - the `add` end-button renders and, on click, navigates to `…/add`.
 *  - per-row `edit` (→) and `remove` affordances render.
 *
 * DEFERRED (documented, not asserted as a completed mutation):
 *  - ADD form submit → POST: the add button only `router.navigate([… /add])`.
 *    The item/add page is a separate route that is not registered in the
 *    Storybook story (RouterTestingModule with no item route), so the form is
 *    unreachable and the POST cannot be driven here.
 *  - EDIT form submit → PUT/PATCH: same — the `→` action navigates to the item
 *    route, which is not mounted in Storybook.
 *  - DELETE confirm → DELETE: the remove button calls `AlertService.show()` to
 *    confirm, but in this build `AlertService.show()` is a no-op stub (the
 *    Ionic alert is commented out), so the confirm dialog never appears and the
 *    `facade.delete()` handler behind "confirm" never runs. DELETE is therefore
 *    not reachable via the UI. The intercept below is registered to prove no
 *    DELETE fires (the affordance is present but inert at the confirm step).
 */
describe('CRUD list — add / edit / delete', () => {
  const page = new CrudListPage();

  beforeEach(() => {
    cy.intercept('GET', '**/api/action-notes**', {
      statusCode: 200,
      fixture: 'notes-list.json',
    }).as('readActionNotes');

    // Mutation intercepts (only the GET above is expected to actually fire in
    // Storybook; these guard the deferred mutation steps).
    cy.intercept('POST', '**/api/action-notes', {
      statusCode: 201,
      headers: { Location: '/api/action-notes/new-id' },
      body: {},
    }).as('createNote');
    cy.intercept('DELETE', '**/api/action-notes/**', {
      statusCode: 204,
      body: {},
    }).as('deleteNote');
  });

  it('renders the add / edit / remove affordances', () => {
    page.visit(CrudListPage.stories.withActions);
    cy.wait('@readActionNotes');

    page.addButton().should('exist');
    page.removeRowButtons().should('exist');
    page.itemActionButtons().should('exist');
  });

  it('add button is wired to navigate (form/POST deferred — no item route)', () => {
    page.visit(CrudListPage.stories.withActions);
    cy.wait('@readActionNotes');

    // Clicking add triggers router.navigate([…/add]); the add page is not
    // mounted in Storybook, so we only assert the click is accepted without a
    // POST firing (the POST belongs to the unreachable form submit).
    page.addButton().click();
    // Give any (unexpected) request a tick to surface.
    cy.wait(300);
    cy.get('@createNote.all').should('have.length', 0);
  });

  it('remove affordance is present but the confirm/DELETE is deferred (AlertService stub)', () => {
    page.visit(CrudListPage.stories.withActions);
    cy.wait('@readActionNotes');

    page.removeRowButtons().first().click();

    // AlertService.show() is a no-op in this build, so no confirm dialog and no
    // DELETE. Asserting the absence documents the gap precisely.
    cy.wait(300);
    cy.get('@deleteNote.all').should('have.length', 0);
  });
});
