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

The region imports the dynamic module into a feature module. The options object is the shared configuration from [`@smartsoft001/nestjs`](/docs/packages/nestjs), which is the signing key and the roles allowed per operation, plus the database settings and the two flags. `restApi: true` registers the controller, `socket: false` keeps the websocket gateway and its socket.io dependency out.

Its spec compiles the module with `Test.createTestingModule` and resolves three tokens: `CrudService`, which proves the service providers are registered, `CrudController`, which proves the `restApi` flag reached the controller list, and `IItemRepository`, which comes back as a `MongoItemRepository` and proves the abstract contract is bound to the Mongo implementation. The whole spec runs offline, with no database and no network.

### What the create route does

{% snippet file="node/src/crud/crud-controller.example.ts" region="usage" /%}

The region calls the controller's create handler the way Nest would, with a body, a user and the raw response object, and reads back the header the handler wrote. It stands in for the route rather than replacing it: in an application the guard fills `user` from the JWT and Nest supplies the response.

The spec drives it against a stubbed `CrudService` and a fake response whose request reports the `https` protocol, a `Host` of `api.example.com` and a URL of `/notes`. It asserts the `Location` header comes back as `https://api.example.com/notes/id-1`, so `getLink` rebuilds the request URL and appends the new id; that the body is `{ id: 'id-1' }`; and that the payload and the caller reached the service unchanged.

## API

### `CrudShellNestjsModule.forRoot(options)`

The options are `SharedConfig` from [`@smartsoft001/nestjs`](/docs/packages/nestjs) intersected with the database settings and the two flags.

| Option                              | Type                                                | What it does                                                                                          |
| ----------------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `tokenConfig`                       | `{ secretOrPrivateKey: string; expiredIn: number }` | The key the guards verify bearer tokens with, and the lifetime the registered `JwtModule` signs with. |
| `permissions`                       | `ISharedPermissions`                                | Role names allowed to create, read, update and delete. What `PermissionService` checks on every call. |
| `db.host`, `db.port`, `db.database` | `string`, `number`, `string`                        | Passed straight to `MongoModule.forRoot`. The connection opens on the first query.                    |
| `db.username`, `db.password`        | `string`                                            | Optional credentials for the connection.                                                              |
| `db.collection`                     | `string`                                            | The collection this module instance serves.                                                           |
| `db.type`                           | `T`                                                 | Optional model type carried with the connection settings.                                             |
| `restApi`                           | `boolean`                                           | Registers `CrudController` when true, and no controllers at all when false.                           |
| `socket`                            | `boolean`                                           | Registers `CrudGateway` when true. Leave it false to keep socket.io out of the process.               |

The module provides the CRUD service and `AuthJwtGuard`, and imports `SharedModule.forFeature(options)` and `MongoModule.forRoot(options.db)`. It exports the service, the guard and the Mongo module, so an importing module can inject the repositories too. Passport and `JwtModule` are only registered when `restApi` is true **and** `tokenConfig.secretOrPrivateKey` is set; the strategy itself comes from `SharedModule` and is constructed eagerly, so an empty key fails at startup rather than on the first request.

### `CrudShellNestjsCoreModule.forRoot(options)`

The same options without `restApi` and `socket`. It never registers controllers, always registers the gateway and the guard, always registers Passport and `JwtModule`, and imports `SharedModule.forRoot(options)` rather than `forFeature`, so it also carries the root configuration. The `DynamicModule` it returns sets `module: CrudShellNestjsCoreModule`, its own class, so the two variants are separate modules and an application can import either one.

{% callout type="warning" title="The core module exports nothing" %}
Its `exports` list is empty, which means an importing module sees none of its providers. Import `CrudShellNestjsModule` with `restApi: false` and `socket: false` when the importing module has to inject the CRUD service or the repositories.
{% /callout %}

### `CrudController`

Declared as `@Controller('')`, so its routes sit directly under whatever prefix the importing module is mounted at. Every handler delegates to `CrudService`.

