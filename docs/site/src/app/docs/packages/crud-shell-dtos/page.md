---
title: '@smartsoft001/crud-shell-dtos'
section: Packages
order: 12
package: '@smartsoft001/crud-shell-dtos'
nextjs:
  metadata:
    title: '@smartsoft001/crud-shell-dtos'
    description: 'The wire types of the CRUD change feed and UserDto, the decorated credentials model the framework renders as a form.'
---

The shapes that cross the wire: one decorated credentials model, and the three payloads the change feed emits. {% .lead %}

---

## Install

```bash
npm install @smartsoft001/crud-shell-dtos @smartsoft001/models reflect-metadata
```

The manifest depends on [`@smartsoft001/models`](/docs/packages/models), so installing this package brings it along. `UserDto` carries `@Model` and `@Field` from it, and those decorators write into `reflect-metadata`, which still has to be installed next to it. The change-feed interfaces are types and cost nothing at runtime.

## What it is

Two unrelated things share the package because both are the vocabulary the CRUD shells agree on.

`UserDto` is the credentials model. It is not a validation schema in the class-validator sense and there is no `ValidationPipe` involved anywhere in this family. It is an ordinary class whose two properties carry `@Field({ required: true })`, which means the framework can do three things with it: render a form from it, report which required fields are still empty, and strip it down to the fields a given operation may touch. `username` also carries `focused: true`, which tells the generated form which control takes the cursor.

The change-feed types describe what `CrudService.changes(...)` emits. A repository that supports change streams, `MongoItemRepository` in [`@smartsoft001/mongo`](/docs/packages/mongo), turns each database change into one of these objects, and the websocket gateway in [`@smartsoft001/crud-shell-nestjs`](/docs/packages/crud-shell-nestjs) forwards them to subscribed clients under the `changes` event. They form a discriminated union on `type`, so a consumer narrows the payload by switching on that one field rather than probing for properties.

## Usage

{% snippet file="node/src/crud/user-dto.example.ts" region="usage" /%}

The region holds the two things the package is for. `missingCredentials` runs `getInvalidFields` over a `UserDto` for the `create` mode, which is the same check `CrudService` performs before it hands a record to a repository, reused on the caller's side so a client can refuse to send an incomplete form. `toChangeMessage` switches on `change.type` and builds a log line, which is what makes the union worth having: only the `'update'` branch may read `removedFields` and `updatedFields`, and the compiler enforces that.

Its spec covers both halves. An empty `UserDto` reports `['username', 'password']` as missing, in declaration order, and reports nothing once both are filled. Three further cases feed one change of each type through `toChangeMessage` and check the sentence it produces; the update case passes two updated fields and one removed field and asserts the counts come back as `2 changed, 1 removed`, which proves the narrowing reached the right branch.

## API

### `UserDto`

A `@Model({})` class with two properties, both `string`.

| Field      | Decorator                                   | What it means                                                                                                         |
| ---------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `username` | `@Field({ required: true, focused: true })` | Mandatory in every mode. `focused` marks it as the control the generated form focuses first.                          |
| `password` | `@Field({ required: true })`                | Mandatory in every mode. A property named `password` defaults to `FieldType.password`, so no explicit type is needed. |

`CrudService` treats a `password` property specially wherever it appears: it hashes the value on write and deletes it from every record it reads back.

### The change feed

| Export                | Kind      | Description                                                                                                                                |
| --------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `IItemCreateData`     | Interface | `{ id: string; type: 'create'; data: any }`. `data` is the inserted record.                                                                |
| `IItemUpdateData`     | Interface | `{ id: string; type: 'update'; data: { removedFields: string[]; updatedFields: { [key: string]: any } } }`. A delta, not the whole record. |
| `IItemDeleteData`     | Interface | `{ id: string; type: 'delete' }`. No payload beyond the id.                                                                                |
| `ItemChangedData`     | Type      | The union of the three, discriminated by `type`. This is what `CrudService.changes(...)` emits.                                            |
| `ItemChangedDataType` | Type      | `'create' \| 'update' \| 'delete'`, the discriminant on its own.                                                                           |

## The sibling DTO packages

Each family ships its own model package with the same construction: a plain class, `@Model` on the class, `@Field` on the properties, and no dependency beyond the decorators.

- [`@smartsoft001/auth-shell-dtos`](/docs/packages/auth-shell-dtos) exports `LoginDto`, field for field identical to `UserDto`.
- [`@smartsoft001/trans-shell-dtos-services`](/docs/packages/trans-shell-dtos-services) exports `TransCreateDto`, the payment payload, with the same decorators over a larger set of fields and explicit `FieldType` values.

Whatever you learn here about reading, validating and trimming `UserDto` applies unchanged to both.

## Related packages

- [`@smartsoft001/models`](/docs/packages/models) supplies the decorators and the reader functions the example calls.
- [`@smartsoft001/crud-shell-app-services`](/docs/packages/crud-shell-app-services) produces the change feed and runs the same required-field check before every write.
- [`@smartsoft001/crud-shell-nestjs`](/docs/packages/crud-shell-nestjs) pushes the feed to clients over its websocket gateway.
- [`@smartsoft001/mongo`](/docs/packages/mongo) is the repository that turns database change streams into these payloads.
