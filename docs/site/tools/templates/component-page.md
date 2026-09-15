---
title: '{{Title}}'
section: Components
component: '{{name}}'
nextjs:
  metadata:
    title: '{{Title}}'
    description: '{{one sentence saying what the component does}}'
---

<!--
  Skeleton for a HAND-WRITTEN component page. Most component pages are
  generated from the plugin skill `angular-components-<name>/SKILL.md` by
  `nx run docs:generate-components`; write a page by hand only for a component
  that has no skill. Save it as docs/site/content/components/<name>.md (NOT
  under src/app, which is generated and git-ignored), replace every {{...}}
  placeholder and delete these comments. `order` is computed by the
  generator, do not add it.

  The Usage block must embed the `usage` region of the component's stories
  file; rule R9 requires that region and rule R6 rejects hand-written code.
-->

`<smart-{{name}}>` {{what it renders and when to use it}}. {% .lead %}

---

## Usage

{% snippet file="packages/shared/angular/src/lib/components/{{name}}/{{name}}.component.stories.ts" region="usage" /%}

{% storybook project="angular" story="components-{{name}}--playground" height=320 /%}

## Components

### {{Name}}Component (`<smart-{{name}}>`)

{{what the wrapper does and which base class it extends}}

## API

### Inputs

| Input | Type | Default | Description |
| ----- | ---- | ------- | ----------- |

### Outputs

| Output | Type | Description |
| ------ | ---- | ----------- |

## Source

The component lives in [`packages/shared/angular/src/lib/components/{{name}}`](https://github.com/emiljuchnikowski/smartsoft001/tree/main/packages/shared/angular/src/lib/components/{{name}}).
