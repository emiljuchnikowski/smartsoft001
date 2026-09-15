---
title: '@smartsoft001/{{name}}'
section: Packages
order: '{{order}}'
package: '@smartsoft001/{{name}}'
nextjs:
  metadata:
    title: '@smartsoft001/{{name}}'
    description: '{{description}}'
---

<!--
  Skeleton for a package page. Copy it to
  docs/site/src/app/docs/packages/<name>/page.md, replace every {{...}}
  placeholder and delete these comments.

  The frontmatter must stay the first thing in the file. `title` starts with
  "@", so it stays quoted: unquoted it is not valid YAML. The same goes for
  the placeholders, `{{...}}` is a YAML flow mapping when it is left bare.
  `order` is the position inside the Packages section, a plain number once it
  is filled in, so drop its quotes. `package` is the published name and rule
  R8 checks that it matches the directory name.

  R8 also requires the Install, Usage and API headings and at least one
  {% snippet %} tag, so keep all four.
-->

{{one sentence saying what the package does, in the present tense}} {% .lead %}

---

## Install

```bash
npm install @smartsoft001/{{name}}
```

<!--
  An unpublished package has no install command: replace the fence above with
  a {% callout %} saying where the code lives. R8 accepts either.
-->

## What it is

{{two or three sentences: the problem the package solves and where it fits}}

## Usage

{% snippet file="node/src/{{name}}/{{topic}}.example.ts" region="usage" /%}

<!--
  Never hand-write code on a package page, rule R6 rejects it. Put the example
  under docs/examples, wrap it in `// #region usage` and `// #endregion`
  markers, then embed it with the tag above.
-->

## API

{{one subsection per exported symbol, with its signature and what it returns}}

## Related packages

{{links to the packages this one is usually combined with}}
