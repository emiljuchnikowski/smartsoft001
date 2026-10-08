---
title: '@smartsoft001/paynow'
section: Packages
order: 27
package: '@smartsoft001/paynow'
nextjs:
  metadata:
    title: '@smartsoft001/paynow'
    description: 'PaynowService: payment creation, status lookup and refunds against the Paynow API, with HMAC-SHA256 request signing and per-request idempotency keys.'
---

The Paynow end of a transaction: three calls against the payments API, each mutating one signed locally and sent with its own idempotency key. {% .lead %}

---

## Install

```bash
npm install @smartsoft001/paynow @smartsoft001/trans-domain @smartsoft001/utils @nestjs/axios crypto-js
```

The manifest declares [`@smartsoft001/trans-domain`](/docs/packages/trans-domain) and [`@smartsoft001/utils`](/docs/packages/utils) as peer dependencies, pinned to its own version. Every request goes through the `HttpService` of `@nestjs/axios`, `crypto-js` computes the signature, `GuidService` from [`@smartsoft001/utils`](/docs/packages/utils) produces the idempotency key, `@nestjs/common` provides `@Injectable` and `Logger`, and `@nestjs/core` provides `ModuleRef`. The imports from [`@smartsoft001/trans-domain`](/docs/packages/trans-domain) are used only as types.

## What it is

One of the four payment providers behind [`@smartsoft001/trans-shell-app-services`](/docs/packages/trans-shell-app-services). The service implements `ITransPaymentSingleService`, the contract the transaction domain calls whenever a transaction names `paynow` as its system, and it implements it in full: `create`, `getStatus` and `refund`, with no extra methods.

The package ships no NestJS module and no `forRoot`. An application normally gets the service from `TransShellNestjsModule.forRoot({ paynowConfig })`, which registers `PaynowConfig` as a value provider and `PaynowService` as a class provider, and only when that key is present. Register the two providers by hand, as the example does, to use the Paynow calls without the rest of the transaction shell.

{% callout type="note" title="The non-core module provides it without exporting it" %}
`TransShellNestjsModule.forRoot` lists `PaynowConfig` and `PaynowService` among its providers but not among its exports, unlike PayU, PayPal and Revolut. The transaction service inside the module injects Paynow normally, so payments work; a module that imports the transaction shell and tries to inject `PaynowService` itself does not resolve it. `TransShellNestjsCoreModule.forRoot` exports both.
{% /callout %}

What sets this provider apart from the other three is that authentication is split in two. The api key travels with the request as a header, while the signature key never leaves the process: the service computes an HMAC-SHA256 digest of the serialised body locally and sends only the digest. Every mutating request also carries a freshly generated idempotency key, so a retried create or refund is recognised by Paynow as the same operation rather than as a second one.

## Usage

{% snippet file="node/src/paynow/paynow-service.example.ts" region="usage" /%}

The region registers the two providers the service needs and wraps them in a module that imports `HttpModule`. `PaynowConfig` declares its required fields without initialisers, so the config is supplied as an object literal to `useValue` rather than through `new PaynowConfig()`, with `satisfies` keeping the literal checked against the class.

