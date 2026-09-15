---
title: docs
section: Contributing
order: 5
skill: docs
nextjs:
  metadata:
    title: /docs
    description: The repository skill that adds a documentation page for a package, a component or a skill, with the executed example its code comes from.
---

{% skill name="docs" source="repo" /%}

## What it does

Walks one of three flows end to end and finishes by running the checks the pull request pipeline runs.
For a **package** it writes the executed example and its spec first, then the page from the package
template, then the row in the package index. For a **component** it marks the `usage` region in the
Storybook story, optionally adds the extension example, and regenerates the page the skill produces.
For a **skill** it writes the page under `docs/skills` or `docs/contributing` with the frontmatter the
parity rules expect.

It uses the templates in `docs/site/tools/templates/` rather than copies of its own, so a change to a
page skeleton reaches every future page at once.

## When to use it

- A new `@smartsoft001/*` package, UI component or user-invocable skill appeared and `docs-check`
  reports a missing page.
- An existing page has hand-written code that should come from an example instead.
- You are about to write a page by hand and want the conventions applied for you.

## Invocation and arguments

```text
/docs package <alias>
/docs component <name>
/docs skill <name>
```

Called without arguments it runs the parity check first and offers a flow for each gap it finds. It
asks before choosing between the Node and the Angular example project when the package could go either
way.

## What it produces

A page under `docs/site/src/app/docs/`, an example plus spec under `docs/examples/`, the index row or
section link that makes the page reachable, and a report naming the files, the `docs-check` summary and
the test counts. Component pages are generated rather than written, so there the output is the region in
the story and, when the skill documents one, the extension example.

## Where the same process is written out

[Documentation](/docs/contributing/documentation) covers the same ground for a person reading rather
than running: where each kind of page comes from, the snippet and region conventions, and what each of
the `docs-check` rules checks.

## Source

Defined in [`.claude/skills/docs/SKILL.md`](https://github.com/emiljuchnikowski/smartsoft001/blob/main/.claude/skills/docs/SKILL.md).
