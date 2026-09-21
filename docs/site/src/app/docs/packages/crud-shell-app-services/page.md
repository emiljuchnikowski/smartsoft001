---
title: '@smartsoft001/crud-shell-app-services'
section: Packages
order: 13
package: '@smartsoft001/crud-shell-app-services'
nextjs:
  metadata:
    title: '@smartsoft001/crud-shell-app-services'
    description: 'CrudService: the application service that checks permissions, validates and trims a record, hashes passwords and delegates storage to an abstract repository.'
---

One service that sits between a transport and a repository, and applies the same four rules to every record that passes: permission, validation, trimming, hashing. {% .lead %}

---

## Install

```bash
npm install @smartsoft001/crud-shell-app-services @smartsoft001/crud-domain @smartsoft001/crud-shell-dtos @smartsoft001/domain-core @smartsoft001/models @smartsoft001/nestjs @smartsoft001/users @smartsoft001/utils
```

The manifest declares the seven workspace packages above as peer dependencies, pinned to its own version. The rest has to be installed alongside it: `@nestjs/common` for `@Injectable` and `Logger`, `rxjs` for the change feed, `guid-typescript` for id generation, `lodash-decorators` for the memoised attachment lookup, and `combined-stream` for resumable uploads.

{% callout type="note" title="It never talks to a database" %}
The service depends on the abstract `IItemRepository` and `IAttachmentRepository` from [`@smartsoft001/domain-core`](/docs/packages/domain-core), never on a driver. Nothing here opens a connection, which is why the examples on this page run against an array in memory and the specs need no database.
{% /callout %}

## What it is

The CRUD family keeps the rules in one place and the transports around it. `CrudService` is that place. A REST controller, a websocket gateway or a scheduled job all call the same methods, so a record reaches storage having passed the same checks no matter how it arrived.

Each write follows a fixed order. The permission service is asked whether the caller may perform the operation, and throws `DomainForbiddenError` if not. `castModel` then deletes every property the model does not open for that operation, so an unexpected field in a request body cannot be stored. `getInvalidFields` reports the required fields still empty after the trim, and a non-empty answer becomes a `DomainValidationError` whose message lists them. Only then is the password hashed and the record handed to the repository. Reads run the permission check and then delete `password` from whatever comes back.

The generic parameter is bounded by `IEntity<string>`, so any entity the service handles has an `id`, and the service assigns it: every insert gets a fresh GUID rather than trusting the one in the payload.

## Usage

### Construct it and create a record

{% snippet file="node/src/crud/crud-service.example.ts" region="usage" /%}

The region does three things. It declares a `Note` model whose `title` is required on create and whose `password` is declared with `confirm: true`, so the generated form renders a second control the model itself never mentions. It defines an array-backed repository implementing only the three methods these examples reach. And it builds the service by hand, passing a real `PermissionService` over a literal `SharedConfig`, the fake repository, and an empty object standing in for the attachment repository.

The spec proves the four rules on one call. The id the method returns is the id of the stored note, so the generated GUID is what the caller gets back. The repository received exactly one create. The stored `password` equals `PasswordService.hash('secret')`, not the plain text. The stored record has no `passwordConfirm` key, because that property carries no `@Field` and `castModel` removed it. And a note whose title is blank makes the call reject with `DomainValidationError('Required fields: title')`, the exact message assembled from the invalid-field list.

### Import a batch

{% snippet file="node/src/crud/create-many.example.ts" region="usage" /%}

`createMany` applies the same validation and hashing to every element, and adds the choice described by `ICreateManyOptions` from [`@smartsoft001/crud-domain`](/docs/packages/crud-domain). Its spec asserts that `'replace'` calls `clear` on the repository before `createMany`, comparing the recorded invocation order, that `'default'` never calls `clear`, and that each returned note carries a generated id.

## API

### Constructor

`new CrudService<T>(permissionService, repository, attachmentRepository)`. In an application all three arrive through the Nest injector; the module in [`@smartsoft001/crud-shell-nestjs`](/docs/packages/crud-shell-nestjs) binds them.

| Parameter              | Type                       | Provided by                                                                    |
| ---------------------- | -------------------------- | ------------------------------------------------------------------------------ |
| `permissionService`    | `PermissionService`        | [`@smartsoft001/nestjs`](/docs/packages/nestjs), configured by `SharedModule`. |
| `repository`           | `IItemRepository<T>`       | [`@smartsoft001/mongo`](/docs/packages/mongo) in a normal application.         |
| `attachmentRepository` | `IAttachmentRepository<T>` | The same package, backed by GridFS.                                            |

