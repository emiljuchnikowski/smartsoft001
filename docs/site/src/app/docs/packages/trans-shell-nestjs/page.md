---
title: '@smartsoft001/trans-shell-nestjs'
section: Packages
order: 19
package: '@smartsoft001/trans-shell-nestjs'
nextjs:
  metadata:
    title: '@smartsoft001/trans-shell-nestjs'
    description: 'The NestJS shell around TransService: one dynamic module that gates each payment provider behind its own config, a route that starts a payment and one webhook controller per provider.'
---

One module call gives an application a route that starts a payment and a webhook for every provider it enabled. {% .lead %}

---

## Install

```bash
npm install @smartsoft001/trans-shell-nestjs @smartsoft001/trans-shell-app-services @smartsoft001/trans-domain @smartsoft001/crud-shell-nestjs @smartsoft001/nestjs @smartsoft001/payu @smartsoft001/paypal @smartsoft001/paynow @smartsoft001/revolut
```

The manifest declares neither dependencies nor peer dependencies, so a package manager will not warn about any of these and the failure appears at import time instead. The four payment packages are imported unconditionally, for their config and service classes, even though each one is only registered when you pass its config. [`@smartsoft001/crud-shell-nestjs`](/docs/packages/crud-shell-nestjs) comes with its own list, including [`@smartsoft001/mongo`](/docs/packages/mongo), [`@smartsoft001/domain-core`](/docs/packages/domain-core), [`@smartsoft001/users`](/docs/packages/users) and [`@smartsoft001/utils`](/docs/packages/utils).

From NestJS it needs `@nestjs/common`, `@nestjs/core`, `@nestjs/axios` with `axios`, `@nestjs/jwt` and `@nestjs/passport`.

## What it is

The transaction flow has two halves that look nothing alike. A buyer starts a payment, which is an ordinary request from your own front end. The provider then reports what happened, which is a request from the outside with a body only that provider knows the shape of. This module carries both: one controller for the first half and one per provider for the second.

Registration is gated per provider. The options object takes an optional config block for each of the four, and each block decides two providers: the config value and the service that reads it. Pass a `payuConfig` and `PayuConfig` and `PayuService` exist; leave it out and neither does, which is exactly what the `@Optional()` injections in [`@smartsoft001/trans-shell-app-services`](/docs/packages/trans-shell-app-services) expect. The webhook controllers are registered either way, so a provider you never configured still has a route, and a request to it fails when the service behind it is missing.

Storage comes from the CRUD family. The module imports `CrudShellNestjsModule.forRoot` with the collection forced to `trans` and both of its flags turned off, so it inherits the Mongo repositories without inheriting the CRUD routes or the websocket gateway. Nothing connects eagerly: the client opens on the first query, which is why the module compiles in a test with no database. What is constructed eagerly is the JWT strategy, so `tokenConfig.secretOrPrivateKey` has to be non-empty even though no route here is guarded.

## Usage

{% snippet file="node/src/trans/trans-module.example.ts" region="usage" /%}

The region declares the same feature module twice. The first has no payment provider at all, which is a complete and startable configuration: the service, the domain services and the controllers all exist, and only the provider-specific parts are missing. The second adds a `payuConfig`, with the sandbox flag and the two urls PayU calls back on, and nothing else changes.

Its spec compiles both with `Test.createTestingModule` and resolves tokens out of them. From the plain module it gets `TransService` and the `TransConfig` it was built with, and it asserts that `PayuService` cannot be resolved even non-strictly. From the PayU module it gets `PayuService` as a real instance and a `PayuConfig` carrying the `posId` it was given, and `TransService` still resolves. The whole spec runs offline against `localhost:27017` without a database, because the connection is never opened.

## API

### `TransShellNestjsModule.forRoot(options)`

The options are `SharedConfig` from [`@smartsoft001/nestjs`](/docs/packages/nestjs) intersected with `TransConfig` from [`@smartsoft001/trans-domain`](/docs/packages/trans-domain), the four optional provider configs, and the database settings.

| Option                              | Type                                                | What it does                                                                                                       |
| ----------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `tokenConfig`                       | `{ secretOrPrivateKey: string; expiredIn: number }` | Registers `JwtModule` with this key and lifetime. The strategy is built eagerly, so an empty key fails at startup. |
| `permissions`                       | `ISharedPermissions`                                | Role names per operation, carried down into the CRUD module. No route in this package consults them.               |
| `internalApiUrl`                    | `string`                                            | Your own back end. Empty turns the built-in calls off entirely.                                                    |
| `db.host`, `db.port`, `db.database` | `string`, `number`, `string`                        | Passed to the CRUD module, and from there to `MongoModule.forRoot`.                                                |
| `db.username`, `db.password`        | `string`                                            | Optional credentials.                                                                                              |
| `db.collection`                     | `string`                                            | Accepted and then **overwritten with `trans`**, so transactions always land in that collection.                    |
| `payuConfig`                        | `PayuConfig`                                        | Registers `PayuConfig` and `PayuService` when present.                                                             |
| `paypalConfig`                      | `PaypalConfig`                                      | Registers `PaypalConfig` and `PaypalService` when present.                                                         |
| `revolutConfig`                     | `RevolutConfig`                                     | Registers `RevolutConfig` and `RevolutService` when present.                                                       |
| `paynowConfig`                      | `PaynowConfig`                                      | Registers `PaynowConfig` and `PaynowService` when present.                                                         |

