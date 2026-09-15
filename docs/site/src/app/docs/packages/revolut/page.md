---
title: '@smartsoft001/revolut'
section: Packages
order: 24
package: '@smartsoft001/revolut'
nextjs:
  metadata:
    title: '@smartsoft001/revolut'
    description: 'RevolutService: order creation and status lookup against the Revolut Merchant API, pinned to version 2024-09-01, with an optional config and no refund support.'
---

The Revolut end of a transaction: two calls against the Merchant orders API, pinned to one API version, with refunds deliberately unsupported. {% .lead %}

---

## Install

```bash
npm install @smartsoft001/revolut @smartsoft001/trans-domain @nestjs/axios
```

The manifest declares neither dependencies nor peer dependencies. Both requests go through the `HttpService` of `@nestjs/axios`, `@nestjs/common` provides `@Injectable`, `@Optional` and `Logger`, and `@nestjs/core` provides `ModuleRef`. The imports from [`@smartsoft001/trans-domain`](/docs/packages/trans-domain) are used only as types, so they are a build-time requirement rather than a runtime one.

## What it is

One of the four payment providers behind [`@smartsoft001/trans-shell-app-services`](/docs/packages/trans-shell-app-services). The service implements `ITransPaymentSingleService`, the contract the transaction domain calls whenever a transaction names `revolut` as its system, but it differs from the other three in three visible ways: `create` answers with `responseData` instead of a `redirectUrl`, `refund` always rejects, and the config is injected with `@Optional()`.

The package ships no NestJS module and no `forRoot`. An application normally gets the service from `TransShellNestjsModule.forRoot({ revolutConfig })`, which registers `RevolutConfig` as a value provider and `RevolutService` as a class provider, and only when that key is present. Register the two providers by hand, as the example does, to use the Revolut calls without the rest of the transaction shell.

Authentication is a single merchant secret key sent as a bearer token, with no token exchange to perform, which makes this the smallest configuration of the four: one string and an optional flag.

{% callout type="warning" title="The core module exports it without providing it" %}
`TransShellNestjsCoreModule.forRoot` lists `RevolutConfig` and `RevolutService` in its exports but has no branch that provides them, unlike its `payuConfig`, `paypalConfig` and `paynowConfig` branches. Passing a `revolutConfig` to the core module therefore does not give an application a working Revolut provider. `TransShellNestjsModule.forRoot` both provides and exports them.
{% /callout %}

## Usage

{% snippet file="node/src/revolut/revolut-service.example.ts" region="usage" /%}

The region registers the two providers and wraps them in a module that imports `HttpModule`. `RevolutConfig` declares `token` without an initialiser, so the config is supplied as an object literal to `useValue` rather than through `new RevolutConfig()`, with `satisfies` keeping the literal checked against the class.

Its spec compiles that module with a stubbed `HttpService` that records a call and then throws, and checks four things. `RevolutService` resolves. The `RevolutConfig` read back out of the injector equals the literal the example wrote, including `test: true`. The stub recorded nothing after the service had been resolved, so the merchant key never left the process. And a second testing module, built from the service and the HTTP stub alone, still resolves the service, which is the `@Optional()` config in action: the missing provider is not an error until a method needs the token.

## API

### `RevolutConfig`

A plain class with no decorators, used as both the injection token and the type.

| Field   | Type      | What it does                                                                                                               |
| ------- | --------- | -------------------------------------------------------------------------------------------------------------------------- |
| `token` | `string`  | The merchant secret API key, sent as `Authorization: Bearer {token}`.                                                      |
| `test`  | `boolean` | `true` sends both requests to `https://sandbox-merchant.revolut.com`, `false` or absent to `https://merchant.revolut.com`. |

`REVOLUT_API_VERSION` is exported alongside it as the string `2024-09-01` and is sent as the `Revolut-Api-Version` header on both requests. It is a constant, not a setting: changing the version means changing the package.

### `RevolutService`

| Method                   | Returns                                           | What it does                                                                                                    |
| ------------------------ | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `create(obj)`            | `Promise<{ orderId: string; responseData: any }>` | Creates an order and returns the whole answer as `responseData`, with `token` from that answer as the order id. |
| `getStatus<T>(trans)`    | `Promise<{ status: TransStatus; data: any }>`     | Reads the order by the id stored on the `started` history entry and maps the `state` of the answer.             |
| `refund(trans, comment)` | `Promise<any>`, always rejected                   | Rejects with the string `Revolut does not support refund`. It sends no request and does not read the config.    |

