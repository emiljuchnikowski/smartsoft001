---
title: '{{name}}'
section: Skills
order: '{{order}}'
skill: '{{name}}'
nextjs:
  metadata:
    title: '/smart:{{name}}'
    description: '{{one sentence saying what the skill does}}'
---

<!--
  Skeleton for a page of a user-invocable plugin skill. Copy it to
  docs/site/src/app/docs/skills/<name>/page.md, replace every {{...}}
  placeholder and delete these comments.

  `title` and `skill` must both be the skill name exactly as in the
  frontmatter of packages/shared/claude-plugins/src/plugins/smart/skills/<name>/SKILL.md:
  rule R10 of docs-check compares them. `order` is the position inside the
  Skills section, a plain number once filled in.

  The {% skill %} tag below is expanded at build time from the SKILL.md
  frontmatter (description, invocation, allowed tools, source link), so the
  header never drifts from the skill. Write the rest by hand.
-->

{% skill name="{{name}}" /%}

## What it does

{{two or three sentences on the outcome, rewritten from the SKILL.md body}}

## When to use it

- {{situation}}

## Invocation and arguments

```text
/smart:{{name}} {{[arguments]}}
```

{{what each argument means and what the skill asks for}}

## What it produces

{{files written, output shown, side effects}}

## Source

Defined in [`skills/{{name}}/SKILL.md`](https://github.com/emiljuchnikowski/smartsoft001/blob/main/packages/shared/claude-plugins/src/plugins/smart/skills/{{name}}/SKILL.md).
