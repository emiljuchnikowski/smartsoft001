---
title: '@smartsoft001/paypal'
section: Packages
order: 21
package: '@smartsoft001/paypal'
nextjs:
  metadata:
    title: '@smartsoft001/paypal'
    description: 'PaypalService: create, confirm, status and refund calls against PayPal through paypal-rest-sdk, with credentials resolved per transaction.'
---

The PayPal end of a transaction: four calls through the legacy REST SDK, with the credentials chosen per transaction rather than once at startup. {% .lead %}

---

## Install

```bash
npm install @smartsoft001/paypal @smartsoft001/trans-domain @nestjs/axios paypal-rest-sdk
```

The manifest declares neither dependencies nor peer dependencies, so everything the service reaches for has to be installed alongside it. `paypal-rest-sdk` carries every outbound call, `@nestjs/common` provides `@Injectable` and `Logger`, `@nestjs/core` provides `ModuleRef`, and `@nestjs/axios` provides the `HttpService` the constructor asks for. The three imports from [`@smartsoft001/trans-domain`](/docs/packages/trans-domain) are used only as types, so they cost nothing at runtime but are needed to compile.

{% callout type="note" title="The injected HttpService is never used" %}
`PaypalService` declares `HttpService` as its first constructor parameter and never calls it. All four methods go through `paypal-rest-sdk`. The dependency still has to resolve, which is why the example below imports `HttpModule`.
{% /callout %}

## What it is

One of the four payment providers behind [`@smartsoft001/trans-shell-app-services`](/docs/packages/trans-shell-app-services). The service implements `ITransPaymentSingleService`, the contract that the transaction domain calls whenever a transaction names `paypal` as its system, and it adds one method the contract does not declare: `confirm`, which the PayPal controller in [`@smartsoft001/trans-shell-nestjs`](/docs/packages/trans-shell-nestjs) calls when a buyer comes back from the PayPal approval page.

The package ships no NestJS module and no `forRoot`. An application normally gets the service from `TransShellNestjsModule.forRoot({ paypalConfig })`, which registers `PaypalConfig` as a value provider and `PaypalService` as a class provider, and only when that key is present. Register the two providers by hand, as the example does, to use the PayPal calls without the rest of the transaction shell.

Credentials are never installed globally. `paypal.configure()` is never called; instead every SDK call receives its own environment object built from the config that was resolved for that transaction. That is what makes the second configuration path work: a provider registered under `PAYPAL_CONFIG_PROVIDER` can hand back a different merchant account per transaction, and nothing about the service is shared between calls.

## Usage

{% snippet file="node/src/paypal/paypal-service.example.ts" region="usage" /%}

The region registers the two providers the service needs and wraps them in a module that imports `HttpModule`. `PaypalConfig` is the one config class in this family with a positional constructor, so it is built with `new` rather than passed as an object literal. The comments on the arguments carry the part that is easy to get wrong: `apiUrl` is your own API base, not a PayPal host.

Its spec compiles that module with a stubbed `HttpService` and asserts four things. `PaypalService` resolves, so the three constructor dependencies are satisfiable from these providers alone. The `PaypalConfig` read back out of the injector equals the one the example built, so the value provider is the injectable rather than a copy. The HTTP stub recorded no call. And every mocked SDK entry point, including `configure`, is still untouched after the service has been resolved, which is the offline guarantee stated above: nothing is sent while the provider is being registered.

## API

### `PaypalConfig`

A plain class with a positional constructor, used as both the injection token and the type. `new PaypalConfig(clientId, clientSecret, currencyCode, returnUrl, apiUrl, cancelUrl, test?)`.

| Position | Field          | Type      | What it does                                                                                                                                                                       |
| -------- | -------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1        | `clientId`     | `string`  | Sent as `client_id` with every SDK call.                                                                                                                                           |
| 2        | `clientSecret` | `string`  | Sent as `client_secret` with every SDK call.                                                                                                                                       |
| 3        | `currencyCode` | `string`  | Currency of the item, the total and the refund amount.                                                                                                                             |
| 4        | `returnUrl`    | `string`  | Not read by this service, which builds its return url from `apiUrl` instead. The PayPal controller in the transaction shell redirects a buyer there once the payment is confirmed. |
| 5        | `apiUrl`       | `string`  | Your own API base. `create` sends `return_url` as `apiUrl` plus `paypal/{id}/confirm`, which is the route the PayPal controller serves, so keep the trailing slash.                |
| 6        | `cancelUrl`    | `string`  | Sent as `cancel_url`, where PayPal sends a buyer who abandons the payment.                                                                                                         |
| 7        | `test`         | `boolean` | `true` runs every call in `sandbox` mode, `false` or absent in `live`. Nothing else changes.                                                                                       |

