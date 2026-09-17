---
title: '@smartsoft001/nestjs-stack'
section: Packages
order: 3
package: '@smartsoft001/nestjs-stack'
nextjs:
  metadata:
    title: '@smartsoft001/nestjs-stack'
    description: '@smartsoft001/nestjs-stack installs the server side: the shared module, MongoDB access, the CRUD and auth shells, and the core packages they build on.'
---

`@smartsoft001/nestjs-stack` installs the server side: the shared module, MongoDB access, the CRUD and auth shells, and the core packages they build on. {% .lead %}

---

## Install

```bash
npm install @smartsoft001/nestjs-stack
```

## What it is

It ships no code of its own, only pinned dependencies.

Payment providers are deliberately not here: a service that does not take payments should not install four provider SDKs. They live in [`payments-stack`](/docs/packages/payments-stack).

## Usage

After installing, configure the shared module once in the application module:

{% snippet file="node/src/getting-started/app-module.example.ts" region="usage" /%}

## API

None of its own. The package is a manifest with pinned dependencies, so what it brings is its whole interface:

| Package                                                               |
| --------------------------------------------------------------------- |
| [`@smartsoft001/core`](/docs/packages/core)                           |
| [`@smartsoft001/nestjs`](/docs/packages/nestjs)                       |
| [`@smartsoft001/mongo`](/docs/packages/mongo)                         |
| [`@smartsoft001/crud-shell-nestjs`](/docs/packages/crud-shell-nestjs) |
| [`@smartsoft001/auth-shell-nestjs`](/docs/packages/auth-shell-nestjs) |

Every version is pinned exactly, so the set installs at one version and a release never leaves two of these packages on different ones.

## Related packages

The endpoints this stack generates are documented under [CRUD](/docs/crud/overview).
