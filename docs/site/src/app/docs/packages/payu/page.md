---
title: '@smartsoft001/payu'
section: Packages
order: 22
package: '@smartsoft001/payu'
nextjs:
  metadata:
    title: '@smartsoft001/payu'
    description: 'PayuService: order creation, status lookup and refunds against the PayU REST API v2_1, with an OAuth token fetched per call and credentials resolved per transaction.'
---

The PayU end of a transaction: three calls against the REST API v2_1, each one preceded by its own OAuth token request. {% .lead %}

---

## Install

```bash
npm install @smartsoft001/payu @smartsoft001/trans-domain @nestjs/axios
```

The manifest declares neither dependencies nor peer dependencies. Every request goes through the `HttpService` of `@nestjs/axios`, `@nestjs/common` provides `@Injectable` and `Logger`, and `@nestjs/core` provides `ModuleRef`. The imports from [`@smartsoft001/trans-domain`](/docs/packages/trans-domain) are used only as types, so they are a build-time requirement rather than a runtime one.

## What it is

One of the four payment providers behind [`@smartsoft001/trans-shell-app-services`](/docs/packages/trans-shell-app-services). The service implements `ITransPaymentSingleService`, the contract the transaction domain calls whenever a transaction names `payu` as its system, and it implements it in full: `create`, `getStatus` and `refund`, with no extra methods.

The package ships no NestJS module and no `forRoot`. An application normally gets the service from `TransShellNestjsModule.forRoot({ payuConfig })`, which registers `PayuConfig` as a value provider and `PayuService` as a class provider, and only when that key is present. Register the two providers by hand, as the example does, to use the PayU calls without the rest of the transaction shell.

Authentication is per call rather than per process. Each of the three methods first posts the client credentials to the OAuth endpoint and uses the access token it gets back exactly once. Nothing is cached, so a config provider can change merchants between two transactions without any state to invalidate.

## Usage

{% snippet file="node/src/payu/payu-service.example.ts" region="usage" /%}

The region registers the two providers the service needs and wraps them in a module that imports `HttpModule`. `PayuConfig` declares its required fields without initialisers, so the config is supplied as an object literal to `useValue` rather than through `new PayuConfig()`, with `satisfies` keeping the literal checked against the class.

Its spec compiles that module with a stubbed `HttpService` that records a call and then throws. `PayuService` resolves, so the three constructor dependencies are satisfiable from these providers alone. The `PayuConfig` read back out of the injector equals the literal the example wrote, including `test: true`. And the stub recorded nothing after the service had been resolved, which proves the sandbox credentials never left the process: no OAuth token is fetched until a method is called.

## API

### `PayuConfig`

A plain class with no decorators, used as both the injection token and the type.

| Field          | Type      | What it does                                                                                                 |
| -------------- | --------- | ------------------------------------------------------------------------------------------------------------ |
| `clientId`     | `string`  | The OAuth client id, sent in the `grant_type=client_credentials` body.                                       |
| `clientSecret` | `string`  | The OAuth client secret, sent in the same body.                                                              |
| `posId`        | `string`  | Sent as `merchantPosId` on every created order.                                                              |
| `notifyUrl`    | `string`  | Where PayU posts its notification. Point it at the `POST /payu` webhook of the transaction shell.            |
| `continueUrl`  | `string`  | Where PayU sends the buyer after payment.                                                                    |
| `test`         | `boolean` | `true` sends every request to `https://secure.snd.payu.com`, `false` or absent to `https://secure.payu.com`. |

### `PayuService`

| Method                   | Returns                                             | What it does                                                                                                                              |
| ------------------------ | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `create(obj)`            | `Promise<{ orderId: string; redirectUrl: string }>` | Creates an order with `maxRedirects: 0` and reads the redirect out of the 302 answer. See the callout below.                              |
| `getStatus<T>(trans)`    | `Promise<{ status: TransStatus; data: any }>`       | Reads the order by the id stored on the `started` history entry, maps its status, and returns `null` when the answer carries no `orders`. |
| `refund(trans, comment)` | `Promise<any>`                                      | Posts a refund for the whole order with `comment` as its description, and resolves the PayU response body.                                |

