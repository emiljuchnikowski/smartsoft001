/// <reference types="cypress" />

/**
 * Page Object for the standalone filters panel (`<smart-crud-filters>`) as
 * rendered by the `Smart-Crud/Filters` story.
 *
 * Why standalone (not the list's side panel): the list page opens the filters
 * panel through `MenuService.openEnd()`, but that service only renders into an
 * end-container provided by `<smart-app>` — which the list stories do NOT wrap.
 * So in Storybook the in-list filters panel never mounts, while the dedicated
 * `Smart-Crud/Filters` story renders the very same widgets directly. Changing a
 * widget value still drives `facade.read(filter)` → a stubbed REST GET, which is
 * exactly what the filter spec asserts.
 */
export class CrudFiltersPage {
  static readonly stories = {
    /** `Smart-Crud/Filters` → `Composed filter widgets`. */
    default: 'smart-crud-filters--default',
  };

  visit(): this {
    cy.visitStory(CrudFiltersPage.stories.default);
    return this;
  }

  panel(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('smart-crud-filters');
  }

  /** The text filter input for the `title` field (default widget). */
  textInput(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('smart-crud-filter-text input').first();
  }

  /** The numeric filter input for the `views` field. */
  intInput(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('smart-crud-filter-int input').first();
  }

  /** The per-widget clear button (`aria-label="clear"`). */
  clearButtons(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('button[aria-label="clear"]');
  }

  clearFirst(): this {
    this.clearButtons().first().click();
    return this;
  }
}
