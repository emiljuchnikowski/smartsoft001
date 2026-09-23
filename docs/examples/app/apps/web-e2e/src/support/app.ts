import { APIRequestContext, expect, Locator, Page } from 'playwright/test';

/**
 * Helpers shared by the specs: they know the few selectors the framework
 * components render (the sign-in form, the generated list and item pages) and
 * the one API call that replaces the login UI when a spec is not about login.
 */

/** The API the dev server proxies /api to. */
export const API_URL = 'http://localhost:3000/api';

/** Client registered in the API's `tokenConfig.clients` (see login.service.ts). */
const CLIENT_ID = 'example-app';

/** Key `AuthService` keeps the token under in localStorage. */
const AUTH_TOKEN_KEY = 'AUTH_TOKEN';

export interface ICredentials {
  username: string;
  password: string;
}

/** The seeded user, read from the variables the API reads too (api/src/config.ts). */
export function credentials(): ICredentials {
  return {
    username: process.env['ADMIN_USERNAME'] ?? 'admin@example.com',
    password: process.env['ADMIN_PASSWORD'] ?? 'change-me',
  };
}

/** Fills the framework's sign-in form and submits it, without waiting for the outcome. */
export async function submitSignInForm(
  page: Page,
  { username, password }: ICredentials,
): Promise<void> {
  await page.goto('/login');
  await page.locator('#smart-sign-in-form-email').fill(username);
  await page.locator('#smart-sign-in-form-password').fill(password);
  await page.locator('button.submit[type="submit"]').click();
}

/** Signs the seeded user in through the login page, the way a user does. */
export async function signIn(page: Page): Promise<void> {
  await submitSignInForm(page, credentials());
  await page.waitForURL(/\/notes$/);
}

/** Runs the password grant for the seeded user and returns the token response. */
async function tokenResponse(
  request: APIRequestContext,
): Promise<{ access_token: string }> {
  const { username, password } = credentials();

  const response = await request.post(`${API_URL}/token`, {
    data: {
      grant_type: 'password',
      username,
      password,
      client_id: CLIENT_ID,
    },
  });

  expect(
    response.ok(),
    `POST ${API_URL}/token failed with ${response.status()}`,
  ).toBe(true);

  return response.json();
}

/** A bearer token for the seeded user, for calling the API directly. */
export async function accessToken(request: APIRequestContext): Promise<string> {
  return (await tokenResponse(request)).access_token;
}

/**
 * Puts a real token in localStorage before the application boots, so the specs
 * about the list and the item page do not depend on the login UI.
 */
export async function signInFast(page: Page): Promise<void> {
  const token = JSON.stringify(await tokenResponse(page.request));

  await page.addInitScript(
    ([key, value]) => window.localStorage.setItem(key, value),
    [AUTH_TOKEN_KEY, token],
  );
}

/** A title no other run can collide with, so a spec can find its own row. */
export function uniqueTitle(prefix: string): string {
  return `${prefix} ${Date.now()}`;
}

/** An end button of the generated pages, labelled with the translated key. */
export function endButton(page: Page, text: string): Locator {
  return page.getByRole('button', { name: text, exact: true });
}

/** The list row holding the note with that title. */
export function noteRow(page: Page, title: string): Locator {
  return page.locator('tr[cdk-row]').filter({
    has: page.locator('td[smart-item-key="title"]', { hasText: title }),
  });
}

/**
 * Creates a note through the API, the way the add form's POST does, and
 * returns its id. The specs use it to get a note to list, open and edit;
 * `createNoteThroughForm` is the UI path.
 */
export async function createNote(page: Page, title: string): Promise<string> {
  const token = await accessToken(page.request);

  const response = await page.request.post(`${API_URL}/notes`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { title },
  });

  expect(
    response.ok(),
    `POST ${API_URL}/notes failed with ${response.status()}`,
  ).toBe(true);

  return (await response.json()).id as string;
}

/** Creates a note through the add form and waits for its row in the list. */
export async function createNoteThroughForm(
  page: Page,
  title: string,
): Promise<void> {
  await endButton(page, 'add').click();
  await page.waitForURL(/\/notes\/add$/);

  await page.locator('smart-input-text input[type="text"]').fill(title);
  await endButton(page, 'add').click();

  await page.waitForURL(/\/notes$/);
  await expect(noteRow(page, title)).toBeVisible();
}