`create` takes `{ id, name, amount, firstName?, lastName?, email?, contactPhone?, clientIp, data, options? }`, which is the shared `ITransPaymentSingleService` shape with `options` made optional. Three things about the order it builds are worth knowing. The currency is hard-coded to `PLN`, so `amount` is read as grosze and sent unchanged as `totalAmount`. A `buyer` block is added only when at least one of the email, phone, first name and last name is present. And `options.payMethod`, when present, becomes `payMethods.payMethod`, which is how a single payment method is preselected for the buyer.

{% callout type="warning" title="create resolves to null on a 2xx answer" %}
The order request is sent with `maxRedirects: 0`, and PayU answers a successful creation with a 302 to the payment page. Axios treats that as an error, so the useful result is assembled in the `catch` branch, from `e.response.data.redirectUri` and `e.response.data.orderId`. The `try` branch, reached when the answer is a 2xx, returns `null`. A caller that reaches PayU through the transaction domain never sees this, because the domain only stores what it gets, but a caller using the service directly should treat `null` as a failure to obtain a redirect rather than as a success.
{% /callout %}

### Choosing the credentials

| Path            | How it is registered                                                     | When it wins                                                                     |
| --------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| Static config   | A `PayuConfig` value provider, as in the example.                        | Whenever no config provider resolves.                                            |
| Per transaction | A class implementing `IPayuConfigProvider` under `PAYU_CONFIG_PROVIDER`. | Whenever the lookup succeeds. Its `get(data)` receives the transaction's `data`. |

`PAYU_CONFIG_PROVIDER` is a string constant and `IPayuConfigProvider` is an abstract class with a single `get(data: any): Promise<PayuConfig>`. Every public method resolves the config first, through `moduleRef.get(PAYU_CONFIG_PROVIDER, { strict: false })` inside a `try`, so the provider can live in any module of the application. A missing token throws and the statically injected config is used instead.

{% callout type="note" title="The fallback warning names the wrong provider" %}
When no config provider is registered, the `catch` in `PayuService` logs `PayPal config provider not found`, under the `PayuService` context. The message was copied from the PayPal implementation and never adjusted. An application on the static config path sees it on every call, and it says nothing about PayPal.
{% /callout %}

### External calls

Base url is `https://secure.snd.payu.com` when `test` is true and `https://secure.payu.com` otherwise.

| Method      | Request                                        | Notes                                                                      |
| ----------- | ---------------------------------------------- | -------------------------------------------------------------------------- |
| all three   | `POST {base}/pl/standard/user/oauth/authorize` | `grant_type=client_credentials` with the client id and secret in the body. |
| `create`    | `POST {base}/api/v2_1/orders`                  | `maxRedirects: 0`, bearer token from the call above.                       |
| `getStatus` | `GET {base}/api/v2_1/orders/{orderId}`         | `orderId` comes from the `started` history entry.                          |
| `refund`    | `POST {base}/api/v2_1/orders/{orderId}`        | Body is `{ refund: { description: comment } }`.                            |

### Status mapping

| PayU status   | `TransStatus`                       |
| ------------- | ----------------------------------- |
| `COMPLETED`   | `completed`                         |
| `CANCELED`    | `canceled`                          |
| `PENDING`     | `pending`                           |
| anything else | the PayU status, returned unchanged |

The match is case-sensitive and there is no default of `pending`, so a status such as `WAITING_FOR_CONFIRMATION` reaches the domain as itself.

## Related packages

- [`@smartsoft001/trans-domain`](/docs/packages/trans-domain) declares `ITransPaymentSingleService`, `Trans` and `TransStatus`, and holds the rules that decide when each method is called.
- [`@smartsoft001/trans-shell-nestjs`](/docs/packages/trans-shell-nestjs) registers this service from a `payuConfig` key and serves the `POST /payu` webhook that `notifyUrl` points at.
- [`@smartsoft001/trans-shell-app-services`](/docs/packages/trans-shell-app-services) is what selects this provider, by the `system` of the transaction.
- [`@smartsoft001/paypal`](/docs/packages/paypal), [`@smartsoft001/paynow`](/docs/packages/paynow) and [`@smartsoft001/revolut`](/docs/packages/revolut) implement the same contract for the other three providers.