The dynamic module provides `TransService`, the three domain services, `TransConfig` as a value provider holding the whole options object, and the gated provider pairs. It registers all four controllers. It imports `HttpModule`, `CrudShellNestjsModule.forRoot({ ...options, db: { ...options.db, collection: 'trans' }, restApi: false, socket: false })`, `PassportModule` with the `jwt` default strategy and sessions off, and `JwtModule`. It exports `TransService`, `TransConfig` and the PayU, PayPal and Revolut pairs.

{% callout type="warning" title="Paynow is provided but not exported" %}
The `exports` array of this module lists the PayU, PayPal and Revolut pairs and omits `PaynowConfig` and `PaynowService`, which it provides. An application that configures Paynow gets a working webhook, because the controller lives inside this module, but a module importing this one cannot inject either class. The core variant below exports them, so the two are inconsistent and only one of them can be right.
{% /callout %}

### `TransShellNestjsCoreModule.forRoot(options)`

The same options, and a module that returns `module: TransShellNestjsCoreModule`, its own class. It registers no controllers, which is what makes it the right choice for a process that consumes transactions without exposing them, a worker or a scheduled job.

Its provider and export lists differ from each other. It provides the PayU, PayPal and Paynow pairs, with **no `revolutConfig` branch at all**, while its `exports` list all four, Revolut included. Configuring Revolut against this module therefore yields an export of two classes that were never provided.

### `TransController`

Declared as `@Controller('')`, so its routes sit directly under whatever prefix the importing module is mounted at. Neither route carries a guard, so anyone who can reach the prefix can start a payment and can trigger a refresh.

| Route               | What it does                                                                                                                                                                        |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `POST /`            | Starts a payment. Answers `{ url, orderId }`, where `url` is the provider's redirect target the buyer has to be sent to.                                                            |
| `POST /:id/refresh` | Refreshes one transaction by the provider's order id. Answers no body. Its request body is read as a parameter and then ignored: the service is always called with an empty `data`. |

The create handler does one thing before delegating. It overwrites `clientIp` on the body with the address of the socket, taken from `req.connection.remoteAddress`, mapping any address that starts with `::` to the literal `10.0.0.1`. The address is what PayU receives as `customerIp`, and the mapping means a request arriving over IPv6, including every request from `::1` in local development, is reported to the provider as one fixed private address. A socket that reports no address at all makes the handler throw before the service is reached, and the address is read from the socket rather than from a forwarding header, so behind a proxy every transaction records the proxy.

### The webhook controllers

Each provider posts its result to its own route. All three answer `200` with the string `ok`, log through `console.error` and rethrow on failure, and carry no guard: the only thing standing between the route and a forged call is whatever the provider's own payload proves.

| Controller         | Route          | Body                     | What it does                                                                          |
| ------------------ | -------------- | ------------------------ | ------------------------------------------------------------------------------------- |
| `PayUController`   | `POST /payu`   | `{ order: { orderId } }` | Refreshes by `order.orderId`, storing the whole body as the history `customData`.     |
| `PaynowController` | `POST /paynow` | `{ paymentId }`          | Refreshes by `paymentId`.                                                             |
| `PaypalController` | `POST /paypal` | `{ item_number1 }`       | Reads the transaction by that **local** id first, then refreshes by its `externalId`. |

`PaypalController` also carries `GET /paypal/:id/confirm`, the route a buyer returns to. It reads the transaction by the local id, refuses to continue when `externalId` does not equal the `paymentId` query parameter, confirms the payment through `PaypalService` and refreshes the transaction with the result, then redirects with `301` to `PaypalConfig.returnUrl`. Any failure redirects with `301` to `cancelUrl` instead, so a buyer never sees an error page. The amount handed to `PaypalService.confirm` is `trans.amount / 100`, so this route treats the stored amount as minor units while the rest of the family does not convert it.

Both `PaypalConfig` and `PaypalService` are injected into that controller with `@Optional()`, and the controller is registered whether or not PayPal was configured. Calling either PayPal route on an application without a `paypalConfig` therefore fails inside the handler rather than at startup.

### `CONTROLLERS`

`CONTROLLERS` is `[TransController, PayUController, PaypalController, PaynowController]`, and all four classes are exported by the barrel. The non-core module spreads the array as written, so the set of routes is fixed and not configurable.

## Related packages

- [`@smartsoft001/trans-shell-app-services`](/docs/packages/trans-shell-app-services) holds the service every route here delegates to.
- [`@smartsoft001/trans-domain`](/docs/packages/trans-domain) defines the transaction, its statuses and the rules applied to it.
- [`@smartsoft001/trans-shell-dtos-services`](/docs/packages/trans-shell-dtos-services) describes the body of the create route as a decorated model.
- [`@smartsoft001/crud-shell-nestjs`](/docs/packages/crud-shell-nestjs) supplies the Mongo wiring this module imports with its routes turned off.
- [`@smartsoft001/nestjs`](/docs/packages/nestjs) supplies the shared configuration and the JWT strategy built at startup.
- [`@smartsoft001/payu`](/docs/packages/payu), [`@smartsoft001/paypal`](/docs/packages/paypal), [`@smartsoft001/paynow`](/docs/packages/paynow) and [`@smartsoft001/revolut`](/docs/packages/revolut) are the four integrations the config blocks gate.