| Route                     | Guard                     | What it does                                                                                                                      |
| ------------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `POST /`                  | `AuthJwtGuard`            | Creates one record. Answers `200` with `{ id }` and a `Location` header pointing at the new record.                               |
| `POST /bulk?mode=`        | `AuthJwtGuard`            | Creates many. The `mode` query parameter becomes the `ICreateManyOptions`. Answers with the created array.                        |
| `GET /:id`                | `AuthOrAnonymousJwtGuard` | One record. Throws `NotFoundException('Invalid id')` when the repository returns nothing.                                         |
| `GET /`                   | `AuthOrAnonymousJwtGuard` | The list. Answers `{ data, totalCount, links }`, or a CSV or XLSX body when the request carries the matching `Content-Type`.      |
| `PUT /:id`                | `AuthJwtGuard`            | Full update. No body in the response.                                                                                             |
| `PATCH /:id`              | `AuthJwtGuard`            | Partial update. No body in the response.                                                                                          |
| `DELETE /:id`             | `AuthJwtGuard`            | Removes the record. No body in the response.                                                                                      |
| `POST /attachments`       | none                      | Multipart upload parsed with Busboy. Answers `{ id, fileName, contentType, length }` and a `Location` header.                     |
| `GET /attachments/:id`    | none                      | Downloads the file. With a `Range` header it answers `206` with `Content-Range`, otherwise `200`, in both cases as an attachment. |
| `DELETE /attachments/:id` | none                      | Removes the file.                                                                                                                 |

The three attachment routes carry no guard at all, so anyone who can reach the prefix can upload, download and delete files unless the application adds its own protection.

`CrudController.getLink(req)` is a static helper that rebuilds the request URL from `req.protocol`, the `Host` header and `req.url`. The create route and the upload route use it to build their `Location` headers.

Two things about the list route are worth knowing before you rely on it. Export is selected by the request's `Content-Type` rather than by `Accept`: `text/csv` renders through `json2csv`, and the spreadsheet media type renders through `xlsx`, both with `allowDiskUse` turned on for the query. Neither branch returns, so after writing the export the handler continues into the JSON `res.send` at the end of the method.

### Guards

| Guard                     | Behaviour                                                                                                                |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `AuthJwtGuard`            | Requires a valid token. Logs the passport `info` at warning level and throws `UnauthorizedException` when there is none. |
| `AuthOrAnonymousJwtGuard` | Never throws. Returns the user when the token is valid and `undefined` otherwise, which is what lets reads be public.    |

Both extend `AuthGuard('jwt')` from `@nestjs/passport` and rely on the strategy registered by `SharedModule`. Only `AuthJwtGuard` is provided and exported by the module; `AuthOrAnonymousJwtGuard` is used directly by the controller.

### `CrudGateway`

A `@WebSocketGateway` over the websocket transport, registered only when `socket: true`. It subscribes clients to the change feed: a client emits `changes` with `{ id? }` and receives one `changes` event per change, taken from `CrudService.changes(...)` and shaped as the union in [`@smartsoft001/crud-shell-dtos`](/docs/packages/crud-shell-dtos). One subscription is kept per socket id, replaced when the same client subscribes again and unsubscribed on disconnect.

Its path and namespace are built from the `URL_PREFIX` environment variable when the class is loaded, as `/${URL_PREFIX}/_socket` and `/${URL_PREFIX}`. The variable is read at module load, so it has to be set before the process imports the package, and an unset variable produces the literal segment `undefined` in both strings.

The class is not exported under its own name. The package barrel re-exports `./lib/gateways`, which exports only the `GATEWAYS` provider array, so application code reaches the gateway through the module flag rather than by importing the class.

### Not part of the public API

`q2m`, the query-to-Mongo parser behind the list route, lives in the controller directory and is not exported. It is what turns `?title=plan&limit=25&sort=-title` into criteria, options and the `links` object the list response carries, and it is covered by its own spec inside the package.

## Related packages

- [`@smartsoft001/crud-shell-app-services`](/docs/packages/crud-shell-app-services) holds the rules every route here delegates to.
- [`@smartsoft001/crud-domain`](/docs/packages/crud-domain) defines the mode the bulk route reads from the query string.
- [`@smartsoft001/crud-shell-dtos`](/docs/packages/crud-shell-dtos) defines the payloads the gateway forwards.
- [`@smartsoft001/nestjs`](/docs/packages/nestjs) supplies the shared configuration, the JWT strategy and the permission service.
- [`@smartsoft001/mongo`](/docs/packages/mongo) implements the repositories the module binds.
- [`@smartsoft001/crud-shell-angular`](/docs/packages/crud-shell-angular) is the client that consumes these routes.
