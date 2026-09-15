import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, test } from 'node:test';

import {
  classifyResult,
  createBrowserRef,
  createBudget,
  createStep,
  closeQuietly,
  createStaticServer,
  formatReport,
  listStories,
  parseArgs,
  probeResponsive,
  withTimeout,
} from './storybook-smoke.mjs';

/** A promise that never settles, standing in for a frozen page. */
function never() {
  return new Promise(() => undefined);
}

const index = {
  v: 5,
  entries: {
    'components-button--playground': {
      id: 'components-button--playground',
      title: 'Components/Button',
      name: 'Playground',
      type: 'story',
      importPath: './button.stories.ts',
      tags: [],
    },
    'components-accordion--playground': {
      id: 'components-accordion--playground',
      title: 'Components/Accordion',
      name: 'Playground',
      type: 'story',
      importPath: './accordion.stories.ts',
      tags: [],
    },
    'components-button--docs': {
      id: 'components-button--docs',
      title: 'Components/Button',
      name: 'Docs',
      type: 'docs',
      importPath: './button.stories.ts',
      tags: ['autodocs'],
    },
  },
};

describe('listStories', () => {
  test('returns the story ids sorted, skipping docs entries', () => {
    const ids = listStories(index);

    assert.deepEqual(ids, [
      'components-accordion--playground',
      'components-button--playground',
    ]);
  });

  test('keeps only the ids matching grep', () => {
    const ids = listStories(index, { grep: 'button' });

    assert.deepEqual(ids, ['components-button--playground']);
  });
});

describe('classifyResult', () => {
  test('passes a story that reached sb-show-main and rendered content', () => {
    const result = classifyResult({
      id: 'components-button--playground',
      state: 'main',
      pageErrors: [],
      consoleErrors: [],
      rootChildCount: 1,
    });

    assert.deepEqual(result, {
      id: 'components-button--playground',
      status: 'ok',
      reasons: [],
      warnings: [],
    });
  });

  test('fails a story whose error display is shown', () => {
    const result = classifyResult({
      id: 'components-button--playground',
      state: 'error',
      pageErrors: [],
      consoleErrors: [],
      rootChildCount: 0,
      errorText: {
        message: 'NullInjectorError: No provider for Router',
        stack: 'at inject (core.mjs:1)\nat Button (button.ts:2)',
      },
    });

    assert.equal(result.status, 'fail');
    assert.deepEqual(result.reasons, [
      'NullInjectorError: No provider for Router (at inject (core.mjs:1))',
    ]);
  });

  test('fails a story that threw an uncaught page error', () => {
    const result = classifyResult({
      id: 'components-card--playground',
      state: 'main',
      pageErrors: ['TypeError: value.map is not a function'],
      consoleErrors: [],
      rootChildCount: 1,
    });

    assert.equal(result.status, 'fail');
    assert.deepEqual(result.reasons, [
      'page error: TypeError: value.map is not a function',
    ]);
  });

  test('fails a story that left the story root empty', () => {
    const result = classifyResult({
      id: 'components-card--empty',
      state: 'main',
      pageErrors: [],
      consoleErrors: [],
      rootChildCount: 0,
    });

    assert.equal(result.status, 'fail');
    assert.deepEqual(result.reasons, ['rendered nothing']);
  });

  test('fails a story that never reached sb-show-main', () => {
    const result = classifyResult({
      id: 'components-drawer--playground',
      state: 'timeout',
      pageErrors: [],
      consoleErrors: [],
      rootChildCount: 0,
      timeout: 15000,
    });

    assert.equal(result.status, 'fail');
    assert.deepEqual(result.reasons, [
      'did not reach sb-show-main within 15000 ms',
    ]);
  });

  test('marks a frozen page as unresponsive in the timeout reason', () => {
    const result = classifyResult({
      id: 'components-drawer--playground',
      state: 'timeout',
      pageErrors: [],
      consoleErrors: [],
      rootChildCount: 0,
      timeout: 15000,
      frozen: true,
    });

    assert.equal(result.status, 'fail');
    assert.deepEqual(result.reasons, [
      'did not reach sb-show-main within 15000 ms (page unresponsive)',
    ]);
  });

  test('keeps a story with console errors green and reports them as warnings', () => {
    const result = classifyResult({
      id: 'components-form--playground',
      state: 'main',
      pageErrors: [],
      consoleErrors: ['NG0100: ExpressionChanged'],
      rootChildCount: 2,
    });

    assert.equal(result.status, 'ok');
    assert.deepEqual(result.reasons, []);
    assert.deepEqual(result.warnings, ['NG0100: ExpressionChanged']);
  });

  test('fails on console errors with strictConsole', () => {
    const result = classifyResult({
      id: 'components-form--playground',
      state: 'main',
      pageErrors: [],
      consoleErrors: ['NG0100: ExpressionChanged'],
      rootChildCount: 2,
      strictConsole: true,
    });

    assert.equal(result.status, 'fail');
    assert.deepEqual(result.reasons, [
      'console error: NG0100: ExpressionChanged',
    ]);
  });
});

