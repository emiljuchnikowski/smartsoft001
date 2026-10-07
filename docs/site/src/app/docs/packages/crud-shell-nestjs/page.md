---
title: '@smartsoft001/crud-shell-nestjs'
section: Packages
order: 14
package: '@smartsoft001/crud-shell-nestjs'
nextjs:
  metadata:
    title: '@smartsoft001/crud-shell-nestjs'
    description: 'The NestJS shell around CrudService: one dynamic module, a ten-route REST controller with attachments, two JWT guards and a websocket gateway for the change feed.'
---

Turns `CrudService` into an endpoint: one module call gives a collection its REST routes, its JWT guards and, optionally, a websocket feed of its changes. {% .lead %}

---

## Install

```bash
npm install @smartsoft001/crud-shell-nestjs @smartsoft001/crud-domain @smartsoft001/crud-shell-app-services @smartsoft001/crud-shell-dtos @smartsoft001/domain-core @smartsoft001/mongo @smartsoft001/nestjs @smartsoft001/users @smartsoft001/utils
```

The manifest declares all eight workspace packages above as peer dependencies, pinned to its own version, so a package manager warns when one of them is missing rather than letting the failure appear at import time. Alongside `crud-shell-app-services`, `crud-shell-dtos` and `domain-core` that covers [`@smartsoft001/mongo`](/docs/packages/mongo), [`@smartsoft001/nestjs`](/docs/packages/nestjs), [`@smartsoft001/users`](/docs/packages/users), [`@smartsoft001/utils`](/docs/packages/utils) and [`@smartsoft001/crud-domain`](/docs/packages/crud-domain), which the controller names in the signature of its create route.

On top of the workspace packages the controller and the gateway need `@nestjs/common`, `@nestjs/jwt`, `@nestjs/passport`, `@nestjs/websockets` with `socket.io`, `express`, `busboy` for multipart uploads, `json2csv` and `xlsx` for the two export formats, plus `lodash` and `moment-timezone`.

## What it is

Everything a collection needs over HTTP is identical from one collection to the next, so this package writes it once and parameterises it. `CrudShellNestjsModule.forRoot` returns a dynamic module carrying the CRUD service, the Mongo repositories behind it, the guards and, depending on two flags, the controller and the gateway. An application imports it once per collection, under a route prefix of its choosing, and gets ten routes it did not write.

The controller is deliberately thin. It parses, it shapes the response, and it delegates; the rules stay in [`@smartsoft001/crud-shell-app-services`](/docs/packages/crud-shell-app-services). What it does add is the parts that only make sense at the edge: query parsing for the list route, CSV and XLSX rendering, `Location` headers, HTTP range support for attachment downloads and a multipart parser for uploads.

Nothing connects eagerly. `MongoModule.forRoot` registers providers whose client opens on first use, so the module compiles in a test without a database. What is constructed eagerly is the JWT strategy behind the guards, which needs a non-empty signing key.

## Usage

### Register a collection

{% snippet file="node/src/crud/crud-module.example.ts" region="usage" /%}

The region imports the dynamic module into a feature module. The options object is the shared configuration from [`@smartsoft001/nestjs`](/docs/packages/nestjs), which is the signing key and the roles allowed per operation, plus the database settings and the two flags. `db.type` names the `Note` model from the service example, which is what the service validates request bodies against. `restApi: true` registers the controller, `socket: false` keeps the websocket gateway and its socket.io dependency out.

Its spec compiles the module with `Test.createTestingModule` and resolves three tokens: `CrudService`, which proves the service providers are registered, `CrudController`, which proves the `restApi` flag reached the controller list, and `IItemRepository`, which comes back as a `MongoItemRepository` and proves the abstract contract is bound to the Mongo implementation. The whole spec runs offline, with no database and no network.

### What the create route does

{% snippet file="node/src/crud/crud-controller.example.ts" region="usage" /%}

The region calls the controller's create handler the way Nest would, with a body, a user and the raw response object, and reads back the header the handler wrote. It stands in for the route rather than replacing it: in an application the guard fills `user` from the JWT and Nest supplies the response.

The spec drives it against a stubbed `CrudService` and a fake response whose request reports the `https` protocol, a `Host` of `api.example.com` and a URL of `/notes`. It asserts the `Location` header comes back as `https://api.example.com/notes/id-1`, so `getLink` rebuilds the request URL and appends the new id; that the body is `{ id: 'id-1' }`; and that the payload and the caller reached the service unchanged.

