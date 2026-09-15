---
title: '@smartsoft001/domain-core'
section: Packages
order: 2
package: '@smartsoft001/domain-core'
nextjs:
  metadata:
    title: '@smartsoft001/domain-core'
    description: 'Storage-agnostic domain contracts: abstract repositories and unit of work, composable specifications, and the two domain errors the HTTP layer maps to status codes.'
---

Holds the contracts a domain layer is written against: repositories, a unit of work, composable query specifications and two domain errors. {% .lead %}

---

## Install

```bash
npm install @smartsoft001/domain-core
```

The manifest pulls in `rxjs`, [`@smartsoft001/models`](/docs/packages/models) and [`@smartsoft001/users`](/docs/packages/users) for you. The package contains contracts only, so an application also needs an implementation of them; [`@smartsoft001/mongo`](/docs/packages/mongo) is the one shipped here.

## What it is

This is the layer that lets a domain be written without naming a database. The three repository contracts, `IItemRepository`, `IAttachmentRepository` and `IUnitOfWork`, are declared as abstract classes rather than interfaces. That is deliberate rather than stylistic: an interface vanishes at compile time, while an abstract class survives as a value, so NestJS can use it directly as an injection token. A service declares a dependency on `IItemRepository` and the module decides at wiring time that the Mongo implementation satisfies it.

Queries travel as specifications. A specification is an object with one readonly `criteria` property, and the three composing classes build nested criteria out of simpler ones: `MergeSpecification` shallow-merges them into a single object, `OrSpecification` wraps them in `$or` and `AndSpecification` in `$and`. Business rules stay expressible as values that can be named, reused and passed around, instead of being spelled out as query fragments at every call site.

The two errors close the loop back to the transport. `DomainValidationError` and `DomainForbiddenError` each carry a `type` property that points at their own constructor, and the exception filter in [`@smartsoft001/nestjs`](/docs/packages/nestjs) branches on that property, answering 400 for the first and 403 for the second with the error message under a `details` key. A domain function throws in domain vocabulary and the HTTP status follows, without the domain importing anything from the web layer.

## Usage

Specifications compose, and composing them produces a plain object.

{% snippet file="node/src/domain-core/specifications.example.ts" region="usage" /%}

The spec asserts the exact shape that reaches a repository: an `$and` array holding the basic criteria and a nested `$or` array of the two role criteria. It also asserts that the composed specification exposes that same object as its own `criteria`, which is what a repository reads. Because the classes only ever build objects, composing them needs no database and no module.

{% callout type="note" title="Composed criteria are for repositories, not for in-memory checks" %}
The criteria shape follows MongoDB's query operators, and the Mongo repositories hand it to the driver unchanged. `SpecificationService` in [`@smartsoft001/utils`](/docs/packages/utils) evaluates a specification in memory by comparing each criteria key against the matching property, so it handles a flat `BasicSpecification` but does not interpret `$and` or `$or`.
{% /callout %}

Domain errors are thrown by ordinary domain functions.

{% snippet file="node/src/domain-core/domain-errors.example.ts" region="usage" /%}

The spec proves both the instance check and the tag. A non-positive amount throws something that is `instanceof DomainValidationError` and whose `type` is the `DomainValidationError` constructor itself, which is the property the filter compares. A user whose `username` does not match the owner gets a `DomainForbiddenError` carrying the matching tag, and the owner passes through with nothing thrown.

## API

### Repository contracts

| Export                     | Kind           | Description                                                                                                                                                                                                                                                                                                                              |
| -------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `IItemRepository<T>`       | Abstract class | Entity storage for a `T extends IEntity<string>`, and an injection token. Fourteen abstract methods, listed below.                                                                                                                                                                                                                       |
| `IAttachmentRepository<T>` | Abstract class | File storage, and an injection token. `upload(data, options?)` takes an id, file name, stream, MIME type and encoding, with an optional `streamCallback`. `getInfo(id)` answers the file name, content type and length. `getStream(id, options?)` answers a readable stream, optionally for a byte range. `delete(id)` removes the file. |
| `IUnitOfWork`              | Abstract class | Transaction boundary, and an injection token. `scope(definition)` runs the callback with an `ITransaction`, which the repositories then accept through `options.transaction`.                                                                                                                                                            |

The methods of `IItemRepository` divide into writes, reads and a stream. Writes: `create`, `createMany`, `update`, `updatePartial`, `updatePartialManyByCriteria`, `updatePartialManyBySpecification`, `delete` and `clear`. Each write takes the acting `IUser` and an optional `IItemRepositoryOptions` carrying the transaction. Reads: `getById`, `getByCriteria` and `getBySpecification`, the last two answering `{ data, totalCount }`, plus `countByCriteria` and `countBySpecification`. And `changesByCriteria` returns an `Observable` that emits as matching records change, which is what the websocket gateways subscribe to.

### Specifications

| Export                         | Kind  | Description                                                                                                                                       |
| ------------------------------ | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BasicSpecification`           | Class | Wraps one criteria object, exposed as a readonly `criteria`. The base of the other three.                                                         |
| `MergeSpecification(...specs)` | Class | Shallow-merges the criteria of every specification into one object, so a repeated key takes the value of the last specification that declares it. |
| `OrSpecification(...specs)`    | Class | Criteria of `{ $or: [...] }` over the criteria of its arguments.                                                                                  |
| `AndSpecification(...specs)`   | Class | Criteria of `{ $and: [...] }` over the criteria of its arguments.                                                                                 |

### Errors

| Export                       | Kind  | Description                                                                                                   |
| ---------------------------- | ----- | ------------------------------------------------------------------------------------------------------------- |
| `DomainValidationError(msg)` | Class | An `Error` for input a rule rejects. Its `type` is the constructor, which the NestJS filter maps to HTTP 400. |
| `DomainForbiddenError(msg)`  | Class | An `Error` for an action a user may not perform. Its `type` maps to HTTP 403.                                 |

### Interfaces

| Export                   | Kind      | Description                                                                                                   |
| ------------------------ | --------- | ------------------------------------------------------------------------------------------------------------- |
| `IEntity<T>`             | Interface | One property, `id: T`. Every stored entity implements it, and its parameter fixes the type of the identifier. |
| `IAddress`               | Interface | Polish postal address: `city`, `street`, `buildingNumber`, optional `flatNumber`, `zipCode`.                  |
| `IDateRange`             | Interface | A `start` and `end` pair, typed as `YYYY-MM-DD` template strings.                                             |
| `IFactory<T, TConfig>`   | Interface | One method, `create(config)`, returning a promise of `T`.                                                     |
| `ITransaction`           | Interface | The transaction context handed to a `scope` callback. Carries the driver-specific `connection`.               |
| `IItemRepositoryOptions` | Interface | The options object every write accepts, holding the `transaction` to enlist in.                               |
| `ISpecification`         | Interface | The readonly `criteria` contract, re-exported from [`@smartsoft001/models`](/docs/packages/models).           |

## Related packages

- [`@smartsoft001/mongo`](/docs/packages/mongo) implements all three repository contracts against MongoDB and binds them to these tokens.
- [`@smartsoft001/utils`](/docs/packages/utils) evaluates a flat specification in memory and converts one to SQL.
- [`@smartsoft001/nestjs`](/docs/packages/nestjs) maps the two domain errors to HTTP status codes.
- [`@smartsoft001/models`](/docs/packages/models) decorates the entities that implement `IEntity`.
- [`@smartsoft001/users`](/docs/packages/users) defines the `IUser` every repository write takes.
