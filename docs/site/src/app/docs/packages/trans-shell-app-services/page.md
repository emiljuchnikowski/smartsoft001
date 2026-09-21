---
title: '@smartsoft001/trans-shell-app-services'
section: Packages
order: 22
package: '@smartsoft001/trans-shell-app-services'
nextjs:
  metadata:
    title: '@smartsoft001/trans-shell-app-services'
    description: 'TransService: the application service that picks a payment provider by name, resolves the internal service and delegates to the three trans domain services.'
---

The one service an application calls: it chooses the payment provider, decides who your back end is, and hands the work to the domain. {% .lead %}

---

## Install

```bash
npm install @smartsoft001/trans-shell-app-services @smartsoft001/trans-domain @smartsoft001/domain-core @smartsoft001/payu @smartsoft001/paypal @smartsoft001/paynow @smartsoft001/revolut
```

The manifest declares the six workspace packages above as peer dependencies, pinned to its own version. All four payment packages are imported unconditionally, as constructor parameter types, so all four have to be installed even in an application that enables only one provider. On top of them it needs `@nestjs/common` for `@Injectable` and `@Optional`, `@nestjs/core` for `ModuleRef` and `@nestjs/axios` for `HttpService`.

{% callout type="note" title="Two ways in" %}
Almost every application gets this service by importing [`@smartsoft001/trans-shell-nestjs`](/docs/packages/trans-shell-nestjs), which provides it and its collaborators. Constructing it by hand, as the example below does, is what a test or a non-Nest process would do, and it is the shortest way to see exactly what it depends on.
{% /callout %}

## What it is

The domain services in [`@smartsoft001/trans-domain`](/docs/packages/trans-domain) deliberately know nothing about who your payment provider is or where your back end lives. Both arrive as arguments to every call. Something has to supply them, and this package is that something.

Two decisions make up almost the whole service. The first is which provider handles a transaction: a private getter builds the map `{ payu, paypal, paynow, revolut }` out of four `@Optional()` injections, and the domain indexes it with `trans.system`. A provider that was never registered is simply `undefined` in the map, and a transaction naming it fails when the domain reaches for it.

The second is who your back end is. The service tries to resolve a provider registered under `TRANS_TOKEN_INTERNAL_SERVICE`, non-strictly, so it can come from anywhere in the application. If that lookup throws, for any reason, a built-in HTTP implementation takes over: it posts a new transaction to `TransConfig.internalApiUrl` and puts a refreshed one to that url plus the id. When `internalApiUrl` is empty, that implementation short-circuits to a resolved promise and makes no request at all, which is what keeps a development setup, and the example below, entirely offline.

## Usage

{% snippet file="node/src/trans/trans-service.example.ts" region="usage" /%}

The region constructs the service by hand and, in doing so, names every collaborator. The repository is the array-backed fake from the creator example. The three domain services are real, built over that same repository. The `TransConfig` carries an empty `internalApiUrl`, which is what turns the internal calls off. The `ModuleRef` stub throws from `get`, reproducing the ordinary case where no custom internal service is registered. `OfflineHttpService` throws from `post` and `put` and records the call, so an unexpected request would fail loudly instead of silently reaching the network. `StubPayuService` stands in for the one provider this example enables; the other three are left undefined, exactly as the `@Optional()` injections would be.

Its spec runs one `create` and checks five things. The call returns `ORD-2`, the order id the stub issued, so the request reached the provider through the map. The stub recorded the order name, so the request was routed by `system` rather than by position. The HTTP stub recorded nothing, which is the empty `internalApiUrl` short-circuit working. The stored transaction ends in `started`. And reading it back through `getById` returns the record carrying `ORD-2` as its `externalId`.

## API

### Constructor

`new TransService(moduleRef, creatorService, refresherService, refundService, httpService, config, repository, payuService?, paynowService?, paypalService?, revolutService?)`. In an application every argument comes from the Nest injector.

