# 📦 @smartsoft001/crud-shell-nestjs

![npm](https://img.shields.io/npm/v/@smartsoft001/crud-shell-nestjs) ![downloads](https://img.shields.io/npm/dm/@smartsoft001/crud-shell-nestjs)

## 🚀 Usage

`npm i @smartsoft001/crud-shell-nestjs`

## 🛠️ Modules

### CrudShellNestjsModule
- Provides the main integration module for CRUD features in a NestJS app.
- Static method: `forRoot(options)` — Registers controllers, providers, and imports required modules with the given configuration.

### CrudShellNestjsCoreModule
- Provides a core integration module for CRUD features in a NestJS app.
- Static method: `forRoot(options)` — Registers providers and imports required modules with the given configuration.

## 🛠️ Controllers & Methods

### CrudController
<table>
    <tr><td>POST /</td><td>create — Creates a new entity. Returns the new entity's ID.</td></tr>
    <tr><td>POST /bulk</td><td>createMany — Creates multiple entities in bulk.</td></tr>
    <tr><td>GET /:id</td><td>readById — Retrieves an entity by its ID.</td></tr>
    <tr><td>GET /</td><td>read — Retrieves a list of entities with filtering, CSV, and XLSX export support.</td></tr>
    <tr><td>PUT /:id</td><td>update — Updates an entity by its ID.</td></tr>
    <tr><td>PATCH /:id</td><td>updatePartial — Partially updates an entity by its ID.</td></tr>
    <tr><td>DELETE /:id</td><td>delete — Deletes an entity by its ID.</td></tr>
    <tr><td>POST /attachments</td><td>uploadAttachment — Uploads an attachment for an entity.</td></tr>
    <tr><td>GET /attachments/:id</td><td>downloadAttachment — Downloads an attachment by its ID.</td></tr>
    <tr><td>DELETE /attachments/:id</td><td>deleteAttachment — Deletes an attachment by its ID.</td></tr>
</table>

## 🛠️ Gateways & Methods

### CrudGateway
<table>
    <tr><td>changes (WebSocket)</td><td>handleFilter — Subscribes to changes for entities and streams updates to the client.</td></tr>
</table>

## 🛡️ Query bounds and exports

`GET /` checks the query string before it reaches MongoDB and answers anything outside these bounds with `400 Bad Request`:

- Operators: `=`, `!=`, `>`, `>=`, `<`, `<=`, `~=` and repeated keys (joined into one `$in`, at most 100 values). Raw Mongo operators (`$where`, `$`-keys other than `$search`, `field:op=value`) and `/regex/` values are refused: they reach MongoDB as a `$match` stage, where an unbounded operator lets one request keep the database busy (denial of service).
- Field names: letters, digits and underscores, dotted for nested fields, at most 128 characters; `__proto__`, `prototype` and `constructor` are refused.
- `~=` and `$search` are matched literally (the text is escaped before it becomes a regular expression) and are at most 256 characters. Other values are at most 1024 characters, the encoded query at most 4096.
- `limit` is a positive integer, lowered to `maxQueryLimit` (default `100`), which is also the page size when no `limit` is sent. `offset` is an integer from `0` to `10000`; `next` and `last` links beyond it are left out.
- CSV and XLSX exports use `maxExportLimit` (default `10000`) instead. An export without `limit` that matches more rows is refused with `400` rather than truncated, and every export reports the match count in `X-Total-Count`.
- CSV text cells starting with `=`, `+`, `-` or `@` (also after spaces) or with a tab or line break get a leading apostrophe (OWASP CSV-injection guidance), so `+48 600 000 000` is exported as `'+48 600 000 000`. Numbers are unchanged.

```ts
CrudShellNestjsModule.forRoot({
  // ...
  restApi: true,
  socket: false,
  maxQueryLimit: 500,
  maxExportLimit: 50000,
});
```

The bounds cap what one request asks for, not what it costs: index the fields you filter and sort on, scope data per customer, and set database timeouts and rate limits in the application.

### Upgrading

- A list request without `limit` now returns at most `maxQueryLimit` rows and a larger `limit` is lowered to it: page through the list or raise `maxQueryLimit`.
- An `offset` above `10000` is refused.
- Raw operators and `/regex/` values are refused; use `~=` for a "contains" match.
- Field names containing `__proto__`, `prototype` or `constructor` are refused.
- A `CrudController` subclass that calls `super(service)` gets the default limits; pass the injected `SharedConfig` as the second argument to use the configured ones.