`create` takes `{ id, name, amount, firstName?, lastName?, email?, contactPhone?, clientIp, data }`. The shared `ITransPaymentSingleService` also declares a required `options`, which this implementation omits, so an `options` value passed by a caller is ignored here while PayU and Paynow read it. The order it builds sends `id` as `merchant_order_ext_ref` and `name` as the description, hard-codes the currency to `PLN` and `capture_mode` to `automatic`, so `amount` is read as minor units and sent unchanged, and adds a `customer` object only when at least one of the email, phone, first name and last name is present, joining the names into `full_name`.

{% callout type="note" title="create returns no redirect url, and the two ids differ" %}
The shared contract allows either a `redirectUrl` or a `responseData`, and this is the implementation that takes the second option: the Revolut answer is handed back whole, and a caller builds the checkout from it. That matters for the follow-up call, because the two methods use different identifiers. `create` reports `response.data.token` as the `orderId`, which is what the transaction is stored under, while `getStatus` reads the order id from `historyItem.data.responseData.id` instead. A history entry that kept only the order id, and not the response body, cannot be refreshed.
{% /callout %}

### Choosing the credentials

| Path            | How it is registered                                                           | When it wins                                                                     |
| --------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| Static config   | A `RevolutConfig` value provider, as in the example. Optional at construction. | Whenever no config provider resolves.                                            |
| Per transaction | A class implementing `IRevolutConfigProvider` under `REVOLUT_CONFIG_PROVIDER`. | Whenever the lookup succeeds. Its `get(data)` receives the transaction's `data`. |

`REVOLUT_CONFIG_PROVIDER` is a string constant and `IRevolutConfigProvider` is an abstract class with a single `get(data: any): Promise<RevolutConfig>`. Both public methods resolve the config first, through `moduleRef.get(REVOLUT_CONFIG_PROVIDER, { strict: false })` inside a `try`, so the provider can live in any module of the application. A missing token throws, the `catch` logs `Revolut config provider not found` at warning level, and the injected config is used instead. Because that injection is `@Optional()`, an application with neither path registered constructs the service successfully and fails only inside the first call, when the base url is read off `undefined`.

### External calls

Base url is `https://sandbox-merchant.revolut.com` when `test` is true and `https://merchant.revolut.com` otherwise. Both requests carry `Authorization: Bearer {token}`, `Revolut-Api-Version: 2024-09-01`, `Content-Type: application/json` and `Accept: application/json`.

| Method      | Request                      | Notes                                                                        |
| ----------- | ---------------------------- | ---------------------------------------------------------------------------- |
| `create`    | `POST {base}/api/orders`     | `maxRedirects: 0`.                                                           |
| `getStatus` | `GET {base}/api/orders/{id}` | `{id}` is `responseData.id` from the `started` history entry, not `orderId`. |
| `refund`    | none                         | Rejects before doing anything.                                               |

### Status mapping

`getStatus` matches the `state` of the order, which Revolut reports in lower case.

| Revolut state | `TransStatus`                         |
| ------------- | ------------------------------------- |
| `completed`   | `completed`                           |
| `authorised`  | `completed`                           |
| `pending`     | `pending`                             |
| `processing`  | `pending`                             |
| `cancelled`   | `canceled`                            |
| `failed`      | `canceled`                            |
| anything else | the Revolut state, returned unchanged |

Note the two spellings. Revolut reports `cancelled`, the domain stores `canceled`, and the mapping is the only place the difference is handled.

## Related packages

- [`@smartsoft001/trans-domain`](/docs/packages/trans-domain) declares `ITransPaymentSingleService`, `Trans` and `TransStatus`, and holds the rules that decide when each method is called, including the refund this provider rejects.
- [`@smartsoft001/trans-shell-nestjs`](/docs/packages/trans-shell-nestjs) registers this service from a `revolutConfig` key. It serves no Revolut webhook, so a Revolut transaction is refreshed through the generic refresh route.
- [`@smartsoft001/trans-shell-app-services`](/docs/packages/trans-shell-app-services) is what selects this provider, by the `system` of the transaction.
- [`@smartsoft001/paypal`](/docs/packages/paypal), [`@smartsoft001/payu`](/docs/packages/payu) and [`@smartsoft001/paynow`](/docs/packages/paynow) implement the same contract for the other three providers.
