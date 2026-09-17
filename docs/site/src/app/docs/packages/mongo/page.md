---
title: '@smartsoft001/mongo'
section: Packages
order: 9
package: '@smartsoft001/mongo'
nextjs:
  metadata:
    title: '@smartsoft001/mongo'
    description: 'MongoDB implementations of the domain-core repository contracts, registered as a NestJS dynamic module with MongoModule.forRoot.'
---

The MongoDB side of the storage contracts: one module import binds the abstract repositories from the domain layer to implementations backed by the MongoDB driver. {% .lead %}

---

## Install

```bash
npm install @smartsoft001/mongo
```

## What it is

[@smartsoft001/domain-core](/docs/packages/domain-core) defines storage as three abstract classes and says nothing about where the data lives. This package supplies the MongoDB answer to all three, and `MongoModule.forRoot` registers them under the abstract classes themselves, which NestJS uses as injection tokens. Application code therefore injects `IItemRepository` and never names a MongoDB type, which is what keeps the domain layer free of the driver.

Connections are opened per operation rather than held open by the module. `forRoot` only builds a provider list, and each repository method calls `MongoClient.connect` when it runs and closes the client when it finishes. Nothing reaches the network while the application is starting, so a module that imports this one can be compiled and inspected without a database anywhere in sight.

The repository also maintains a little bookkeeping of its own. It moves `id` to MongoDB's `_id` on the way in and back again on the way out, and it records the acting user and a timestamp under a hidden `__info` field on every create and update, which is stripped from anything it returns.

## Usage

{% snippet file="node/src/mongo/mongo-module.example.ts" region="usage" /%}

One call configures storage for a feature: the database to talk to and the collection the item repository reads and writes.

The spec behind this example compiles `DataModule` with Nest's testing utilities, resolves the `IItemRepository` token and asserts that what comes back is a `MongoItemRepository`, then reads `MongoConfig` back out and checks the database name it was given. It runs in an ordinary unit test with no MongoDB running and no driver mock, which is the lazy connection described above shown rather than claimed. The same test would fail immediately if `forRoot` ever connected eagerly.

## API

### `MongoModule.forRoot(config)`

`forRoot(config: MongoConfig): DynamicModule`. Returns a dynamic module that both provides and exports four bindings, so importing it is enough to inject any of them in the importing module.

| Token                   | Bound to                    | Kind                                   |
| ----------------------- | --------------------------- | -------------------------------------- |
| `MongoConfig`           | the object you passed in    | `useValue`, so it is the same instance |
| `IItemRepository`       | `MongoItemRepository`       | `useClass`                             |
| `IAttachmentRepository` | `MongoAttachmentRepository` | `useClass`                             |
| `IUnitOfWork`           | `MongoUnitOfWork`           | `useClass`                             |

There is no `forFeature`. A second database or a second collection means a second `forRoot` in the module that needs it.

### `MongoConfig`

A plain class used as both the shape of the argument and the injection token.

| Field        | Type     | Required | What it does                                                                                                                                                               |
| ------------ | -------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `database`   | `string` | yes      | The database name, passed to `client.db()` and also sent as the `authSource` of the connection string.                                                                     |
| `host`       | `string` | no       | The server host. A host ending in `ondigitalocean.com` switches the connection to `mongodb+srv` with TLS.                                                                  |
| `port`       | `number` | no       | The server port.                                                                                                                                                           |
| `username`   | `string` | no       | Supplied together with `password`, adds credentials to the connection string.                                                                                              |
| `password`   | `string` | no       | The password for `username`.                                                                                                                                               |
| `collection` | `string` | no       | The collection the item repository operates on, and the GridFS bucket name the attachment repository uses.                                                                 |
| `type`       | `any`    | no       | The model class of the stored entity. Its `@Field` metadata is read to expand a `$search` criterion into a case-insensitive regex query over the fields marked searchable. |
| `url`        | `string` | no       | Declared on the class but not read by this package today: the connection string is always built from `host`, `port`, the credentials and `database`.                       |