| Position | Parameter          | Type                            | Notes                                                                      |
| -------- | ------------------ | ------------------------------- | -------------------------------------------------------------------------- |
| 1        | `moduleRef`        | `ModuleRef`                     | Used once, to look for a custom internal service.                          |
| 2        | `creatorService`   | `CreatorService<any>`           | Backs `create`.                                                            |
| 3        | `refresherService` | `RefresherService<any>`         | Backs `refresh`.                                                           |
| 4        | `refundService`    | `RefundService<any>`            | Backs `refund`.                                                            |
| 5        | `httpService`      | `HttpService`                   | Only used by the built-in internal service, and only with a non-empty url. |
| 6        | `config`           | `TransConfig`                   | Read for `internalApiUrl`.                                                 |
| 7        | `repository`       | `IItemRepository<Trans<any>>`   | Used directly by `getById`.                                                |
| 8        | `payuService`      | `PayuService`, `@Optional()`    | Present only when the module was given a `payuConfig`.                     |
| 9        | `paynowService`    | `PaynowService`, `@Optional()`  | Note the order: Paynow comes before Paypal.                                |
| 10       | `paypalService`    | `PaypalService`, `@Optional()`  |                                                                            |
| 11       | `revolutService`   | `RevolutService`, `@Optional()` |                                                                            |

The four optional positions are easy to get wrong when constructing the service by hand, because the order is payu, paynow, paypal, revolut, while the map the domain sees is keyed by name and unaffected by it.

### Methods

| Method                                | Returns                                                                  | What it does                                                                                                                                  |
| ------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `create<T>(ops: ITransCreate<T>)`     | `Promise<{ orderId: string; redirectUrl?: string; responseData?: any }>` | Delegates to `CreatorService.create` with the resolved internal service and the provider map.                                                 |
| `refresh(transId, data = {})`         | `Promise<void>`                                                          | Delegates to `RefresherService.refresh`. `transId` is the **provider's** order id, and `data` is stored on the history entry as `customData`. |
| `refund(transId, comment = 'Refund')` | `Promise<void>`                                                          | Delegates to `RefundService.refund`. Here `transId` is the local id.                                                                          |
| `getById(id)`                         | `Promise<Trans<any>>`                                                    | Reads straight from the repository, with no permission check of any kind.                                                                     |

None of the four validates anything itself. Every rule, including the six validation messages and the `completed`-only refund, belongs to the domain and is documented with it.

### The internal service

`TRANS_TOKEN_INTERNAL_SERVICE` is a string constant exported by the package. Register a provider under it, anywhere in the application, and every call made by this service uses your implementation of `ITransInternalService` instead of the built-in one. The lookup is `moduleRef.get(TRANS_TOKEN_INTERNAL_SERVICE, { strict: false })` inside a `try`, so a missing token falls back silently, and so does a provider that exists but throws while being resolved.

The built-in implementation behaves as follows.

| Call             | With an empty `internalApiUrl`                             | With a url                                                                |
| ---------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------- |
| `create(trans)`  | Resolves `{ date, req: trans }`, no request.               | `POST` to the url with the transaction as the body, resolving `res.data`. |
| `refresh(trans)` | Resolves `{ date, req: trans, id: trans.id }`, no request. | `PUT` to the url plus `/` and the id, resolving `res.data`.               |

The offline answers matter beyond being empty. The domain overwrites `amount` when the internal answer carries one, and neither of these does, so the amount stays as requested. And the refresh path only persists a status change when the internal answer is truthy, which both of these are.

### `SERVICES`

`SERVICES` is `[TransService]`, the provider array a Nest module spreads into its `providers` and `exports`. Both module variants in [`@smartsoft001/trans-shell-nestjs`](/docs/packages/trans-shell-nestjs) do exactly that, so an application normally registers the service by importing a module rather than by naming the class.

## Related packages

- [`@smartsoft001/trans-domain`](/docs/packages/trans-domain) holds the three services this one delegates to, and every rule they apply.
- [`@smartsoft001/trans-shell-nestjs`](/docs/packages/trans-shell-nestjs) provides this service, its configuration and the optional payment providers.
- [`@smartsoft001/domain-core`](/docs/packages/domain-core) declares the repository contract behind `getById`.
- [`@smartsoft001/payu`](/docs/packages/payu), [`@smartsoft001/paypal`](/docs/packages/paypal), [`@smartsoft001/paynow`](/docs/packages/paynow) and [`@smartsoft001/revolut`](/docs/packages/revolut) are the four entries of the provider map.
