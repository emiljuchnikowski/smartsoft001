---
title: Architecture
section: Getting started
order: 4
nextjs:
  metadata:
    title: Architecture
    description: How the domain and shell layers fit together and how model decorators drive the generated CRUD screens and endpoints.
---

Entities are described once with decorators, a configuration object describes the screens, and the engine builds both the frontend pages and the backend endpoints from that description. {% .lead %}

---

## The layers

A feature family is three kinds of package with one dependency direction.

The **domain** layer, `crud-domain`, holds the entities and the business rules. It imports no framework, so it can be read, tested and reused from either side of the wire. The **shell** layer adapts that domain to a runtime: `crud-shell-nestjs` exposes it over HTTP and MongoDB, and `crud-shell-angular` and `crud-shell-react` render it as pages, one for each UI framework. Between them sit the **contracts and glue**: `crud-shell-dtos` defines the shapes that cross the network, and `crud-shell-app-services` holds the services the NestJS shell resolves from its dependency injection container.

Nothing in the domain knows that a shell exists. Replacing the backend adapter or adding a frontend therefore touches the shell packages only, which is the whole point of the split: the React shell sits next to the Angular one on the same domain, the same contracts and the same endpoints.

---

## Decorators, configuration, engine

The crud family is built on one idea: the framework already knows enough about an entity to render it, so the screens are not written, they are described.

The pipeline has three stages. **Decorators** on the entity record what each field is. A **configuration** object records what the screens should do with those fields. The **engine** reads both and instantiates the components.

### Decorators record the shape

{% snippet file="node/src/getting-started/user.model.example.ts" region="usage" /%}

`@Model({ titleKey: 'email' })` marks the class as a framework model and names the field that stands in for the record in titles and lists. `@Field` records per-field metadata: `type` picks the editor and the validation, `FieldType.email` yields an email input with email validation, `FieldType.int` an integer one, and `required: true` marks the field mandatory. The entity implements `IEntity<string>` from `@smartsoft001/domain-core`, which is what fixes the type of its identifier.

The decorators write this into metadata rather than into the class body, and `@smartsoft001/models` provides the readers. `getModelFieldKeys` returns the names of the decorated fields of a type, in declaration order, which is the order the generated form and list columns follow. `getModelFieldOptions` returns the options recorded for one field, so a component can ask what kind of editor to build. `isModel` reports whether an instance belongs to a decorated class, which is how the generic code tells a model apart from a plain value before it tries to read either of the other two.

### Configuration records the intent

Field metadata says what the data is; it cannot say how a screen should behave. That is the job of a `CrudFullConfig` object, provided per feature: through `CrudModule.forFeature` of `@smartsoft001/crud-shell-angular`, or as the `config` of a `CrudProvider` of `@smartsoft001/crud-shell-react`. The two carry the same fields, save the class of the pages, `cssClass` in Angular and `className` in React. It carries the endpoint and the entity name that address the backend, the entity type whose metadata is read, and then the screen decisions: whether records can be added, edited, viewed in detail or removed, whether search and export are offered, the page size for pagination, the default sort field and direction, the list mode and pagination mode, the groups a list is broken into, and the extra buttons a page shows. Custom components can be slotted in per field or at the top and bottom of a page, so a generated screen can be extended without being abandoned.

### The engine builds the screens

Instead of a fixed template, each page resolves its children at runtime from the configuration and the field metadata, which is how one pair of page components serves every entity in an application. In `@smartsoft001/crud-shell-angular` the list and item page components are built on `CreateDynamicComponent` from `@smartsoft001/angular`. In `@smartsoft001/crud-shell-react`, `SmartCrudListPage` and `SmartCrudItemPage` render `SmartList`, `SmartForm` and `SmartDetails` from `@smartsoft001/react`, which read the field metadata as they render, and take their bodies from the `components` registry of `SmartProvider`, so an application can replace one without forking the page. The [CRUD overview](/docs/crud/overview) has the code for this, and the [list page](/docs/crud/list-page) and [item page](/docs/crud/item-page) pages describe what each of the two generates.

---

## The backend side

`CrudShellNestjsModule.forRoot(options)` registers the same generic machinery on the server. It takes the shared configuration, `tokenConfig` and `permissions`, plus the `db` connection, and two switches, `restApi` and `socket`, that decide whether the REST controllers and the websocket gateways are registered. With `restApi` enabled a generic `CrudController` serves the whole entity lifecycle.

| Method   | Path    | What it does                                                                                 |
| -------- | ------- | -------------------------------------------------------------------------------------------- |
| `POST`   | `/`     | Creates one record and returns its id, with the new resource's URL in the `Location` header. |
| `POST`   | `/bulk` | Creates many records in one call, with the `mode` query parameter choosing the strategy.     |
| `GET`    | `/:id`  | Reads one record, answering 404 when the id matches nothing.                                 |
| `GET`    | `/`     | Reads a filtered, sorted and paginated page, and can answer CSV or XLSX instead of JSON.     |
| `PUT`    | `/:id`  | Replaces one record.                                                                         |
| `PATCH`  | `/:id`  | Updates part of one record.                                                                  |
| `DELETE` | `/:id`  | Removes one record.                                                                          |

Writes are guarded by the JWT strategy, while reads also accept an anonymous token. Which roles may perform each operation comes from the `permissions` map given to the module, so the same controller behaves differently per deployment without a code change.

---

## Where next

- [Installation](/docs/installation) has the wiring for both sides in full.
- [CRUD overview](/docs/crud/overview) shows the configuration and the generated screens in code.
- [Packages](/) will document each library on its own page.
