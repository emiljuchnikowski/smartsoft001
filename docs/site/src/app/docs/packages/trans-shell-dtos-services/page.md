---
title: '@smartsoft001/trans-shell-dtos-services'
section: Packages
order: 17
package: '@smartsoft001/trans-shell-dtos-services'
nextjs:
  metadata:
    title: '@smartsoft001/trans-shell-dtos-services'
    description: 'TransCreateDto: the decorated request model for creating a payment transaction, and the one model package that is not published.'
---

One decorated class: the payment request a checkout form collects, described well enough that the form, the required-field check and the trimming all come from the same metadata. {% .lead %}

---

## Install

{% callout type="warning" title="Not on npm yet" %}
This package is not published. Every other package in the family resolves from the registry, this one does not, so `npm install @smartsoft001/trans-shell-dtos-services` fails.

It is built from `packages/trans/shell/dtos` and consumed inside this repository through the workspace path alias. Outside the repository, copy the class or declare your own: it is one file with eight decorated properties and no logic.
{% /callout %}

Two names refer to it, and they differ. The manifest calls it `@smartsoft001/trans-shell-dtos-services`, which is what this page is named after and what rule R8 checks. The path alias in `tsconfig.base.json`, which is what code in this repository imports, is `@smartsoft001/trans-shell-dtos`, matching the sibling packages `crud-shell-dtos` and `auth-shell-dtos`. Neither name is wrong; they simply were never reconciled.

## What it is

`TransCreateDto` is the request body of `POST /` on the transactions controller, written as a class rather than a schema. It carries `@Model` and `@Field` from [`@smartsoft001/models`](/docs/packages/models), which is this repository's own metadata layer, not class-validator, and there is no `ValidationPipe` anywhere in the trans family.

Declaring the request that way buys three things from one source. A form can be generated from it, with the right control per field, which is what the `FieldType` values are for. `getInvalidFields` reports which required fields are still empty, so a client can refuse to send an incomplete form instead of learning about it from a rejected payment. And `castModel` strips a payload down to the declared fields, so an unexpected property in a request body cannot travel any further.

What it does **not** do is validate the transaction. The rules that decide whether a payment may start, including the amount floor and the provider check, live in [`@smartsoft001/trans-domain`](/docs/packages/trans-domain) and run again on the server no matter what the client sent.

## Usage

Every model package in this repository is built identically: a plain class, `@Model` on the class, `@Field` on each property, nothing else. So the calls are identical too. The example below reads `UserDto` from the CRUD family, and both functions work unchanged on a `TransCreateDto`.

{% snippet file="node/src/crud/user-dto.example.ts" region="usage" /%}

`missingCredentials` is the part that transfers. It runs `getInvalidFields(dto, 'create', [])` over a decorated instance and gets back the keys that are required by the metadata and still empty, in declaration order. Point the same call at a fresh `TransCreateDto` and it reports the four properties declared `required: true`, which are `amount`, `system`, `data` and `name`. Its spec proves the shape of the answer on `UserDto`: both fields on an empty instance, nothing once they are filled.

The second function in the region, `toChangeMessage`, belongs to the CRUD change feed and has no counterpart here. This package exports one class and no types beyond it.

## API

### `TransCreateDto<T>`

A `@Model({})` class with eight properties. The generic parameter is the shape of your own payload, the same `T` that ends up on `Trans<T>`.

| Field          | Decorator                                              | Meaning                                                                              |
| -------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `amount`       | `@Field({ required: true, type: FieldType.currency })` | The price. Rendered as a currency control. The domain rejects anything below `1`.    |
| `system`       | `@Field({ required: true, type: FieldType.text })`     | Which provider handles the payment.                                                  |
| `data`         | `@Field({ required: true })`                           | Your payload, typed `T`. No `FieldType`, because there is no general control for it. |
| `name`         | `@Field({ required: true, type: FieldType.text })`     | The order description the buyer sees at the provider.                                |
| `firstName`    | `@Field({ type: FieldType.text })`                     | Optional.                                                                            |
| `lastName`     | `@Field({ type: FieldType.text })`                     | Optional.                                                                            |
| `email`        | `@Field({ type: FieldType.email })`                    | Optional. The email control, not an email format check.                              |
| `contactPhone` | `@Field({ type: FieldType.text })`                     | Optional.                                                                            |

Two things are worth knowing before you use the class as your contract.

`system` is typed as the string literal `'payu'`, not as `TransSystem`. The runtime accepts all four providers, and `TRANS_SYSTEMS` in [`@smartsoft001/trans-domain`](/docs/packages/trans-domain) lists them, so this type is narrower than the behaviour. Assigning `'paypal'` to it is a compile error against a request the server would have accepted.

The class does not cover `ITransCreate` completely. That interface also carries `options`, passed through to the provider, and `clientIp`, which the domain requires. Neither is declared here, because `TransController` fills `clientIp` from the socket rather than from the body. A form generated from this model therefore produces a request the controller completes, not one the domain would accept on its own.

## Related packages

- [`@smartsoft001/models`](/docs/packages/models) supplies `@Model`, `@Field`, the `FieldType` enum and the readers that make the metadata useful.
- [`@smartsoft001/trans-domain`](/docs/packages/trans-domain) defines `ITransCreate`, the full request this model shadows, and validates it for real.
- [`@smartsoft001/trans-shell-nestjs`](/docs/packages/trans-shell-nestjs) exposes the route this model describes the body of.
- [`@smartsoft001/crud-shell-dtos`](/docs/packages/crud-shell-dtos) is the sibling model package the example on this page is taken from.