## API

### `CrudShellNestjsModule.forRoot(options)`

The options are `SharedConfig` from [`@smartsoft001/nestjs`](/docs/packages/nestjs) intersected with the database settings, the two flags and `ICrudQueryConfig`, the two query limits.

| Option                              | Type                                                | What it does                                                                                                                                                                                                       |
| ----------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `tokenConfig`                       | `{ secretOrPrivateKey: string; expiredIn: number }` | The key the guards verify bearer tokens with, and the lifetime the registered `JwtModule` signs with.                                                                                                              |
| `permissions`                       | `ISharedPermissions`                                | Role names allowed to create, read, update and delete. What `PermissionService` checks on every call.                                                                                                              |
| `db.host`, `db.port`, `db.database` | `string`, `number`, `string`                        | Passed straight to `MongoModule.forRoot`. The connection opens on the first query.                                                                                                                                 |
| `db.username`, `db.password`        | `string`                                            | Optional credentials for the connection.                                                                                                                                                                           |
| `db.collection`                     | `string`                                            | The collection this module instance serves.                                                                                                                                                                        |
| `db.type`                           | `T`                                                 | The `@Model` class of the collection. The repository reads its `search` fields, and the module copies it into `SharedConfig.type`, which is what `CrudService` turns every request body into before validating it. |
| `type`                              | `any`                                               | The same class as a `SharedConfig` field. When both are given this one wins.                                                                                                                                       |
| `restApi`                           | `boolean`                                           | Registers `CrudController` when true, and no controllers at all when false.                                                                                                                                        |
| `socket`                            | `boolean`                                           | Registers `CrudGateway` when true. Leave it false to keep socket.io out of the process.                                                                                                                            |
| `maxQueryLimit`                     | `number`                                            | The largest page `GET /` returns, and the page size when the request sends no `limit`. Default `100`.                                                                                                              |
| `maxExportLimit`                    | `number`                                            | The largest CSV or XLSX export. An export without `limit` that matches more rows is refused with `400` rather than truncated. Default `10000`.                                                                     |

{% callout type="warning" title="Set the model type" %}
A request body is a plain object with no field metadata. `CrudService` validates it only after turning it into an instance of the configured class, so a module registered without `db.type` or `type` stores whatever it is sent, required fields or not, and logs a warning at startup. The model example above sets `db.type` for that reason.
{% /callout %}

The module provides the CRUD service and `AuthJwtGuard`, and imports `SharedModule.forFeature(options)` with `type` filled from `db.type`, and `MongoModule.forRoot(options.db)`. It exports the service, the guard and the Mongo module, so an importing module can inject the repositories too. Passport and `JwtModule` are only registered when `restApi` or `socket` is true **and** `tokenConfig.secretOrPrivateKey` is set, the gateway needing `JwtService` to verify subscription tokens; the strategy itself comes from `SharedModule` and is constructed eagerly, so an empty key fails at startup rather than on the first request.

### `CrudShellNestjsCoreModule.forRoot(options)`

The same options without `restApi` and `socket`. It never registers controllers, always registers the gateway and the guard, always registers Passport and `JwtModule`, and imports `SharedModule.forRoot(options)` rather than `forFeature`, so it also carries the root configuration. The `DynamicModule` it returns sets `module: CrudShellNestjsCoreModule`, its own class, so the two variants are separate modules and an application can import either one.

Because it always registers the gateway, an application on the core module gets every change subscription refused until it sets `changePolicy`, described under `CrudGateway` below.

{% callout type="warning" title="The core module exports nothing" %}
Its `exports` list is empty, which means an importing module sees none of its providers. Import `CrudShellNestjsModule` with `restApi: false` and `socket: false` when the importing module has to inject the CRUD service or the repositories.
{% /callout %}

### `CrudController`

Declared as `@Controller('')`, so its routes sit directly under whatever prefix the importing module is mounted at. Every handler delegates to `CrudService`.