All three are `protected readonly`, so a subclass can reach them.

### Records

| Method                            | Returns                                      | What it does                                                                                                                                                         |
| --------------------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `create(data, user)`              | `Promise<string>`                            | Assigns a fresh GUID, checks the `create` permission, trims and validates for the `create` mode, hashes `password`, drops `passwordConfirm`, stores, returns the id. |
| `createMany(data, user, options)` | `Promise<T[]>`                               | The same per element. With `options.mode === 'replace'` it clears the collection first. Returns the input array, now carrying ids.                                   |
| `readById(id, user)`              | `Promise<T>`                                 | Checks the `read` permission, fetches by id, deletes `password` from the result.                                                                                     |
| `read(criteria, options, user)`   | `Promise<{ data: T[]; totalCount: number }>` | Checks the `read` permission and queries by criteria. Deletes `password` from every row.                                                                             |
| `readBySpec(spec, options, user)` | `Promise<{ data: T[]; totalCount: number }>` | `read` with `spec.criteria`, for callers holding an `ISpecification`.                                                                                                |
| `update(id, data, user)`          | `Promise<void>`                              | A full replace. Forces `data.id = id`, checks the `update` permission, trims and validates for the `update` mode, hashes `password`, drops `passwordConfirm`.        |
| `updatePartial(id, data, user)`   | `Promise<void>`                              | The same, except the required-field check only covers keys actually present on the payload, and a payload that is not a decorated model skips validation entirely.   |
| `delete(id, user)`                | `Promise<void>`                              | Checks the `delete` permission and removes the record.                                                                                                               |

Every method wraps its body in a try/catch that logs through a `Logger` named after the class and rethrows unchanged, so a caller sees the original error and the server log keeps the stack.

### Attachments

| Method                              | Returns                                                              | What it does                                                                                                                     |
| ----------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `uploadAttachment(data, options?)`  | `Promise<string>`                                                    | Generates an id when `data.id` is empty and uploads the stream. Returns the id the content was stored under.                     |
| `getAttachmentInfo(id)`             | `Promise<{ fileName: string; contentType: string; length: number }>` | File metadata. Decorated with `@Memoize()`, so the first answer for an id is cached on the instance for the life of the process. |
| `getAttachmentStream(id, options?)` | `Promise<Readable>`                                                  | The content, optionally a byte range, which is what backs HTTP range requests.                                                   |
| `deleteAttachment(id)`              | `Promise<void>`                                                      | Removes the stored file.                                                                                                         |

None of the four consults the permission service; access control for attachments is left to the route.

`uploadAttachment` also implements resuming an interrupted upload, and its behaviour there is worth reading closely. Given `options.start`, it fetches bytes `0` to `start - 1` of the existing attachment, prepends them to the incoming stream through `CombinedStream`, generates a new id and uploads the joined stream under it. Two details follow from the code as written: the call to the repository's `upload` is not awaited, so the promise the method returns resolves before the write finishes, and the delete that runs afterwards is passed `data.id`, which by then holds the new id rather than the partial one.

### The change feed

`changes(criteria: { id?: string }): Observable<ItemChangedData>` forwards `repository.changesByCriteria`. Passing an id narrows the feed to one record, and an empty object watches the whole collection. The emitted union is documented in [`@smartsoft001/crud-shell-dtos`](/docs/packages/crud-shell-dtos). Only a repository that implements change streams produces anything; `MongoItemRepository` does, by watching the collection.

### `SERVICES`

`SERVICES` is `[CrudService]`, the provider array a Nest module spreads into its `providers` and `exports`. `CrudShellNestjsModule` does exactly that, so an application normally registers the service by importing that module rather than by naming the class.

## Related packages

- [`@smartsoft001/crud-domain`](/docs/packages/crud-domain) defines the options object `createMany` takes.
- [`@smartsoft001/crud-shell-dtos`](/docs/packages/crud-shell-dtos) defines what the change feed emits.
- [`@smartsoft001/domain-core`](/docs/packages/domain-core) declares the two repository contracts and the two errors this service raises.
- [`@smartsoft001/models`](/docs/packages/models) provides `castModel` and `getInvalidFields`, the trimming and the validation.
- [`@smartsoft001/nestjs`](/docs/packages/nestjs) provides the permission service and the configuration it reads.
- [`@smartsoft001/crud-shell-nestjs`](/docs/packages/crud-shell-nestjs) wires this service to HTTP and websockets.
