/// <reference types="cypress" />

import { CrudFiltersPage } from '../support/pages/crud-filters.page';

/**
 * Flow 2 — filter.
 *
 * Driven through the standalone `Smart-Crud/Filters` story (see the Page Object
 * docs for why the in-list panel is not reachable in Storybook). The story host
 * replays the list page's initial read (a query-less GET) to seed
 * `facade.filter()`; typing into a widget then runs the debounced `refresh()`
 * which re-reads with the new query entry. The text filter serializes with the
 * "contains" operator, so the typed read carries `title~=<value>`.
 *
 * Two intercepts split the traffic by shape so no test depends on HOW MANY
 * seed reads Storybook's (re)rendering produces: `readArticlesTitled` matches
 * only reads carrying a `title` query entry; `readArticles` catches the rest
 * (the seed / cleared reads, which are query-less).
 */
describe('CRUD list — filter', () => {
  const page = new CrudFiltersPage();

  beforeEach(() => {
    cy.intercept('GET', '**/api/articles**', {
      statusCode: 200,
      fixture: 'articles-filtered.json',
    }).as('readArticles');

    // Registered later → wins for matching requests (Cypress matches the
    // most recently defined intercept first).
    cy.intercept('GET', '**/api/articles**title*', {
      statusCode: 200,
      fixture: 'articles-filtered.json',
    }).as('readArticlesTitled');
  });

  it('issues a GET carrying the typed filter as a query param', () => {
    page.visit();
    page.panel().should('exist');

    // `title` is a `list.filter` text field → contains query `title~=<value>`.
    page.textInput().clear().type('Signals');

    cy.wait('@readArticlesTitled')
      .its('request.url')
      .should('include', 'title~=Signals');
  });

  it('removes the filter (clear button) and the next GET drops the param', () => {
    page.visit();
    page.panel().should('exist');

    page.textInput().clear().type('Signals');
    cy.wait('@readArticlesTitled')
      .its('request.url')
      .should('include', 'title~=Signals');

    // The clear affordance re-reads without the title entry — i.e. the
    // query-less intercept must register at least one NEW request, while no
    // new titled request appears.
    cy.get('@readArticles.all')
      .its('length')
      .then((before) => {
        cy.get('@readArticlesTitled.all')
          .its('length')
          .then((titledBefore) => {
            page.clearFirst();

            cy.get('@readArticles.all').should(
              'have.length.greaterThan',
              before,
            );
            cy.get('@readArticlesTitled.all').should(
              'have.length',
              titledBefore,
            );
          });
      });
  });
});
