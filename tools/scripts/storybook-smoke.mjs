/**
 * Renders every story of a static Storybook build in a headless browser and
 * fails when one of them throws, so a story that compiles but crashes at
 * runtime cannot reach the published site.
 */

import { once } from 'node:events';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const CONTENT_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

/**
 * Serves `dir` over HTTP on a free port and resolves once it listens.
 * Storybook's iframe needs a real origin, so a build cannot be opened through
 * `file://`.
 */
export async function createStaticServer(dir) {
  const root = path.resolve(dir);
  const server = http.createServer((request, response) => {
    const file = resolveRequest(root, request.url);

    if (!file) {
      response.writeHead(404, CONTENT_TYPES['.txt']);
      response.end('not found');

      return;
    }

    response.writeHead(200, {
      'content-type':
        CONTENT_TYPES[path.extname(file)] ?? CONTENT_TYPES['.txt'],
    });
    fs.createReadStream(file).pipe(response);
  });

  server.listen(0, '127.0.0.1');
  await once(server, 'listening');

  return {
    url: `http://127.0.0.1:${server.address().port}`,
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}

/** The file a request maps to, or `null` when it leaves `root` or is missing. */
function resolveRequest(root, url) {
  const pathname = decodeURIComponent(
    new URL(url, 'http://localhost').pathname,
  );
  const file = path.resolve(
    root,
    `.${pathname === '/' ? '/index.html' : pathname}`,
  );

  if (file !== root && !file.startsWith(root + path.sep)) return null;
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return null;

  return file;
}

/** The story ids of an index, sorted, optionally narrowed by `grep`. */
export function listStories(indexJson, { grep } = {}) {
  return Object.values(indexJson?.entries ?? {})
    .filter((entry) => entry.type === 'story')
    .map((entry) => entry.id)
    .filter((id) => !grep || id.includes(grep))
    .sort();
}

/**
 * Turns what the browser observed for one story into a verdict.
 *
 * `state` is `main` when the story reached `sb-show-main`, `error` when
 * Storybook swapped in its error display and `timeout` when neither happened
 * before the deadline. `frozen` says the deadline passed with the page not
 * answering at all, which a story with a synchronous infinite loop causes.
 */
export function classifyResult({
  id,
  state,
  pageErrors = [],
  consoleErrors = [],
  rootChildCount = 0,
  errorText,
  timeout,
  strictConsole = false,
  frozen = false,
}) {
  const reasons = [];

  if (state === 'error') {
    reasons.push(formatErrorDisplay(errorText));
  }

  for (const error of pageErrors) {
    reasons.push(`page error: ${firstLine(error)}`);
  }

  if (state === 'timeout') {
    reasons.push(
      `did not reach sb-show-main within ${timeout} ms${
        frozen ? ' (page unresponsive)' : ''
      }`,
    );
  }

  if (state === 'main' && !reasons.length && rootChildCount === 0) {
    reasons.push('rendered nothing');
  }

  // Angular's dev mode logs a lot of noise, so console errors only warn unless
  // the caller asked for them to count.
  if (strictConsole) {
    for (const error of consoleErrors) {
      reasons.push(`console error: ${firstLine(error)}`);
    }
  }

  return {
    id,
    status: reasons.length ? 'fail' : 'ok',
    reasons,
    warnings: strictConsole ? [] : consoleErrors.map(firstLine),
  };
}

/** The first line of a multi-line message, trimmed. */
function firstLine(text) {
  return String(text ?? '')
    .split('\n')[0]
    .trim();
}

/** The error display as one line: its message plus the first stack frame. */
function formatErrorDisplay(errorText) {
  const message = (errorText?.message ?? '').trim() || 'story failed to render';
  const frame = (errorText?.stack ?? '').split('\n')[0].trim();

  return frame ? `${message} (${frame})` : message;
}

/** The command line, with the defaults a CI run is happy with. */
export function parseArgs(argv) {
  const value = (name, fallback) => {
    const index = argv.indexOf(name);

    return index === -1 ? fallback : argv[index + 1];
  };

  return {
    dir: value('--dir', 'dist/storybook/angular'),
    concurrency: Number(value('--concurrency', 4)),
    timeout: Number(value('--timeout', 15000)),
    grep: value('--grep', undefined),
    json: argv.includes('--json'),
    strictConsole: argv.includes('--strict-console'),
  };
}

/** One line per story followed by the summary line. */
export function formatReport(results, { dir }) {
  const failed = results.filter((result) => result.status === 'fail');
  const warned = results.filter((result) => result.warnings.length);
  const lines = results.map((result) => {
    const noise = result.warnings.length
      ? ` — console: ${result.warnings.join('; ')}`
      : '';

    return result.status === 'fail'
      ? `FAIL ${result.id} — ${result.reasons.join('; ')}${noise}`
      : `ok   ${result.id}${noise}`;
  });

  return [
    ...lines,
    '',
    `storybook-smoke: ${results.length} stories, ${
      results.length - failed.length
    } ok, ${failed.length} failed, ${warned.length} with console errors (${dir})`,
  ].join('\n');
}

/**
 * Awaits `work`, but gives up after `ms`. Playwright's own timeouts do not
 * cover a page whose main thread never yields, so every browser call is raced
 * against a timer of ours. A late rejection is swallowed: the caller has
 * already moved on and an unhandled rejection would take the run down.
 */
export function withTimeout(work, ms) {
  let timer;
  const settled = Promise.resolve(work).then(
    (value) => ({ timedOut: false, value }),
    (error) => {
      if (timer) throw error;

      return { timedOut: true };
    },
  );

  return Promise.race([
    settled,
    new Promise((resolve) => {
      timer = setTimeout(() => {
        timer = null;
        resolve({ timedOut: true });
      }, ms);
    }),
  ]).finally(() => clearTimeout(timer));
}

/** The time a single story has left, shared by all of its browser calls. */
export function createBudget(timeout, now = () => Date.now()) {
  const start = now();
  const remaining = () => Math.max(0, timeout - (now() - start));

  return {
    get remaining() {
      return remaining();
    },
    get expired() {
      return remaining() === 0;
    },
  };
}

/** How long a page, context or browser gets to close before it is abandoned. */
const CLOSE_TIMEOUT = 2000;

/**
 * Closes a page, context or browser without ever blocking the run. Returns
 * whether it actually closed: a page whose renderer is stuck in a loop never
 * answers the close request.
 */
export async function closeQuietly(closable, ms = CLOSE_TIMEOUT) {
  const outcome = await withTimeout(
    Promise.resolve()
      .then(() => closable.close())
      // A close that throws has already lost whatever it was holding.
      .catch(() => undefined),
    ms,
  );

  return !outcome.timedOut;
}

/**
 * Holds the browser the workers share, so that a single worker can replace it
 * after a frozen page without the others losing their handle.
 */
export function createBrowserRef(chromium) {
  let browser = null;
  let restarting = null;

  return {
    get current() {
      return browser;
    },
    async launch() {
      browser = await chromium.launch();

      return browser;
    },
    /** Last resort: SIGKILL the browser process and start a fresh one. */
    async restart() {
      if (restarting) return restarting;

      restarting = (async () => {
        const dying = browser;

        try {
          dying?.process()?.kill('SIGKILL');
        } catch {
          // The process may already be gone; the relaunch below is what counts.
        }

        if (dying) await closeQuietly(dying);

        browser = await chromium.launch();
      })().finally(() => {
        restarting = null;
      });

      return restarting;
    },
    async close() {
      if (!browser) return;

      if (!(await closeQuietly(browser))) {
        browser.process()?.kill('SIGKILL');
      }
    },
  };
}

/** Thrown when a step ran out of the story's time budget. */
class PageFrozenError extends Error {
  name = 'PageFrozenError';
}

/**
 * How much longer than its own deadline a browser call is given before the
 * page counts as frozen. Playwright enforces its timeout from Node, so a
 * responsive page always fails on its own first; only a page that stops
 * answering lets our timer win.
 */
const FROZEN_GRACE = 500;

/** How long the responsiveness probe waits for the page to answer. */
const PROBE_TIMEOUT = 1000;

/**
 * Whether the page still runs JavaScript. A story with a synchronous infinite
 * loop leaves a renderer that answers nothing, and the next story on that page
 * would be blamed for it, so every story ends with this probe.
 */
export async function probeResponsive(page, ms = PROBE_TIMEOUT) {
  const outcome = await withTimeout(
    Promise.resolve()
      .then(() => page.evaluate(() => true))
      .catch(() => false),
    ms,
  );

  return outcome.timedOut ? false : Boolean(outcome.value);
}

/**
 * A `step` function bound to one story's budget: it hands each browser call
 * the time that is left and turns a call that outlives even the grace period
 * into a `PageFrozenError`.
 */
export function createStep(budget, grace = FROZEN_GRACE) {
  return async (work) => {
    const left = budget.remaining;

    if (!left) throw new PageFrozenError();

    const outcome = await withTimeout(work(left), left + grace);

    if (outcome.timedOut) throw new PageFrozenError();

    return outcome.value;
  };
}

/**
 * Opens every story once in a shared Chromium, `concurrency` pages at a time,
 * and returns the classified results in the order the ids were given.
 *
 * A story that freezes its page cannot be cleaned up the usual way, so each
 * worker owns a browser context it can throw away and rebuild; if even that
 * does not close, the browser process is killed and relaunched. The run always
 * terminates and always reports every id.
 */
export async function visitStories({
  url,
  ids,
  concurrency = 4,
  timeout = 15000,
  strictConsole = false,
}) {
  const { chromium } = await import('playwright');
  const browsers = createBrowserRef(chromium);

  await browsers.launch();

  const queue = [...ids];
  const results = new Map();
  const attempts = new Map();
  const attempt = (id) => {
    const tried = (attempts.get(id) ?? 0) + 1;

    attempts.set(id, tried);

    return tried;
  };

  const worker = async () => {
    let session = await openSession(browsers);

    while (queue.length) {
      const id = queue.shift();
      let outcome;

      try {
        outcome = await visitStory(session.page, {
          url,
          id,
          timeout,
          strictConsole,
        });
      } catch (error) {
        // The browser or the context died under us, usually because another
        // worker had to restart it. Rebuild and give the story one more go.
        session = await recover(browsers, session);

        if (attempt(id) < 2) {
          queue.unshift(id);

          continue;
        }

        results.set(
          id,
          classifyResult({
            id,
            state: 'main',
            pageErrors: [`browser error: ${error.message}`],
            timeout,
            strictConsole,
          }),
        );

        continue;
      }

      if (outcome.frozen) {
        // The page stopped answering, so it cannot carry the next story.
        session = await recover(browsers, session);

        // A story can also inherit a page that the previous one froze, so a
        // failure on a frozen page buys one retry on a fresh page. A story
        // that freezes the page itself fails the second time too.
        if (outcome.result.status === 'fail' && attempt(id) < 2) {
          queue.unshift(id);

          continue;
        }
      }

      results.set(id, outcome.result);
    }

    await closeQuietly(session.page);
    await closeQuietly(session.context);
  };

  const workers = Array.from(
    { length: Math.max(1, Math.min(concurrency, ids.length)) },
    () =>
      worker().catch((error) => {
        console.error(`storybook-smoke: worker gave up — ${error.message}`);
      }),
  );

  try {
    await Promise.all(workers);
  } finally {
    await browsers.close();
  }

  // A worker that gave up leaves its stories unvisited; they are reported as
  // failures rather than silently dropped from the run.
  return ids.map(
    (id) =>
      results.get(id) ??
      classifyResult({
        id,
        state: 'main',
        pageErrors: ['not visited: the browser could not be recovered'],
        timeout,
        strictConsole,
      }),
  );
}

/** A fresh context with a single page in it, relaunching the browser if need be. */
async function openSession(browsers) {
  try {
    const context = await browsers.current.newContext();

    return { context, page: await context.newPage() };
  } catch {
    // The browser died, most likely killed by another worker's recovery.
    await browsers.restart();

    const context = await browsers.current.newContext();

    return { context, page: await context.newPage() };
  }
}

/**
 * Gets back to a usable page after a frozen story: close the page, else drop
 * the whole context with it, else kill and relaunch the browser.
 */
async function recover(browsers, session) {
  if (await closeQuietly(session.page)) {
    await closeQuietly(session.context);
  } else if (!(await closeQuietly(session.context))) {
    await browsers.restart();
  }

  return openSession(browsers);
}

/**
 * Loads one story in an already open page and classifies what happened.
 * Returns the verdict plus whether the page stopped answering, which tells the
 * worker it has to rebuild before the next story.
 */
async function visitStory(page, { url, id, timeout, strictConsole }) {
  const pageErrors = [];
  const consoleErrors = [];
  const onPageError = (error) =>
    pageErrors.push(error.message || String(error));
  const onConsole = (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  };

  page.on('pageerror', onPageError);
  page.on('console', onConsole);

  const budget = createBudget(timeout);
  // Every browser call is bounded by what is left of this story's budget, so
  // a page that never yields cannot stall the whole run.
  const step = createStep(budget);

  let state = 'timeout';
  let rootChildCount = 0;
  let frozen = false;
  let errorText;

  try {
    await step((left) =>
      page.goto(
        `${url}/iframe.html?id=${encodeURIComponent(id)}&viewMode=story`,
        {
          timeout: left,
        },
      ),
    );
    await step((left) =>
      page.waitForFunction(
        () =>
          document.body.classList.contains('sb-show-main') ||
          document.body.classList.contains('sb-show-errordisplay'),
        null,
        { timeout: left },
      ),
    );

    state = await step(() =>
      page.evaluate(() =>
        document.body.classList.contains('sb-show-errordisplay')
          ? 'error'
          : 'main',
      ),
    );

    if (state === 'error') {
      errorText = await step(() =>
        page.evaluate(() => ({
          message: document.querySelector('#error-message')?.textContent ?? '',
          stack: document.querySelector('#error-stack')?.textContent ?? '',
        })),
      );
    } else {
      rootChildCount = await step(() =>
        page.evaluate(
          () =>
            document.querySelector('#storybook-root')?.childElementCount ?? 0,
        ),
      );
    }
  } catch (error) {
    if (error instanceof PageFrozenError || error?.name === 'TimeoutError') {
      state = 'timeout';
    } else {
      // A dead server or a closed page is reported as if the story had thrown.
      state = 'main';
      pageErrors.push(`navigation failed: ${error.message}`);
    }
  } finally {
    page.off('pageerror', onPageError);
    page.off('console', onConsole);
  }

  // Whatever happened above, the page has to be able to answer before the next
  // story may reuse it.
  frozen = !(await probeResponsive(page));

  return {
    frozen,
    result: classifyResult({
      id,
      state,
      pageErrors,
      consoleErrors,
      rootChildCount,
      errorText,
      timeout,
      strictConsole,
      frozen,
    }),
  };
}

/** Reads `<dir>/index.json`, or `null` when it is missing or malformed. */
export function readIndex(dir) {
  try {
    return JSON.parse(fs.readFileSync(path.join(dir, 'index.json'), 'utf8'));
  } catch {
    return null;
  }
}

async function main(argv) {
  const options = parseArgs(argv);
  const dir = path.resolve(options.dir);
  const index = readIndex(dir);

  if (!index) {
    console.error(
      `storybook-smoke: cannot read ${path.join(options.dir, 'index.json')} — build the Storybook first`,
    );

    return 1;
  }

  const ids = listStories(index, { grep: options.grep });
  const server = await createStaticServer(dir);
  let results;

  try {
    results = await visitStories({
      url: server.url,
      ids,
      concurrency: options.concurrency,
      timeout: options.timeout,
      strictConsole: options.strictConsole,
    });
  } finally {
    await server.close();
  }

  if (options.json) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    console.log(formatReport(results, { dir: options.dir }));
  }

  return results.some((result) => result.status === 'fail') ? 1 : 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = await main(process.argv.slice(2));
}
