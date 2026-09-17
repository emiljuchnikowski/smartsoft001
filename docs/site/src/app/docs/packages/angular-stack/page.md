---
title: '@smartsoft001/angular-stack'
section: Packages
order: 2
package: '@smartsoft001/angular-stack'
nextjs:
  metadata:
    title: '@smartsoft001/angular-stack'
    description: '@smartsoft001/angular-stack installs everything an Angular application uses: the core packages, the UI library and the CRUD screens.'
---

`@smartsoft001/angular-stack` installs everything an Angular application uses: the core packages, the UI library and the CRUD screens. {% .lead %}

---

## Install

```bash
npm install @smartsoft001/angular-stack
```

## What it is

It ships no code of its own, only pinned dependencies, so the browser half of the framework arrives at one version with one command.

A frontend written in another framework gets its own stack when that library exists; `core` and the packages below keep their names either way.

## Usage

After installing, register the shared providers once in the application config:

{% snippet file="angular/src/getting-started/app-config.example.ts" region="usage" /%}

## API

None of its own. The package is a manifest with pinned dependencies, so what it brings is its whole interface:

| Package                                                                 |
| ----------------------------------------------------------------------- |
| [`@smartsoft001/core`](/docs/packages/core)                             |
| [`@smartsoft001/angular`](/docs/packages/angular)                       |
| [`@smartsoft001/crud-shell-angular`](/docs/packages/crud-shell-angular) |

Every version is pinned exactly, so the set installs at one version and a release never leaves two of these packages on different ones.

## Related packages

The UI components have their own [Components](/docs/components) section, and the generated screens are documented under [CRUD](/docs/crud/overview).
