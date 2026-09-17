---
title: '@smartsoft001/crud-domain'
section: Packages
order: 11
package: '@smartsoft001/crud-domain'
nextjs:
  metadata:
    title: '@smartsoft001/crud-domain'
    description: 'The two types that describe how a bulk insert behaves: ICreateManyOptions and the CreateManyMode it carries.'
---

Two types, and nothing else: the options object a bulk insert takes and the mode it carries. {% .lead %}

---

## Install

```bash
npm install @smartsoft001/crud-domain
```

The manifest declares no dependencies, and the package imports nothing. Both exports are types, so the compiled JavaScript is empty and nothing of this package survives into a bundle. It still has to be installed next to [`@smartsoft001/crud-shell-app-services`](/docs/packages/crud-shell-app-services), whose declarations name `ICreateManyOptions` in the signature of `createMany`: without it, type-checking a call to that method fails even though running it does not.

## What it is

The CRUD family is split so that the rule lives apart from the machinery that applies it. This package is the domain half, reduced to its smallest possible form. It says that a bulk insert is parameterised by a mode, and that the mode is one of two words. Everything else about bulk inserts lives elsewhere: the application service in [`@smartsoft001/crud-shell-app-services`](/docs/packages/crud-shell-app-services) acts on the mode, and the `POST /bulk` route in [`@smartsoft001/crud-shell-nestjs`](/docs/packages/crud-shell-nestjs) reads it off the query string.

The two modes differ in what happens to the records already stored. `'default'` appends the batch. `'replace'` empties the collection first, which is what turns a bulk insert into an import that defines the whole content of the collection rather than adding to it.

The Angular shell does not use these types. [`@smartsoft001/crud-shell-angular`](/docs/packages/crud-shell-angular) declares its own `ICrudCreateManyOptions` and `CrudCreateManyMode`, structurally identical but separately defined, so the browser bundle never resolves a backend package.

## Usage

The option type has no behaviour of its own, so it is documented where it takes effect: as the third argument of `CrudService.createMany`.

{% snippet file="node/src/crud/create-many.example.ts" region="usage" /%}

The region takes the mode as a parameter, wraps it in an `ICreateManyOptions` and hands it to the service. That is the whole contribution of this package to the call; validation, password hashing and id generation happen inside the service regardless of the mode.

Its spec runs the exported function against an array-backed repository and asserts the difference between the two modes. Under `'replace'` it compares the recorded invocation order of `clear` and `createMany` on the repository and requires the clear to come first. Under `'default'` it asserts `clear` was never called at all. A third case checks that every returned note carries a generated id, which holds in both modes.

## API

| Export               | Kind      | Description                                                                                                             |
| -------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------- |
| `ICreateManyOptions` | Interface | One required property, `mode: CreateManyMode`. The third argument of `CrudService.createMany`.                          |
| `CreateManyMode`     | Type      | `'default' \| 'replace'`. `'default'` appends the batch to the collection, `'replace'` clears the collection before it. |

The service treats the options argument defensively: the clear only runs for `options && options.mode === 'replace'`, so a missing options object behaves like the default mode rather than throwing. The `POST /bulk` route passes `{ mode }` built from the `mode` query parameter, which means an absent parameter arrives as `{ mode: undefined }` and also appends.

## Related packages

- [`@smartsoft001/crud-shell-app-services`](/docs/packages/crud-shell-app-services) is where `ICreateManyOptions` is consumed, by `CrudService.createMany`.
- [`@smartsoft001/crud-shell-nestjs`](/docs/packages/crud-shell-nestjs) exposes that method as `POST /bulk` and fills the mode from the query string.
- [`@smartsoft001/crud-shell-angular`](/docs/packages/crud-shell-angular) offers the same choice to the browser through its own copy of the two types.
- The [CRUD overview](/docs/crud/overview) shows where a bulk insert sits in the generated screens.
