---
name: docs
description: Add or update a page on the public documentation site for a package, a UI component or a skill, with every code sample cut from an executed example. Use when a new package, component or user-invocable skill appears, or when docs-check reports a missing page.
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - AskUserQuestion
---

# Docs Skill

Add a page to the public documentation site (`docs/site`, deployed to
https://framework.smartflow.biz.pl/) and the executed example its code comes from.

Every code sample on a reference page is a region of a file that CI compiles and tests. Nothing on a
package or component page is hand-written code, and `docs-check` fails the pull request when a page,
an example or a region is missing. This skill walks one of those three flows end to end and finishes
by running the same checks CI runs.

## Usage

```text
/docs package <alias>          # e.g. /docs package paynow
/docs component <name>         # e.g. /docs component drawer
/docs skill <name>             # e.g. /docs skill audit-log
```

Without arguments, run `node tools/scripts/docs-check.mjs` first and offer the flows for whatever it
reports as missing.

## Templates

Templates live next to the tooling, in `docs/site/tools/templates/`, and are the single source for the
page skeletons. Do **not** copy them into this skill.

| Flow        | Template                                      | Destination                                                                     |
| ----------- | --------------------------------------------- | ------------------------------------------------------------------------------- |
| `package`   | `docs/site/tools/templates/package-page.md`   | `docs/site/src/app/docs/packages/<alias>/page.md`                               |
| `component` | `docs/site/tools/templates/component-page.md` | `docs/site/content/components/<name>.md` (only for a component without a skill) |
| `skill`     | `docs/site/tools/templates/skill-page.md`     | `docs/site/src/app/docs/skills/<name>/page.md`                                  |

## Flow: package

For a new (or undocumented) `@smartsoft001/<alias>` library.

- [ ] **1. Read the package** — its `package.json`, `README.md`, `src/index.ts` and the main service or
      module. The page describes what the package does today, not what its README claimed a year ago.
- [ ] **2. Pick the example project** — an Angular library (its manifest is under `packages/**/angular/`)
      goes to `docs-examples-angular`, a React library (`packages/**/react/`) to `docs-examples-react`
      (`.example.tsx` files), everything else to `docs-examples-node`. Ask when it is ambiguous.
- [ ] **3. Write the example first** — `docs/examples/<project>/src/<alias>/<topic>.example.ts`, the whole
      file wrapped in `// #region usage` … `// #endregion`, importing from `@smartsoft001/<alias>` exactly
      as a consumer would. No network, no database, no timers left running.
- [ ] **4. Write its spec** — `<topic>.example.spec.ts` next to it, `describe('docs-examples-<project>: <Subject>')`,
      asserting the behaviour the page claims. Run it: `npx nx test docs-examples-node --testPathPatterns=<alias>`.
- [ ] **5. Copy the template** to `docs/site/src/app/docs/packages/<alias>/page.md` and fill it in:
      frontmatter (`title: '@smartsoft001/<alias>'`, `section: Packages`, `order`, `package`), a lead
      sentence, `## Install`, `## What it is`, `## Usage` with the snippet tag, `## API`, `## Related packages`.
      Rule R8 requires the three headings, the `package` key and at least one snippet.
- [ ] **6. Add it to the index** — a row in the right family table of `docs/site/src/app/docs/packages/page.md`.
- [ ] **7. Verify** — see [Verification](#verification).

The snippet path is relative to `docs/examples` and includes the `src/` segment:

```markdown
{% snippet file="node/src/paynow/payment.example.ts" region="usage" /%}
```

An unpublished package has no install command: replace the `bash` fence with a `{% callout %}` saying
where the code lives. R8 accepts either.

## Flow: component

For a UI component of `@smartsoft001/angular`. Component pages are **generated** from the plugin skill
`packages/shared/claude-plugins/src/plugins/smart-angular/skills/angular-components-<name>/SKILL.md` and are
git-ignored, so the work is in the sources the generator reads.

- [ ] **1. Check the skill exists** — if it does not, the component page cannot be generated. Write the
      per-component skill first (the `angular-components` skill in
      `packages/shared/angular/.claude/skills/` owns that step), or, for a component that
      will never have one, write `docs/site/content/components/<name>.md` from the component template.
- [ ] **2. Mark the usage region** — wrap the primary story of
      `packages/shared/angular/src/lib/components/<name>/<name>.component.stories.ts` in the markers shown
      below, at column 0. That region is shown verbatim on the page, so keep the story minimal and
      realistic. Rule R9 fails the check when a component has no story or no region.
- [ ] **3. Optional, the extending example** — when the skill has an "Extending the Base Class" section,
      add `docs/examples/angular/src/components/<name>/custom.example.ts` (+ spec) and the generator
      replaces the skill's snippet with it. Register the custom class through
      `<NAME>_STANDARD_COMPONENT_TOKEN` in a host component and assert through the wrapper: it re-emits
      its own outputs from the custom instance (`forwardOutletOutputs`) and passes its projected content
      to the custom instance's default `<ng-content>` (`outletContent`).
- [ ] **4. Generate and look at the result** — `npx nx run docs:generate-components`, then read
      `docs/site/src/app/docs/components/<name>/page.md`. The generator prints every code fence it dropped
      from the skill; a fence that carried real information belongs in an example, not in prose.
- [ ] **5. Verify** — see [Verification](#verification), plus `npx nx run angular:build-storybook -c ci`
      because the region has to compile.

The markers of step 2:

```ts
// #region usage
export const Playground: Story = {
  // …
};
// #endregion
```

## Flow: skill

For a plugin skill a user can invoke. Rule R3 requires a page under `docs/skills/` for every skill of the
`smart-core`, `smart-angular` and `smart-react` plugins (`@smartsoft` marketplace) whose frontmatter says
`user-invocable: true`. The repository's own skills, in `.claude/skills` and in the libraries'
`<package>/.claude/skills`, are tooling for working on the framework and have no page on the public site.

- [ ] **1. Copy the template** to the destination from the table above.
- [ ] **2. Set `title` and `skill` to the skill name** exactly as in the skill's own frontmatter. Rule R10
      compares them and fails on a mismatch.
- [ ] **3. Keep the header tag** — `{% skill name="<name>" /%}`. It is expanded at build time from the skill's frontmatter into the description, the
      invocation, the allowed tools and a source link, so that part of the page cannot drift.
- [ ] **4. Write the body** — what it does, when to use it, invocation and arguments, what it produces,
      source. Rewrite the prose, do not paste the whole SKILL.md: the page is for a person deciding
      whether to run the command.
- [ ] **5. Link it** — from the section index (`docs/skills/page.md`).
- [ ] **6. Verify** — see [Verification](#verification).

## Verification

Run all of these before committing; they are what the pull request pipeline runs:

```bash
npx nx run docs:check
npx nx run-many -t test build lint -p docs docs-examples-angular docs-examples-node docs-examples-react
npx nx format:check
```

For the component flow add:

```bash
npx nx run docs:generate-components
npx nx run angular:build-storybook -c ci
```

Report at the end: which files were created, the `docs-check` summary line, the test counts, and any
rule that needed a second pass.

## The rules docs-check enforces

`tools/scripts/docs-check.mjs`, rule bodies in `docs/site/tools/check-rules.mjs`. The parity rules
(R1, R2, R3, R9, R10) are the ones `--strict` controls; `docs:check` runs them as errors today.

| Rule | What it means for this skill                                                     |
| ---- | -------------------------------------------------------------------------------- |
| R1   | A published package without a page fails CI. The `package` flow exists for this. |
| R2   | Every UI component needs a page; usually generated, so check the skill exists.   |
| R3   | Every `user-invocable: true` skill needs a page, per its source.                 |
| R4   | Every `{% snippet %}` must resolve to an existing file and region.               |
| R5   | Every `{% storybook %}` id must exist in the built Storybook index.              |
| R6   | No hand-written TypeScript or HTML on reference pages; embed a snippet instead.  |
| R7   | Frontmatter needs `title` and a section from `docs/site/tools/sections.mjs`.     |
| R8   | Package pages need `package`, the Install / Usage / API headings and a snippet.  |
| R9   | Every component needs a story with a `usage` region.                             |
| R10  | A `skill:` key and every `{% skill %}` tag must name a real skill; title = name. |
| R11  | Every fenced code block declares a language.                                     |

## Gotchas

These cost time before they were written down:

- **A fence without a language breaks the build.** `next build` fails with `Cannot read properties of
undefined (reading 'toLowerCase')` and names the page but not the line. Use `text` for plain output.
  R11 now catches it before the build does.
- **The example is type-checked against the package source.** An invented method fails the spec run, not
  review, so write the example against the real API and let the failure tell you when a README lied.
- **Formatting covers fixtures and pages too.** Run `npx prettier --write` on everything you created;
  `nx format:check` is part of the pipeline.
- **A Markdoc tag quoted inside a code fence is left alone** — showing the syntax on a page is safe, and
  `docs-check` ignores those tags.
- **Generated component pages are git-ignored.** Never edit `docs/site/src/app/docs/components/**`; change
  the skill, the story or the example and regenerate.
- **The commit scope for the site is `nx`.** There is no `docs` scope and no `angular` scope in
  `commitlint.config.js`; a change to `packages/shared/angular` is `feat(shared)`.
- **Do not put credential-looking literals in an example spec.** The secret scanner blocks the pull
  request even for an obviously fake password, and it scans every commit on the branch, so fixing it
  means rewriting the branch. Use clearly named placeholder variables.
- **Storybook iframes need the deployed build.** `nx run docs:serve` has no Storybook, so story embeds
  are empty locally; that is expected.
- **Write internal links as `/docs/...` and nothing else.** The site is served under `/smartsoft001`,
  and only `next/link` adds that prefix; the Markdoc `link` node routes every internal href through it.
  A hand-written `<a href="/docs/x">` in a tag or component bypasses it and 404s on GitHub Pages.
  `docs/site/tools/check-export.mjs` runs after `next build` and fails on any absolute reference without
  the prefix.

## Related

- `angular-components` skill (`packages/shared/angular/.claude/skills/`) — creating or changing an
  Angular component; its last step calls this skill.
- `nx-conventions`, `test-unit` — the repository conventions the examples follow.