describe('createStaticServer', () => {
  function fixtureDir() {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sb-smoke-'));

    fs.writeFileSync(path.join(dir, 'index.html'), '<h1>storybook</h1>');
    fs.writeFileSync(path.join(dir, 'main.js'), 'export const a = 1;');
    fs.mkdirSync(path.join(dir, 'assets'));
    fs.writeFileSync(path.join(dir, 'assets', 'index.json'), '{"v":5}');

    return dir;
  }

  test('serves index.html for / with the right content types', async () => {
    const server = await createStaticServer(fixtureDir());

    try {
      const root = await fetch(`${server.url}/`);
      const script = await fetch(`${server.url}/main.js`);
      const json = await fetch(`${server.url}/assets/index.json`);

      assert.equal(root.status, 200);
      assert.equal(
        root.headers.get('content-type'),
        'text/html; charset=utf-8',
      );
      assert.equal(await root.text(), '<h1>storybook</h1>');
      assert.equal(
        script.headers.get('content-type'),
        'text/javascript; charset=utf-8',
      );
      assert.equal(
        json.headers.get('content-type'),
        'application/json; charset=utf-8',
      );
    } finally {
      await server.close();
    }
  });

  test('answers 404 for a file outside the build', async () => {
    const server = await createStaticServer(fixtureDir());

    try {
      const missing = await fetch(`${server.url}/nope.js`);
      const escape = await fetch(`${server.url}/%2e%2e/%2e%2e/package.json`);

      assert.equal(missing.status, 404);
      assert.equal(escape.status, 404);
    } finally {
      await server.close();
    }
  });
});

describe('parseArgs', () => {
  test('defaults everything but the directory', () => {
    const args = parseArgs(['--dir', 'dist/storybook/angular']);

    assert.equal(args.dir, 'dist/storybook/angular');
    assert.equal(args.concurrency, 4);
    assert.equal(args.timeout, 15000);
    assert.equal(args.grep, undefined);
    assert.equal(args.json, false);
    assert.equal(args.strictConsole, false);
  });

  test('reads the numeric and boolean flags', () => {
    const args = parseArgs([
      '--dir',
      'dist/storybook/crud-shell-angular',
      '--concurrency',
      '1',
      '--timeout',
      '30000',
      '--grep',
      'button',
      '--json',
      '--strict-console',
    ]);

    assert.equal(args.concurrency, 1);
    assert.equal(args.timeout, 30000);
    assert.equal(args.grep, 'button');
    assert.equal(args.json, true);
    assert.equal(args.strictConsole, true);
  });
});

describe('formatReport', () => {
  test('lists every story and counts the outcomes', () => {
    const report = formatReport(
      [
        { id: 'a--one', status: 'ok', reasons: [], warnings: [] },
        { id: 'b--two', status: 'ok', reasons: [], warnings: ['NG0100'] },
        {
          id: 'c--three',
          status: 'fail',
          reasons: ['rendered nothing'],
          warnings: [],
        },
      ],
      { dir: 'dist/storybook/angular' },
    );

    assert.equal(
      report,
      [
        'ok   a--one',
        'ok   b--two — console: NG0100',
        'FAIL c--three — rendered nothing',
        '',
        'storybook-smoke: 3 stories, 2 ok, 1 failed, 1 with console errors (dist/storybook/angular)',
      ].join('\n'),
    );
  });

  test('shows the console errors of a failing story too', () => {
    const report = formatReport(
      [
        {
          id: 'c--three',
          status: 'fail',
          reasons: ['page error: boom'],
          warnings: ['boom'],
        },
      ],
      { dir: 'dist/storybook/crud-shell-angular' },
    );

    assert.match(report, /FAIL c--three — page error: boom — console: boom/);
    assert.match(
      report,
      /1 stories, 0 ok, 1 failed, 1 with console errors \(dist\/storybook\/crud-shell-angular\)/,
    );
  });
});