### `MongoItemRepository<T extends IEntity<string>>`

Extends `IItemRepository<T>` and takes a `MongoConfig` in its constructor. Inject it through the `IItemRepository` token rather than by name. It implements the full contract, which is documented in [@smartsoft001/domain-core](/docs/packages/domain-core); the table below says what each method does against MongoDB.

| Method                                                        | Returns                                      | What it does                                                                 |
| ------------------------------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------- |
| `create(item, user, options?)`                                | `Promise<void>`                              | Inserts one document, stamping the acting user and the date.                 |
| `createMany(list, user, options?)`                            | `Promise<void>`                              | Inserts many documents in one call.                                          |
| `update(item, user, options?)`                                | `Promise<void>`                              | Replaces the whole document, keeping the creation record.                    |
| `updatePartial(item, user, options?)`                         | `Promise<void>`                              | Sets only the fields present on `item`.                                      |
| `updatePartialManyByCriteria(criteria, set, user, options?)`  | `Promise<void>`                              | Applies one partial update to every document matching a raw criteria object. |
| `updatePartialManyBySpecification(spec, set, user, options?)` | `Promise<void>`                              | The same, driven by a specification instead of a raw object.                 |
| `delete(id, user, options?)`                                  | `Promise<void>`                              | Removes one document by its identifier.                                      |
| `clear(user, options?)`                                       | `Promise<void>`                              | Empties the collection.                                                      |
| `getById(id, options?)`                                       | `Promise<T>`                                 | Reads one document, with `_id` mapped back to `id`.                          |
| `getByCriteria(criteria, options?)`                           | `Promise<{ data: T[]; totalCount: number }>` | Reads a filtered page together with the total number of matches.             |
| `getBySpecification(spec, options?)`                          | `Promise<{ data: T[]; totalCount: number }>` | The same, from a specification.                                              |
| `countByCriteria(criteria)`                                   | `Promise<number>`                            | Counts matches without loading them.                                         |
| `countBySpecification(spec)`                                  | `Promise<number>`                            | The same, from a specification.                                              |
| `changesByCriteria(criteria)`                                 | `Observable<ItemChangedData>`                | Watches a MongoDB change stream and emits create, update and delete events.  |

Every write takes the acting `IUser` from [@smartsoft001/users](/docs/packages/users), and the optional last argument carries a transaction opened by the unit of work.

### Reachable through injection, not through the package index

`MongoAttachmentRepository`, `MongoUnitOfWork`, the `IMongoTransaction` interface and the `getMongoUrl` helper are part of the working surface but are not re-exported from the package entry point, so they cannot be imported by name from `@smartsoft001/mongo`. Use them through the tokens `forRoot` registers.

| Not exported                | Reach it as                            | What it is                                                                                           |
| --------------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `MongoAttachmentRepository` | inject `IAttachmentRepository`         | File storage on GridFS: `upload`, `getInfo`, `getStream` and `delete`, bucket named by `collection`. |
| `MongoUnitOfWork`           | inject `IUnitOfWork`                   | `scope(definition)` runs the callback inside a MongoDB transaction, committing or aborting it.       |
| `IMongoTransaction`         | the value handed to a `scope` callback | An `ITransaction` carrying the driver's `session`, which the repositories pass to every operation.   |
| `getMongoUrl(config)`       | not reachable                          | Builds the connection string the repositories connect with.                                          |

## Related packages

- [@smartsoft001/domain-core](/docs/packages/domain-core) owns the contracts this package implements and the specifications its queries accept.
- [@smartsoft001/models](/docs/packages/models) supplies the field metadata that drives search and casting.
- [@smartsoft001/users](/docs/packages/users) is the identity recorded on every write.
- [@smartsoft001/nestjs](/docs/packages/nestjs) configures the same database through `SharedModule.forRoot`.