Its spec compiles that module with a stubbed `HttpService` that records a call and then throws. `PaynowService` resolves, so the three constructor dependencies are satisfiable from these providers alone. The `PaynowConfig` read back out of the injector equals the literal the example wrote, including `test: true` and both keys. And the stub recorded nothing after the service had been resolved, so registering the provider signs nothing and sends nothing. Two more specs cover the `failures` region shown under [Failures](#failures): one compiles the module against an HTTP stub that fails with a 401 carrying the `Api-Key` header, and checks that `create` rejects with `Paynow payment creation failed (HTTP 401)`, that neither the rejection nor the logged line contains the key, and that `paynowFailureStatus` reads `401` back; the other checks that a message without the suffix yields no status.

## API

### `PaynowConfig`

A plain class with no decorators, used as both the injection token and the type.

| Field             | Type      | What it does                                                                                                 |
| ----------------- | --------- | ------------------------------------------------------------------------------------------------------------ |
| `apiKey`          | `string`  | Sent as the `Api-Key` header on all three requests.                                                          |
| `apiSignatureKey` | `string`  | The HMAC key. Never sent; only the digest it produces is.                                                    |
| `continueUrl`     | `string`  | Where Paynow sends the buyer after payment.                                                                  |
| `test`            | `boolean` | `true` sends every request to `https://api.sandbox.paynow.pl`, `false` or absent to `https://api.paynow.pl`. |

### `PaynowService`

| Method                   | Returns                                             | What it does                                                                                                                                |
| ------------------------ | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `create(obj)`            | `Promise<{ orderId: string; redirectUrl: string }>` | Creates a payment and returns `redirectUrl` from the answer with `paymentId` as the order id.                                               |
| `getStatus<T>(trans)`    | `Promise<{ status: TransStatus; data: any }>`       | Reads the status of the payment whose id is stored on the `started` history entry, and returns the whole answer body as `data`.             |
| `refund(trans, comment)` | `Promise<any>`                                      | Refunds `trans.amount` in full and resolves the Paynow response body. `comment` is accepted but not sent: the body carries the amount only. |

`create` takes `{ id, name, amount, firstName?, lastName?, email?, contactPhone?, clientIp, data, options? }`, which is the shared `ITransPaymentSingleService` shape with `options` made optional. The payment it builds sends `id` as `externalId` and `name` as the description, hard-codes the currency to `PLN`, so `amount` is read as grosze and sent unchanged, and always includes a `buyer` object: the email alone when nothing else is known, and the phone, first name and last name alongside it when any of them is present.

### Request signing

| Header            | Value                                                                                  | On which requests     |
| ----------------- | -------------------------------------------------------------------------------------- | --------------------- |
| `Api-Key`         | `config.apiKey`                                                                        | all three             |
| `Idempotency-Key` | A fresh `GuidService.create()`                                                         | `create` and `refund` |
| `Signature`       | Base64 of `HmacSHA256(JSON.stringify(body), config.apiSignatureKey)`, computed locally | `create` and `refund` |

The digest is taken over exactly the string that is sent, so the body must not be reserialised or reordered between signing and sending. `getStatus` sends neither header, because it has no body to sign.

### Choosing the credentials

| Path            | How it is registered                                                         | When it wins                                                                     |
| --------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Static config   | A `PaynowConfig` value provider, as in the example.                          | Whenever no config provider resolves.                                            |
| Per transaction | A class implementing `IPaynowConfigProvider` under `PAYNOW_CONFIG_PROVIDER`. | Whenever the lookup succeeds. Its `get(data)` receives the transaction's `data`. |

`PAYNOW_CONFIG_PROVIDER` is a string constant and `IPaynowConfigProvider` is an abstract class with a single `get(data: any): Promise<PaynowConfig>`. Every public method resolves the config first, through `moduleRef.get(PAYNOW_CONFIG_PROVIDER, { strict: false })` inside a `try`, so the provider can live in any module of the application. A missing token throws, the `catch` logs `Paynow config provider not found` at warning level, and the statically injected config is used instead.

### External calls

Base url is `https://api.sandbox.paynow.pl` when `test` is true and `https://api.paynow.pl` otherwise.

| Method      | Request                                     | Notes                                                      |
| ----------- | ------------------------------------------- | ---------------------------------------------------------- |
| `create`    | `POST {base}/v1/payments`                   | `maxRedirects: 0`, signed, with an idempotency key.        |
| `getStatus` | `GET {base}/v1/payments/{orderId}/status`   | `orderId` comes from the `started` history entry.          |
| `refund`    | `POST {base}/v1/payments/{orderId}/refunds` | Body is `{ amount: trans.amount }`, signed and idempotent. |

### Failures

A failed HTTP call never leaves the service as the raw axios error. That error keeps the request it was made with, and every Paynow request carries the `Api-Key` header. So each method catches it, logs one line at error level under the `PaynowService` context, and throws a new `Error` that has no `cause`, `config` or `response`.

| Failing call | Message                                          |
| ------------ | ------------------------------------------------ |
| `create`     | `Paynow payment creation failed (HTTP {status})` |
| `getStatus`  | `Paynow status lookup failed (HTTP {status})`    |
| `refund`     | `Paynow refund failed (HTTP {status})`           |

The logged line and the thrown message are the same. The ` (HTTP {status})` suffix is there only when Paynow answered, so a rejected key (`401`) and a Paynow outage (`5xx`) stay distinguishable, and a network failure with no answer ends at `failed`. The Paynow response body is not kept. Look the payment up in the Paynow panel by its id when you need the details. The signature key was never on the wire, and it is not in the failure either.

{% snippet file="node/src/paynow/paynow-service.example.ts" region="failures" /%}

When the transaction domain records one of these failures through `setError`, the history entry is `{ name: 'Error', message: <context> }` with no `status`: `setError` stores its own context message rather than the error's, and reads the status only from `response.status`, which this error no longer has. The status of a Paynow failure is in the logged line.

{% callout type="warning" title="Upgrading from versions that rethrew the axios error" %}
Code that read `e.response.status` or `e.response.data` from an error thrown by `PaynowService` gets `undefined` now. Read the status from the message instead, as `paynowFailureStatus` does, or log the message as it is. For the same reason, the `error` history entries `setError` writes for these failures no longer carry a `status`. Nothing else about the calls has changed.
{% /callout %}

### Status mapping

| Paynow status | `TransStatus`                         |
| ------------- | ------------------------------------- |
| `CONFIRMED`   | `completed`                           |
| `REJECTED`    | `canceled`                            |
| `PENDING`     | `pending`                             |
| anything else | the Paynow status, returned unchanged |

The match is case-sensitive and there is no default of `pending`, so a status such as `NEW`, `EXPIRED` or `ERROR` reaches the domain as itself.

## Related packages

- [`@smartsoft001/trans-domain`](/docs/packages/trans-domain) declares `ITransPaymentSingleService`, `Trans` and `TransStatus`, and holds the rules that decide when each method is called.
- [`@smartsoft001/trans-shell-nestjs`](/docs/packages/trans-shell-nestjs) registers this service from a `paynowConfig` key and serves the `POST /paynow` webhook Paynow reports to.
- [`@smartsoft001/trans-shell-app-services`](/docs/packages/trans-shell-app-services) is what selects this provider, by the `system` of the transaction.
- [`@smartsoft001/utils`](/docs/packages/utils) supplies the `GuidService` behind every idempotency key.
- [`@smartsoft001/paypal`](/docs/packages/paypal), [`@smartsoft001/payu`](/docs/packages/payu) and [`@smartsoft001/revolut`](/docs/packages/revolut) implement the same contract for the other three providers.