### `PaypalService`

| Method                                              | Returns                                             | What it does                                                                                                                                                     |
| --------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `create(obj)`                                       | `Promise<{ orderId: string; redirectUrl: string }>` | Builds a one-item sale payment with `price` and `total` as `obj.amount / 100`, then returns the payment id and the `approval_url` link the buyer is sent to.     |
| `confirm(payerId, paymentId, amount, externalData)` | `Promise<any>`                                      | Executes an approved payment. Not part of the shared contract. `amount` is passed through as the total, already in major units.                                  |
| `getStatus<T>(trans)`                               | `Promise<{ status: TransStatus; data: any }>`       | Reads the payment by the order id stored on the `started` history entry and maps its `state`.                                                                    |
| `refund(trans, comment)`                            | `Promise<any>`                                      | Refunds `trans.amount / 100` with `comment` as the description. Throws `Paypal transaction ID not found for refund` when no sale id can be found on the history. |

`create` takes `{ id, name, amount, firstName?, lastName?, email?, contactPhone?, clientIp, data }`. The shared `ITransPaymentSingleService` also declares a required `options`, which this implementation omits, so an `options` value passed by a caller is ignored here while PayU and Paynow read it.

`refund` does not use the order id it looks up. It walks the history for a `completed` entry carrying `customData.transactions[0].related_resources[0].sale.id` and refunds that sale, so a transaction that was never confirmed through this service cannot be refunded through it either.

### Choosing the credentials

| Path            | How it is registered                                                         | When it wins                                                                     |
| --------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Static config   | A `PaypalConfig` value provider, as in the example.                          | Whenever no config provider resolves.                                            |
| Per transaction | A class implementing `IPaypalConfigProvider` under `PAYPAL_CONFIG_PROVIDER`. | Whenever the lookup succeeds. Its `get(data)` receives the transaction's `data`. |

`PAYPAL_CONFIG_PROVIDER` is a string constant and `IPaypalConfigProvider` is an abstract class with a single `get(data: any): Promise<PaypalConfig>`. Every public method resolves the config first, through `moduleRef.get(PAYPAL_CONFIG_PROVIDER, { strict: false })` inside a `try`. The non-strict lookup means the provider can live in any module of the application. A missing token throws, the `catch` logs `PayPal config provider not found` at warning level, and the statically injected config is used instead, so an application on the static path logs that warning on every call.

### External calls

| Method      | SDK call                 | Environment                                                     |
| ----------- | ------------------------ | --------------------------------------------------------------- |
| `create`    | `paypal.payment.create`  | `{ mode: test ? 'sandbox' : 'live', client_id, client_secret }` |
| `confirm`   | `paypal.payment.execute` | the same, rebuilt per call                                      |
| `getStatus` | `paypal.payment.get`     | the same, rebuilt per call                                      |
| `refund`    | `paypal.sale.refund`     | the same, rebuilt per call                                      |

There is no base url to configure. The private helper that returns the sandbox and live REST hosts is dead code, kept from an earlier HTTP implementation.

### Status mapping

`getStatus` uppercases the PayPal `state` before matching it.

| PayPal state  | `TransStatus`                            |
| ------------- | ---------------------------------------- |
| `COMPLETED`   | `completed`                              |
| `APPROVED`    | `completed`                              |
| `CREATED`     | `pending`                                |
| `SAVED`       | `pending`                                |
| `VOIDED`      | `canceled`                               |
| anything else | the uppercased state, returned unchanged |

The default branch returns a value that is not a `TransStatus`, so a state PayPal adds later reaches the domain as itself rather than as an error.

## Related packages

- [`@smartsoft001/trans-domain`](/docs/packages/trans-domain) declares `ITransPaymentSingleService`, `Trans` and `TransStatus`, and holds the rules that decide when each method is called.
- [`@smartsoft001/trans-shell-nestjs`](/docs/packages/trans-shell-nestjs) registers this service from a `paypalConfig` key and serves the `paypal/{id}/confirm` route that `apiUrl` points at.
- [`@smartsoft001/trans-shell-app-services`](/docs/packages/trans-shell-app-services) is what selects this provider, by the `system` of the transaction.
- [`@smartsoft001/payu`](/docs/packages/payu), [`@smartsoft001/paynow`](/docs/packages/paynow) and [`@smartsoft001/revolut`](/docs/packages/revolut) implement the same contract for the other three providers.