| Route                     | Guard                     | What it does                                                                                                                                                             |
| ------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `POST /`                  | `AuthJwtGuard`            | Creates one record. Answers `200` with `{ id }` and a `Location` header pointing at the new record.                                                                      |
| `POST /bulk?mode=`        | `AuthJwtGuard`            | Creates many. The `mode` query parameter becomes the `ICreateManyOptions`. Answers with the created array.                                                               |
| `GET /:id`                | `AuthOrAnonymousJwtGuard` | One record. Throws `NotFoundException('Invalid id')` when the repository returns nothing.                                                                                |
| `GET /`                   | `AuthOrAnonymousJwtGuard` | The list. Answers `{ data, totalCount, links }`, or a CSV or XLSX body when the request carries the matching `Content-Type`.                                             |
| `PUT /:id`                | `AuthJwtGuard`            | Full update. No body in the response.                                                                                                                                    |
| `PATCH /:id`              | `AuthJwtGuard`            | Partial update. No body in the response.                                                                                                                                 |
| `DELETE /:id`             | `AuthJwtGuard`            | Removes the record. No body in the response.                                                                                                                             |
| `POST /attachments`       | `AuthJwtGuard`            | Asks the attachment policy for `create`, then reads one bounded file. Answers `{ id, fileName, contentType, length }` and a `Location` header once storage has finished. |
| `GET /attachments/:id`    | `AuthOrAnonymousJwtGuard` | Asks the policy for `read`, then downloads the file. With a `Range` header it answers `206` with `Content-Range`, otherwise `200`, in both cases as an attachment.       |
| `DELETE /attachments/:id` | `AuthJwtGuard`            | Asks the policy for `delete`, then removes the file.                                                                                                                     |

The three attachment routes are denied unless the application configures an attachment policy, described next.

### Attachment access

`SharedConfig.attachmentPolicy` decides every attachment request. It is called with `{ operation, id, user }`, where `operation` is `'create'`, `'read'` or `'delete'`, `id` is the attachment id and `user` is the caller from the JWT, or `undefined` for an anonymous read. It runs before storage is read or changed, and only a result of exactly `true` lets the request through. Without a policy every attachment request is refused, whatever the token carries. A valid JWT proves who the caller is, not that the file is theirs: resolve ownership, tenant and roles from data the server trusts, never from the id alone, and do not configure an unconditional `true` for private files.

{% snippet file="node/src/crud/attachment-policy.example.ts" region="usage" /%}

The region links a file to its uploader. For `create`, the controller generates the id first and passes it to the policy before it reads the request body, so the policy can record the caller against that id and return `true`; the same id comes back in the upload response. Later `read` and `delete` checks look the id up. The check runs before the body is read, so an upload that is then rejected (too large, interrupted, a storage failure) leaves an ownership record for an id that holds no file; it grants nothing, but clean such records up if they matter. The module takes plain options, so the policy closes over whatever store the application uses; the example keeps it in memory.

Its spec drives the returned function directly. A `create` with a user returns `true` and records that user as the owner, and a `create` without one returns `false`. A `delete` by the owner is allowed and by another user refused. An anonymous `read` of an uploaded file is allowed, and of an unknown id refused.

{% callout type="warning" title="The stock Angular UI sends no token for files" %}
[`@smartsoft001/angular`](/docs/packages/angular) loads files from plain URLs: `FileService.download` calls `window.open`, which is how the PDF and attachment detail components open a file, and the image and video components and the `smartFileUrl` pipe put `FileService.getUrl` into an `src` or a link. None of these requests carries an `Authorization` header, so they arrive as anonymous reads. With the stock UI, the policy has to allow an anonymous `read` for every file that is meant to be viewable, as the example does. Uploads and deletes go through `HttpClient`, so they carry the token as usual.
{% /callout %}

A refusal is a `DomainForbiddenError` thrown by `CrudService.authorizeAttachment`. It becomes `403 Forbidden` only when `AppExceptionFilter` from [`@smartsoft001/nestjs`](/docs/packages/nestjs) is registered; without the filter Nest answers `500`. A missing or invalid token on an upload or a delete is a `401` from `AuthJwtGuard`, before the policy is asked.

Uploads accept one file and, by default, no other form fields. The file is buffered in memory up to the limit before anything is stored, so a malformed, oversized or multi-file request is rejected without a partial write: an invalid body or a request without a file answers `400`, and a file over the limit, a second file or an extra field answers `413`. Two `SharedConfig` fields move the limits:

