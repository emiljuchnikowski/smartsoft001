---
title: '@smartsoft001/models'
section: Packages
order: 5
package: '@smartsoft001/models'
nextjs:
  metadata:
    title: '@smartsoft001/models'
    description: 'Decorators that record what an entity looks like, and the readers that let generic code build forms, lists and payloads from that description.'
---

Describes an entity once with decorators, and exposes readers so generic code can validate it, render it and trim it down per operation. {% .lead %}

---

## Install

```bash
npm install @smartsoft001/models
```

The manifest declares both runtime companions, so installing this package brings them along. The decorators call `Reflect.defineMetadata`, which comes from `reflect-metadata`, and the field decorator calls `ObjectService.createByType` from [`@smartsoft001/utils`](/docs/packages/utils) whenever a field declares a `classType`.

{% callout type="note" title="Angular appears in the type declarations" %}
The interface file imports `Signal` from `@angular/core` for one optional property, `IModelFilter.possibilities`. The import is type-only and disappears from the compiled JavaScript, but it stays in the shipped `.d.ts`, so a project that type-checks against these declarations still has to resolve the Angular types. The manifest declares `@angular/core` as an optional peer dependency for exactly that reason. A NestJS service that never installs Angular keeps working, because nothing in the compiled JavaScript reaches for it.
{% /callout %}

## What it is

The package is the description layer the rest of the framework reads. `@Model` marks a class as a framework model and `@Field` records, per property, what kind of value it holds and how each operation may touch it. None of that lands in the class body. Both decorators write into `reflect-metadata`, keyed by the `SYMBOL_MODEL` and `SYMBOL_FIELD` symbols, which keeps the entity a plain class that a domain layer can construct without pulling in a framework.

The reader functions are what make the metadata useful. `getModelFieldKeys` returns the decorated property names of a type in declaration order, and that order is what the generated form and the generated list columns follow. `getModelFieldOptions` and `getModelFieldsWithOptions` hand back the options recorded for one field or for all of them, which is how a component decides which editor to build. `isModel` reports whether a value belongs to a decorated class at all, which is how generic code tells a model apart from a plain object before it tries to read either of the other two.

Two functions go further than reading. `getInvalidFields` returns the required fields that are still empty for a given operation, and `castModel` deletes everything that must not take part in that operation. Together they are the validation and the payload trimming the CRUD service in [`@smartsoft001/crud-shell-app-services`](/docs/packages/crud-shell-app-services) applies to every incoming record: it casts the data for the operation, then rejects the request with a `DomainValidationError` naming the required fields that are still empty. The decorators also change how an instance serialises: `@Model` installs a `toJSON` on the prototype, which matters because a field declared with a `classType` is stored behind an underscore-prefixed backing property, and `toJSON` puts it back under its real name.

## Usage

An entity is an ordinary class with decorators on the properties that the framework should know about.

{% snippet file="node/src/getting-started/user.model.example.ts" region="usage" /%}

`@Model({ titleKey: 'email' })` names the field that stands in for the record in titles and lists. On each property, `type` picks the editor and the validation, and `required: true` marks the field mandatory. `@Field` is never silent about the type: a decorator called without one falls back to `FieldType.text`, except on a property literally named `password`, which falls back to `FieldType.password`.

Validation and payload trimming read the same metadata, and both are sensitive to the per-mode blocks.

{% snippet file="node/src/models/model-validation.example.ts" region="usage" /%}

The spec that runs this example proves four things. An empty `name` comes back from `getInvalidFields(product, 'create', [])` as the one missing field, and a filled product yields an empty array; empty here means `null`, `undefined` or the empty string, not a falsy number. `toCreatePayload` keeps `id` and the two fields that carry a `create` block, and drops `internalNote`, which has none. And because the example copies the product before casting, the original still holds its internal note afterwards: `castModel` mutates the object it is given rather than returning a new one.

The comment in the example is the trap worth repeating. A mode block replaces the top-level `required` flag instead of inheriting it, and a bare `create: true` is a block like any other. Writing `@Field({ required: true, create: true })` therefore marks the field editable on create and not required on create. To keep it mandatory, the flag has to be inside the block, as `create: { required: true }`.

## API

### Decorators

