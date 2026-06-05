/// <reference types="cypress" />

// Cypress support file — loaded automatically before every spec.
import './commands';

// Storybook stories occasionally surface a benign ResizeObserver warning as an
// uncaught exception. It is unrelated to the behaviour under test, so we swallow
// only that one and let every other uncaught error fail the spec.
Cypress.on('uncaught:exception', (err) => {
  if (/ResizeObserver loop/.test(err.message)) {
    return false;
  }
  return true;
});
