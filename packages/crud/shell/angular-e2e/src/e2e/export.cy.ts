/// <reference types="cypress" />

import { CrudListPage } from '../support/pages/crud-list.page';

/**
 * Flow 6 — export (CSV / XLSX).
 *
 * Driven through the standalone `Smart-Crud/Export` story (`smart-crud-export`).
 * Why standalone: the list page wires the export end-button as a
 * `type: 'popover'` button, but `smart-page-standard` does not mount popover
 * bodies (the popover wiring is commented out), so the CSV / XLSX buttons are
 * NOT reachable from the list story. The dedicated story renders the very same
 * `ExportComponent` body, whose buttons call `facade.export(...)`.
 *
 * Assertions:
 *  - clicking CSV / XLSX issues a GET to the entity URL with the matching
 *    `Content-Type` (text/csv or the xlsx mime).
 *  - the export request omits `offset` and `limit` (the export base explicitly
 *    nulls them so the whole dataset is exported).
 *
 * GAP-26 note: after the export resolves the component calls
 * `PopoverService.close()`. In this build that service is a no-op stub (the
 * Ionic popover controller is commented out) and there is no popover element to
 * observe closing in the standalone story, so "popover closes" cannot be
 * asserted visually here. We instead assert the export request resolves, which
 * is the trigger for the close(). The popover/menu-close behaviour is otherwise
 * unobservable in Storybook and is documented as deferred.
 */
describe('CRUD list — export', () => {
  const page = new CrudListPage();

  const CSV_MIME = 'text/csv';
  const XLSX_MIME =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

  beforeEach(() => {
    cy.intercept('GET', '**/api/export-notes**', (req) => {
      req.reply({ statusCode: 200, body: 'id,title\n1,Sample' });
    }).as('exportNotes');
  });

  it('CSV export GETs with the csv Content-Type and no offset/limit', () => {
    page.visit(CrudListPage.stories.exportStandalone);

    page.exportCsvButton().should('exist').click();

    cy.wait('@exportNotes').then(({ request }) => {
      expect(request.headers['content-type']).to.include(CSV_MIME);
      expect(request.url).to.not.include('offset=');
      expect(request.url).to.not.include('limit=');
    });
  });

  it('XLSX export GETs with the xlsx Content-Type and no offset/limit', () => {
    page.visit(CrudListPage.stories.exportStandalone);

    page.exportXlsxButton().should('exist').click();

    cy.wait('@exportNotes').then(({ request }) => {
      expect(request.headers['content-type']).to.include(XLSX_MIME);
      expect(request.url).to.not.include('offset=');
      expect(request.url).to.not.include('limit=');
    });
  });
});
