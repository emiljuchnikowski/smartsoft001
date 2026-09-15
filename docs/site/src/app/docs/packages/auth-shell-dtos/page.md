---
title: '@smartsoft001/auth-shell-dtos'
section: Packages
order: 13
package: '@smartsoft001/auth-shell-dtos'
nextjs:
  metadata:
    title: '@smartsoft001/auth-shell-dtos'
    description: 'LoginDto, the decorated credentials model of the auth family: two required fields the framework can render as a form and check for completeness.'
---

One class, two required fields: the credentials model the auth family renders as a login form. {% .lead %}

---

## Install

```bash
npm install @smartsoft001/auth-shell-dtos @smartsoft001/models reflect-metadata
```

The manifest holds nothing but a name and a version, so its two imports have to be installed alongside it. `LoginDto` carries `@Model` and `@Field` from [`@smartsoft001/models`](/docs/packages/models), and those decorators write their metadata through `reflect-metadata`. There is no NestJS dependency, no database and no HTTP client here.

## What it is

The package exports a single class and nothing else. `LoginDto` is a `@Model({})` with `username` and `password`, both marked `@Field({ required: true })`, and `username` additionally marked `focused: true`.

It is not a validation schema in the class-validator sense, and no `ValidationPipe` is involved anywhere in this family. What the decorators buy is metadata that the framework reads at runtime: a form can be generated from the class, the still-empty required fields can be reported before anything is sent, and the object can be trimmed to the fields a given operation may touch. `focused: true` tells a generated form which control takes the cursor.

Nothing inside the workspace imports it. The token endpoint in [`@smartsoft001/auth-shell-nestjs`](/docs/packages/auth-shell-nestjs) takes an `IAuthTokenRequest`, not a `LoginDto`, so this class exists for the client side of the exchange: the screen that collects the two values before they become a password grant.

## Usage

{% snippet file="node/src/crud/user-dto.example.ts" region="usage" /%}

The example is the shared one, written against `UserDto` from [`@smartsoft001/crud-shell-dtos`](/docs/packages/crud-shell-dtos), and it applies to `LoginDto` unchanged. The two classes are identical field for field: the same two `string` properties, the same `required: true` on both, the same `focused: true` on `username`. Swap the import and the type annotation and every line behaves the same way.

The half that matters here is `missingCredentials`. It runs `getInvalidFields(dto, 'create', [])` over the model and gets back the names of the required fields that are still empty, in declaration order, which is the same check the server runs before it accepts a record. Doing it on the caller's side is how a login form refuses to submit an incomplete pair. The spec proves both ends of it: an empty instance reports `['username', 'password']`, and a filled one reports nothing.

The rest of the region, `toChangeMessage` and the change-feed union it switches on, belongs to the CRUD package and has no counterpart here. This package has no feed and no interfaces, only the model.

## API

### `LoginDto`

A `@Model({})` class with two `string` properties.

| Field      | Decorator                                   | What it means                                                                                                         |
| ---------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `username` | `@Field({ required: true, focused: true })` | Mandatory in every mode. `focused` marks it as the control a generated form focuses first.                            |
| `password` | `@Field({ required: true })`                | Mandatory in every mode. A property named `password` defaults to `FieldType.password`, so no explicit type is needed. |

That is the entire public surface. The barrel re-exports `./lib/login.dto` and nothing more: no provider array, no interfaces, no constants.

## Related packages

- [`@smartsoft001/models`](/docs/packages/models) supplies the two decorators and the metadata readers the example calls.
- [`@smartsoft001/crud-shell-dtos`](/docs/packages/crud-shell-dtos) exports `UserDto`, the identical model the shared example is written against.
- [`@smartsoft001/auth-domain`](/docs/packages/auth-domain) defines `IAuthTokenRequestPassword`, the shape these two fields become on the wire.
- [`@smartsoft001/auth-shell-nestjs`](/docs/packages/auth-shell-nestjs) is the endpoint that receives them.