| Export                    | Kind      | Description                                                                                                                                                                                                                                                                                                                               |
| ------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Model`, `ModelDecorator` | Decorator | Class decorator. Stores `IModelOptions` under `SYMBOL_MODEL` and installs a `toJSON` that resolves the backing properties of `classType` fields. `Model` is an alias of `ModelDecorator`.                                                                                                                                                 |
| `Field`, `FieldDecorator` | Decorator | Property decorator. Stores `IFieldOptions` under `SYMBOL_FIELD`, registers the key on the type, defaults the type to `text` or, on a `password` property, to `password`. With a `classType` it replaces the property by an accessor pair that rehydrates assigned values into that class, mapping over the elements for an `array` field. |

### Metadata readers

| Export                                          | Kind     | Description                                                                                                                                                                                                                                                                                                                                                          |
| ----------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getModelFieldKeys(type)`                       | Function | Decorated property names of a type, in declaration order. Takes the constructor, not an instance, and answers with an empty array for an undecorated type.                                                                                                                                                                                                           |
| `getModelFieldOptions(instance, fieldKey)`      | Function | The `IFieldOptions` recorded for one property of an instance.                                                                                                                                                                                                                                                                                                        |
| `getModelFieldsWithOptions(instance)`           | Function | Every decorated property of an instance as `{ key, options }`, in the same order.                                                                                                                                                                                                                                                                                    |
| `getModelOptions(type)`                         | Function | The `IModelOptions` passed to `@Model` on that type.                                                                                                                                                                                                                                                                                                                 |
| `isModel(instance)`                             | Function | Whether the value's constructor carries the model metadata. Answers `false` for `null` and `undefined`.                                                                                                                                                                                                                                                              |
| `getInvalidFields(instance, mode, permissions)` | Function | Keys of the fields required in that mode whose value is `null`, `undefined` or `''`. A mode block overrides the top-level `required` flag, and a block with its own `permissions` only counts as required when the caller holds one of them.                                                                                                                         |
| `castModel(instance, mode, permissions)`        | Function | Strips the instance in place. Keeps `id` and every field whose mode block is present and permitted, deletes fields without a block and properties that carry no `@Field` at all. For a mode other than `create` or `update`, a field survives only through a matching entry in its `customs` list. Returns nothing, and does nothing to a value that is not a model. |

### Types and tokens

| Export                         | Kind      | Description                                                                                                                                    |
| ------------------------------ | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `FieldType`, `FieldTypeDef`    | Enum      | The 31 field types. `FieldType` is an alias of the `FieldTypeDef` enum, and is the name to use in application code.                            |
| `IModelOptions`                | Interface | Options of `@Model`: `titleKey`, `filters`, the `create`, `update`, `list`, `details` and `remove` mode blocks, `customs`, `export`, `import`. |
| `IFieldOptions`                | Interface | Options of `@Field`: the field metadata plus the `create`, `update`, `list` and `details` blocks, `customs`, `search` and `info`.              |
| `IFieldMetadata`               | Interface | The shape a field carries everywhere: `type`, `classType`, `possibilities`, and everything on `IFieldModifyMetadata`.                          |
| `IFieldModifyMetadata`         | Interface | Per-mode write options: `required`, `focused`, `confirm`, `permissions`, `unique`, `defaltValue`, `enabled`, `hide`, `step`.                   |
| `IFieldEditMetadata`           | Interface | The update block, which adds `multi` to the write options.                                                                                     |
| `IFieldListMetadata`           | Interface | The list block: `order`, `filter`, `permissions` and a `dynamic` column descriptor.                                                            |
| `IFieldDetailsMetadata`        | Interface | The details block: `order`, `permissions`, `enabled`.                                                                                          |
| `IModelModeOptions`            | Interface | A model-level mode block: `permissions` and an `enabled` specification.                                                                        |
| `IModelModeOptionsCustom`      | Interface | A model-level mode block for a custom mode, named by its `mode`.                                                                               |
| `IModelMetadata`               | Interface | `titleKey`, `permissions` and `filters`, the base the custom model metadata extends.                                                           |
| `IModelMetadataCustom`         | Interface | Model metadata for a custom mode, named by its `mode`.                                                                                         |
| `IFieldCustomMetadata`         | Interface | Field metadata for a custom mode: the write and list options plus the `mode` name.                                                             |
| `IFieldUniqueMetadata`         | Interface | Uniqueness scope, `withFields`, for a field marked `unique`.                                                                                   |
| `IModelFilter`                 | Interface | A filter offered on a list: `key`, comparison `type`, optional `label`, `fieldType` and a signal of possibilities.                             |
| `IModelStep`                   | Interface | A step of a multi-step form: `number` and `name`.                                                                                              |
| `ISpecification`               | Interface | The `criteria` contract, re-exported by [`@smartsoft001/domain-core`](/docs/packages/domain-core).                                             |
| `SYMBOL_MODEL`, `SYMBOL_FIELD` | Symbol    | The `reflect-metadata` keys the decorators write to, for code that needs to read the metadata directly.                                        |

The field types group by what they produce. Text and numbers: `text`, `longText`, `strings`, `int`, `ints`, `float`, `currency`. Dates: `date`, `dateTime`, `dateWithEdit`, `dateRange`. Choices and flags: `enum`, `radio`, `check`, `flag`, `color`. Contact and identity: `email`, `password`, `phoneNumber`, `phoneNumberPl`, `nip`, `pesel`, `address`. Files and media: `file`, `pdf`, `image`, `logo`, `video`, `attachment`. Structure: `object`, `array`.

## Related packages

- [`@smartsoft001/utils`](/docs/packages/utils) supplies the object service the field decorator calls when a field declares a `classType`.
- [`@smartsoft001/domain-core`](/docs/packages/domain-core) defines `IEntity`, which the decorated entities implement, and re-exports `ISpecification` from here.
- [`@smartsoft001/crud-shell-angular`](/docs/packages/crud-shell-angular) reads the field metadata to build the list and item screens.
- [`@smartsoft001/crud-shell-app-services`](/docs/packages/crud-shell-app-services) casts and validates every record with these functions before it reaches a repository.
