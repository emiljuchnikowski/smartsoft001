---
title: '@smartsoft001/react-stack'
section: Packages
order: 3
package: '@smartsoft001/react-stack'
nextjs:
  metadata:
    title: '@smartsoft001/react-stack'
    description: '@smartsoft001/react-stack installs everything a React application uses: the core packages, the UI library and the CRUD screens.'
---

`@smartsoft001/react-stack` installs everything a React application uses: the core packages, the UI library and the CRUD screens. {% .lead %}

---

## Install

```bash
npm install @smartsoft001/react-stack react react-dom
```

## What it is

It ships no code of its own, only pinned dependencies, so the browser half of the framework arrives at one version with one command. It is the React counterpart of [`angular-stack`](/docs/packages/angular-stack): the same `core`, with the React UI library and CRUD screens in place of the Angular ones. React itself is a peer dependency the application installs.

## Usage

After installing, wrap the application once in `SmartProvider`. This one renders every component with the preset look:

{% snippet file="react/src/react-stack/app-providers.example.tsx" region="usage" /%}

## API

None of its own. The package is a manifest with pinned dependencies, so what it brings is its whole interface:

| Package                                                             |
| ------------------------------------------------------------------- |
| [`@smartsoft001/core`](/docs/packages/core)                         |
| [`@smartsoft001/react`](/docs/packages/react)                       |
| [`@smartsoft001/crud-shell-react`](/docs/packages/crud-shell-react) |

Every version is pinned exactly, so the set installs at one version and a release never leaves two of these packages on different ones.

## Related packages

[`@smartsoft001/react`](/docs/packages/react) documents the provider, the components and the form engine; [`@smartsoft001/crud-shell-react`](/docs/packages/crud-shell-react) the generated screens.
