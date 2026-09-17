---
title: '@smartsoft001/core'
section: Packages
order: 1
package: '@smartsoft001/core'
nextjs:
  metadata:
    title: '@smartsoft001/core'
    description: '@smartsoft001/core installs the packages every project uses, whatever it is built with: the model decorators, the domain contracts, the helpers and the shared DTOs.'
---

`@smartsoft001/core` installs the packages every project uses, whatever it is built with: the model decorators, the domain contracts, the helpers and the shared DTOs. {% .lead %}

---

## Install

```bash
npm install @smartsoft001/core
```

## What it is

It ships no code of its own. It exists so a project can pull the framework-agnostic half of the framework with one command and at one version, instead of naming ten packages and keeping their versions aligned by hand.

Nothing in it knows about Angular, NestJS or a database, which is what makes it the part a frontend written in something else can reuse unchanged.

## Usage

After installing, use the packages directly. A model decorated with `@Field` is the starting point of almost everything else:

{% snippet file="node/src/models/model-validation.example.ts" region="usage" /%}

## API

None of its own. The package is a manifest with pinned dependencies, so what it brings is its whole interface:

| Package                                                                           |
| --------------------------------------------------------------------------------- |
| [`@smartsoft001/models`](/docs/packages/models)                                   |
| [`@smartsoft001/domain-core`](/docs/packages/domain-core)                         |
| [`@smartsoft001/utils`](/docs/packages/utils)                                     |
| [`@smartsoft001/users`](/docs/packages/users)                                     |
| [`@smartsoft001/auth-domain`](/docs/packages/auth-domain)                         |
| [`@smartsoft001/crud-domain`](/docs/packages/crud-domain)                         |
| [`@smartsoft001/crud-shell-dtos`](/docs/packages/crud-shell-dtos)                 |
| [`@smartsoft001/auth-shell-dtos`](/docs/packages/auth-shell-dtos)                 |
| [`@smartsoft001/crud-shell-app-services`](/docs/packages/crud-shell-app-services) |
| [`@smartsoft001/auth-shell-app-services`](/docs/packages/auth-shell-app-services) |

Every version is pinned exactly, so the set installs at one version and a release never leaves two of these packages on different ones.

## Migrations

This package also carries the framework's migrations, because every stack depends on it and therefore every project has it. `npx nx migrate @smartsoft001/core@latest` fetches a release and writes down what it wants to change; `npx nx migrate --run-migrations` performs it. [Upgrading](/docs/upgrading) describes what the migrations can do and what is left to check by hand.

## Related packages

Every stack depends on this package, so installing [`angular-stack`](/docs/packages/angular-stack) or [`nestjs-stack`](/docs/packages/nestjs-stack) brings it too.
