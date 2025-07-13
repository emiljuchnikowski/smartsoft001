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
