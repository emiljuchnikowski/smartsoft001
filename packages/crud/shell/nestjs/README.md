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
    <tr><td>changes (WebSocket)</td><td>handleFilter — Subscribes to the changes of one entity, <code>{ id }</code>, and emits <code>{ id, type }</code> per change. Requires a JWT and a <code>changePolicy</code>.</td></tr>
</table>

### Change subscriptions

A subscription is refused unless the socket handshake carries a valid JWT in `auth.token`
(`io(url, { auth: { token } })`), the message names one entity with `{ id }`, and
`SharedConfig.changePolicy` returns exactly `true`. The policy receives `{ id, user, type }`. It runs
once on subscribe without `type`, and again before every event, with a fresh token check, with the
change `type` (`create`, `update` or `delete`). A refusal on an event ends the subscription. Decide
from server-side ownership or tenant data, never from the id alone.

- **Events carry no document fields.** Clients receive `{ id, type }` and refetch the entity through
  an authorized endpoint.
- **Deletes.** Mongo emits a `delete` after the document is gone, so a policy that loads the
  document would deny it and the client would never learn about the delete. Branch on
  `type === 'delete'` and decide without loading the document.
- **Cost.** The policy runs per event and per subscriber; keep it cheap or cache it.
- **Token expiry.** The token from the handshake is rechecked on every event. After it expires the
  next event ends the subscription; the client must reconnect with a fresh `auth.token`.
- **Core module.** `CrudShellNestjsCoreModule` always registers the gateway, so every subscription
  is refused until `changePolicy` is set.

#### Migration

Subscriptions used to be open to anyone, accepted an empty filter and carried the full change,
including the inserted document or the update delta. After upgrading: configure `changePolicy`,
connect with the JWT in `auth.token` (and reconnect after it expires), always subscribe with an
`id`, and refetch the entity on each event instead of applying a payload.