| Field                 | Default             | What it does                                                                                                              |
| --------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `attachmentMaxBytes`  | `10485760` (10 MiB) | The largest file accepted, in bytes. A file of exactly this size passes.                                                  |
| `attachmentMaxFields` | `0`                 | How many non-file form fields an upload may carry. Their values are ignored. Raise it for clients that send extra fields. |

Buffering can briefly hold about twice the file size per upload, so budget concurrent uploads and request timeouts at the proxy or the application, and validate the content yourself: the declared file name and MIME type are not checked. An application that needs streaming or much larger files should give them a dedicated endpoint. The response is sent only after the storage write resolves, so a failed write answers with an error instead of an upload receipt.

{% callout type="warning" title="Migrating from the unguarded routes" %}
This is a breaking change. Before it, the three routes had no guard and any caller could upload, download and delete. After upgrading, configure `attachmentPolicy` before relying on the routes, register `AppExceptionFilter` so refusals answer `403`, send a Bearer token on uploads and deletes, and raise `attachmentMaxBytes` or `attachmentMaxFields` if clients send larger files or extra form fields. Existing files have no ownership records; the policy has to decide how to treat them.
{% /callout %}

`CrudController.getLink(req)` is a static helper that rebuilds the request URL from `req.protocol`, the `Host` header and `req.url`. The create route and the upload route use it to build their `Location` headers.

A few things about the list route are worth knowing before you rely on it. Export is selected by the request's `Content-Type` rather than by `Accept`: `text/csv` renders through `json2csv`, and the spreadsheet media type renders through `xlsx`, both with `allowDiskUse` turned on for the query. An export is capped by `maxExportLimit` instead of `maxQueryLimit`, is refused with `400` when it would be truncated, and reports the number of matching rows in `X-Total-Count`. CSV text cells that a spreadsheet would run as a formula are prefixed with an apostrophe, so a value such as `+48 600 000 000` shows that apostrophe; the [export page](/docs/crud/export-multiselect-groups) has the details.

The query string is checked before it is parsed, and a request outside these bounds is answered with `400 Bad Request`:

| Bound              | Value                                                                                                                             |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| Operators          | `=`, `!=`, `>`, `>=`, `<`, `<=`, `~=` and repeated keys. No `$` keys other than `$search`, and no `field:op=value` raw operators. |
| Field names        | Letters, digits and underscores, dotted for nested fields, at most 128 characters. No `__proto__`, `prototype` or `constructor`.  |
| Values             | Strings, numbers or booleans of at most 1024 characters. A `/regex/` value is refused.                                            |
| `~=` and `$search` | At most 256 characters, matched literally: the value is escaped before it becomes a regular expression.                           |
| Repeated keys      | Joined into one `$in`, at most 100 values.                                                                                        |
| `limit`            | A positive integer, lowered to `maxQueryLimit` (or `maxExportLimit` for an export), which is also the default.                    |
| `offset`           | An integer from `0` to `10000`. `next` and `last` links beyond it are left out of the response.                                   |
| The whole query    | At most 4096 encoded characters.                                                                                                  |

Raw operators are refused because they reach MongoDB as a `$match` stage, where an operator such as an unescaped `$regex` lets one request keep the database busy: the risk is denial of service. The bounds cap what one request asks for, not what it costs, so index the fields you filter and sort on, scope the data per customer, and set database timeouts and rate limits in the application; counting the matches still reads the whole filtered collection.

{% callout type="warning" title="Upgrading from a version without these bounds" %}
A client that relied on the old behaviour has to change in four places. A list request without `limit` returns at most `maxQueryLimit` rows (default `100`), and a larger `limit` is lowered to it, so page through the list or raise `maxQueryLimit`. An `offset` above `10000` is refused. Raw operators (`$where`, `field:regex=...`, `$`-keys) and `/regex/` values are refused; use `~=` for a "contains" match. Field names with `__proto__`, `prototype` or `constructor` are refused. A subclass of `CrudController` that calls `super(service)` gets the default limits; pass the injected `SharedConfig` as the second argument to honour the configured ones.
{% /callout %}

### Guards

| Guard                     | Behaviour                                                                                                                |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `AuthJwtGuard`            | Requires a valid token. Logs the passport `info` at warning level and throws `UnauthorizedException` when there is none. |
| `AuthOrAnonymousJwtGuard` | Never throws. Returns the user when the token is valid and `undefined` otherwise, which is what lets reads be public.    |

