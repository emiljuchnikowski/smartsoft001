---
title: '@smartsoft001/full-stack'
section: Packages
order: 5
package: '@smartsoft001/full-stack'
nextjs:
  metadata:
    title: '@smartsoft001/full-stack'
    description: '@smartsoft001/full-stack installs the whole framework for a project with an Angular frontend and a NestJS backend: the core packages and both runtime stacks.'
---

`@smartsoft001/full-stack` installs the whole framework for a project with an Angular frontend and a NestJS backend: the core packages and both runtime stacks. {% .lead %}

---

## Install

```bash
npm install @smartsoft001/full-stack
```

## What it is

It ships no code of its own, only pinned dependencies. A project that has both halves, which is the usual shape of an application built on this framework, gets everything at one version with one command instead of choosing two stacks and keeping them in step.

Payments stay a separate opt-in. A backend that takes them adds [`@smartsoft001/payments-stack`](/docs/packages/payments-stack) next to this one.

## Usage

After installing, each half is configured the way its own stack documents. The frontend registers the shared providers once in the application config:

{% snippet file="angular/src/getting-started/app-config.example.ts" region="usage" /%}

The backend configures the shared module once in the application module:

{% snippet file="node/src/getting-started/app-module.example.ts" region="usage" /%}

## API

None of its own. The package is a manifest with pinned dependencies, so what it brings is its whole interface:

| Package                                                       |
| ------------------------------------------------------------- |
| [`@smartsoft001/core`](/docs/packages/core)                   |
| [`@smartsoft001/angular-stack`](/docs/packages/angular-stack) |
| [`@smartsoft001/nestjs-stack`](/docs/packages/nestjs-stack)   |

Every version is pinned exactly, so the set installs at one version and a release never leaves the two halves of a project on different ones.

## Related packages

What the two stacks bring is listed on their own pages, [`angular-stack`](/docs/packages/angular-stack) and [`nestjs-stack`](/docs/packages/nestjs-stack). The generated screens and endpoints are documented under [CRUD](/docs/crud/overview).
