import { expect, test } from 'playwright/test';

import {
  createNote,
  endButton,
  noteRow,
  signInFast,
  uniqueTitle,
} from './support/app';

/** Each test continues where the previous one left off, on the same note. */
test.describe('note item page', () => {
  test.describe.configure({ mode: 'serial' });

  const title = uniqueTitle('Item note');
  const changedTitle = `${title} changed`;

  /** Path of the note, captured when the list opens it. */
  let notePath = '';

  test.beforeEach(async ({ page }) => {
    await signInFast(page);
  });

  test('opens the details of a note from the list', async ({ page }) => {
    await createNote(page, title);
    await page.goto('/notes');

    await noteRow(page, title).getByRole('button', { name: '→' }).click();

    await page.waitForURL(/\/notes\/[^/]+$/);
    notePath = new URL(page.url()).pathname;
    await expect(page.getByRole('heading', { level: 2 })).toContainText(title);
    await expect(page.locator('smart-detail-text p').first()).toHaveText(title);
  });

  test('switches to the edit form with the current title filled in', async ({
    page,
  }) => {
    await page.goto(notePath);

    await endButton(page, 'edit').click();

    await expect(
      page.locator('smart-input-text input[type="text"]'),
    ).toHaveValue(title);
    await expect(endButton(page, 'save')).toBeVisible();
  });

  test('saves a new title from the edit form', async ({ page }) => {
    await page.goto(notePath);

    await endButton(page, 'edit').click();
    await page
      .locator('smart-input-text input[type="text"]')
      .fill(changedTitle);
    await endButton(page, 'save').click();

    await expect(page.getByRole('heading', { level: 2 })).toContainText(
      changedTitle,
    );
  });

  test('still shows the new title after a reload', async ({ page }) => {
    await page.goto(notePath);
    await page.reload();

    // Nothing is cached across the reload, so the title can only come back
    // from the API.
    await expect(page.getByRole('heading', { level: 2 })).toContainText(
      changedTitle,
    );
    await expect(page.locator('smart-detail-text p').first()).toHaveText(
      changedTitle,
    );
  });
});
