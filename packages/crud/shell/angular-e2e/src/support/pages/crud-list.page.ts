/// <reference types="cypress" />

/**
 * Page Object for the CRUD list page (`<smart-crud-list-page>`) rendered inside
 * a Storybook story iframe.
 *
 * Selectors deliberately favour roles, visible text and aria attributes over
 * brittle CSS, matching the components as authored:
 *  - end buttons render their (translated) label text: `filters`, `add`,
 *    `export`, `multi`.
 *  - the export popover exposes `CSV` / `XLSX` buttons.
 *  - the active-filter chips are `<button aria-label="remove …">`.
 *  - the search input has `placeholder="search"` (untranslated key in stories).
 *  - the single-page pager is `nav[aria-label="Pagination"]` with `prev`/`next`.
 *  - rows are CDK table rows (`tr[cdk-row]`).
 */
export class CrudListPage {
  /**
   * Storybook story ids. The id is `kebab(title)--kebab(exportName)` — derived
   * from the *export identifier* (via Storybook's `storyNameFromExport` +
   * `sanitize`), NOT the story's `name` display label. The export names live in
   * `list.component.stories.ts` / `list-variants.stories.ts`.
   */
  static readonly stories = {
    /** title `Smart-Crud/List Page`, export `Export`. */
    listExport: 'smart-crud-list-page--export',
    /** title `Smart-Crud/List Page Variants`, export `WithFilters`. */
    withFilters: 'smart-crud-list-page-variants--with-filters',
    /** export `WithSortAndSearch`. */
    withSortAndSearch: 'smart-crud-list-page-variants--with-sort-and-search',
    /** export `WithPagination`. */
    withPagination: 'smart-crud-list-page-variants--with-pagination',
    /** export `WithActions`. */
    withActions: 'smart-crud-list-page-variants--with-actions',
    /** title `Smart-Crud/Export`, export `Default`. */
    exportStandalone: 'smart-crud-export--default',
  };

  visit(storyId: string): this {
    cy.visitStory(storyId);
    return this;
  }

  /** The page heading (`<h2>` rendered by smart-page-standard). */
  title(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('smart-page-standard h2');
  }

  /** All data rows in the CDK table. */
  rows(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('table[cdk-table] tr[cdk-row]');
  }

  /** A specific list cell value by its model key. */
  cell(key: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(`td[smart-item-key="${key}"]`);
  }

  /** End-button by its (translated) label text, e.g. `filters`, `add`. */
  endButton(label: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.contains('smart-page-standard smart-button', label);
  }

  /** Open the filters side panel. */
  openFilters(): this {
    this.endButton('filters').click();
    return this;
  }

  /** The standalone search input (only present when `config.search` is on). */
  searchInput(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('smart-page-standard input[type="text"]');
  }

  /** Active-filter chips (rendered by `<smart-crud-filters-config>`). */
  filterChips(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('smart-crud-filters-config button[aria-label^="remove"]');
  }

  removeFirstChip(): this {
    this.filterChips().first().click();
    return this;
  }

  /** The export popover trigger (`export` end button). */
  openExport(): this {
    this.endButton('export').click();
    return this;
  }

  exportCsvButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.contains('smart-crud-export smart-button', 'CSV');
  }

  exportXlsxButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.contains('smart-crud-export smart-button', 'XLSX');
  }

  /** The add affordance (navigates to `…/add`). */
  addButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.endButton('add');
  }

  /** Per-row remove buttons (text `remove`). */
  removeRowButtons(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.contains('table[cdk-table] button', 'remove');
  }

  /** Per-row item/edit affordance (the `→` action button). */
  itemActionButtons(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('table[cdk-table] td button').contains('→');
  }

  // ---- single-page pagination ---------------------------------------------

  pager(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('nav[aria-label="Pagination"]');
  }

  nextPage(): this {
    this.pager().contains('button', 'next').click();
    return this;
  }

  prevPage(): this {
    this.pager().contains('button', 'prev').click();
    return this;
  }
}