describe('withTimeout', () => {
  test('passes the value through when the work finishes in time', async () => {
    const outcome = await withTimeout(Promise.resolve('done'), 1000);

    assert.deepEqual(outcome, { timedOut: false, value: 'done' });
  });

  test('gives up on work that never settles', async () => {
    const outcome = await withTimeout(never(), 10);

    assert.equal(outcome.timedOut, true);
  });

  test('reports a rejection as a rejection, not as a timeout', async () => {
    await assert.rejects(
      () => withTimeout(Promise.reject(new Error('boom')), 1000),
      /boom/,
    );
  });

  test('swallows a rejection that arrives after the deadline', async () => {
    const late = new Promise((resolve, reject) =>
      setTimeout(() => reject(new Error('late')), 20),
    );

    const outcome = await withTimeout(late, 5);

    assert.equal(outcome.timedOut, true);

    await new Promise((resolve) => setTimeout(resolve, 40));
  });
});

describe('createBudget', () => {
  test('counts the remaining milliseconds down and never below zero', () => {
    let now = 1000;
    const budget = createBudget(500, () => now);

    assert.equal(budget.remaining, 500);

    now = 1200;
    assert.equal(budget.remaining, 300);

    now = 2000;
    assert.equal(budget.remaining, 0);
    assert.equal(budget.expired, true);
  });
});

describe('closeQuietly', () => {
  test('reports a close that finishes', async () => {
    const closed = await closeQuietly({ close: async () => undefined }, 50);

    assert.equal(closed, true);
  });

  test('reports a close that hangs instead of waiting for it', async () => {
    const closed = await closeQuietly({ close: () => never() }, 20);

    assert.equal(closed, false);
  });

  test('treats a close that throws as closed enough', async () => {
    const closed = await closeQuietly(
      {
        close: async () => {
          throw new Error('already closed');
        },
      },
      50,
    );

    assert.equal(closed, true);
  });
});

describe('createBrowserRef', () => {
  function fakeChromium() {
    const launched = [];
    const chromium = {
      launch: async () => {
        const browser = {
          killed: false,
          process: () => ({
            kill: () => {
              browser.killed = true;
            },
          }),
          close: async () => undefined,
        };

        launched.push(browser);

        return browser;
      },
    };

    return { chromium, launched };
  }

  test('kills the old browser and launches a new one on restart', async () => {
    const { chromium, launched } = fakeChromium();
    const ref = createBrowserRef(chromium);

    await ref.launch();
    const first = ref.current;

    await ref.restart();

    assert.equal(launched.length, 2);
    assert.equal(first.killed, true);
    assert.notEqual(ref.current, first);
  });

  test('relaunches once when two workers restart at the same time', async () => {
    const { chromium, launched } = fakeChromium();
    const ref = createBrowserRef(chromium);

    await ref.launch();
    await Promise.all([ref.restart(), ref.restart()]);

    assert.equal(launched.length, 2);
  });
});

describe('createStep', () => {
  test('hands the work its remaining time and passes the value back', async () => {
    let given;
    const step = createStep(createBudget(1000));

    const value = await step((left) => {
      given = left;

      return Promise.resolve('here');
    });

    assert.equal(value, 'here');
    assert.ok(given > 0 && given <= 1000);
  });

  test('gives the work a grace period on top of its own deadline', async () => {
    const step = createStep(createBudget(50), 200);

    // Work that honours its deadline must be allowed to reject on its own,
    // which is how a responsive but slow page is told apart from a frozen one.
    const value = await step(
      (left) => new Promise((resolve) => setTimeout(() => resolve(left), left)),
    );

    assert.ok(value <= 50);
  });

  test('rejects as frozen when the work ignores its deadline', async () => {
    const step = createStep(createBudget(30), 20);

    await assert.rejects(
      () => step(() => never()),
      (error) => error.name === 'PageFrozenError',
    );
  });

  test('rejects as frozen once the budget is spent', async () => {
    let now = 0;
    const budget = createBudget(10, () => now);

    now = 100;

    await assert.rejects(
      () => createStep(budget)(() => Promise.resolve('never asked')),
      (error) => error.name === 'PageFrozenError',
    );
  });
});

describe('probeResponsive', () => {
  test('says yes when the page answers a trivial evaluate', async () => {
    const page = { evaluate: async () => 1 };

    assert.equal(await probeResponsive(page, 50), true);
  });

  test('says no when the page never answers', async () => {
    const page = { evaluate: () => never() };

    assert.equal(await probeResponsive(page, 20), false);
  });

  test('says no when the page is gone', async () => {
    const page = {
      evaluate: async () => {
        throw new Error('Target closed');
      },
    };

    assert.equal(await probeResponsive(page, 50), false);
  });
});