Both extend `AuthGuard('jwt')` from `@nestjs/passport` and rely on the strategy registered by `SharedModule`. Only `AuthJwtGuard` is provided and exported by the module; `AuthOrAnonymousJwtGuard` is used directly by the controller.

### `CrudGateway`

A `@WebSocketGateway` over the websocket transport, registered only when `socket: true` (and always by the core module). It subscribes clients to the changes of one record: a client emits `changes` with `{ id }` and receives one `changes` event per change, shaped as `{ id, type }`. The event carries no document fields, neither the inserted record nor the update delta, so a client that wants the new state refetches the record through an authorized route. One subscription is kept per socket id, replaced when the same client subscribes again and unsubscribed on disconnect.

Every subscription is refused unless three things hold. The socket handshake carries a valid JWT in `auth.token`, signed with `tokenConfig.secretOrPrivateKey`; socket.io clients pass it as `io(url, { auth: { token } })`. The message names exactly one record with a non-empty `id`, so a client can no longer watch the whole collection. And `SharedConfig.changePolicy` is configured and returns exactly `true`. A refusal is a `WsException('Change subscription denied')`, and the repository is not opened.

The policy is called with `{ id, user, type }`, where `user` is built from the token's `sub` and `permissions`. It runs once when the client subscribes, with no `type`, and again before every event, together with a fresh token check, with the event's `type`: `'create'`, `'update'` or `'delete'`. A refusal on an event ends the subscription with the same error, so revoked access stops the stream.

{% snippet file="node/src/crud/change-policy.example.ts" region="usage" /%}

The region shows why `type` is passed. A policy that decides by loading the record and comparing its owner cannot decide a `'delete'` event: Mongo emits it after the document is gone, the lookup finds nothing and the client would never learn about the delete. The example allows a delete without a lookup, relying on the check made when the subscription opened; the event reveals only the id and the word `delete`. Its spec asserts the owner may subscribe, another user may not, and a delete event is allowed without the lookup being called.

Three costs follow from the design. The policy runs on every event, so whatever it loads is loaded per change, per subscriber; keep it cheap or cache it. The token is checked on every event too, so once it expires the next event ends the subscription, and the client has to reconnect with a fresh `auth.token`, since the handshake is the only place the gateway reads it. And an application on `CrudShellNestjsCoreModule` gets every subscription refused until it sets `changePolicy`.

{% callout type="warning" title="Migrating from the open change feed" %}
This is a breaking change. Before it, any client could subscribe without a token, with or without an id, and received the full change object, including the inserted record or the update delta. After upgrading: configure `changePolicy`, connect with the JWT in `auth.token` and reconnect with a fresh one after it expires, always subscribe with an `id`, and treat each event as a signal to refetch rather than a payload to apply.
{% /callout %}

Its path and namespace are built from the `URL_PREFIX` environment variable when the class is loaded, as `/${URL_PREFIX}/_socket` and `/${URL_PREFIX}`. The variable is read at module load, so it has to be set before the process imports the package, and an unset variable produces the literal segment `undefined` in both strings.

The class is not exported under its own name. The package barrel re-exports `./lib/gateways`, which exports only the `GATEWAYS` provider array, so application code reaches the gateway through the module flag rather than by importing the class.

### Not part of the public API

`q2m`, the query-to-Mongo parser behind the list route, lives in the controller directory and is not exported. It is what turns `?title=plan&limit=25&sort=-title` into criteria, options and the `links` object the list response carries, and it is covered by its own spec inside the package. The list route never hands it the raw request: `parseHttpQuery` applies the bounds above first.

## Related packages

- [`@smartsoft001/crud-shell-app-services`](/docs/packages/crud-shell-app-services) holds the rules every route here delegates to.
- [`@smartsoft001/crud-domain`](/docs/packages/crud-domain) defines the mode the bulk route reads from the query string.
- [`@smartsoft001/crud-shell-dtos`](/docs/packages/crud-shell-dtos) defines the change feed the gateway reduces to `{ id, type }`.
- [`@smartsoft001/nestjs`](/docs/packages/nestjs) supplies the shared configuration, the JWT strategy and the permission service.
- [`@smartsoft001/mongo`](/docs/packages/mongo) implements the repositories the module binds.
- [`@smartsoft001/crud-shell-angular`](/docs/packages/crud-shell-angular) is the client that consumes these routes.
