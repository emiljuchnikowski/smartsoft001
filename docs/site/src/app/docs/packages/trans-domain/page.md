---
title: '@smartsoft001/trans-domain'
section: Packages
order: 20
package: '@smartsoft001/trans-domain'
nextjs:
  metadata:
    title: '@smartsoft001/trans-domain'
    description: 'The payment transaction lifecycle: one entity with its own history, three services that create, refresh and refund it, and the two contracts every payment provider fulfils.'
---

A payment as a record that keeps its own history: created, handed to a provider, refreshed from the provider, and refunded, with one history entry per step. {% .lead %}

---

## Install

```bash
npm install @smartsoft001/trans-domain @smartsoft001/domain-core @smartsoft001/utils
```

The manifest declares neither dependencies nor peer dependencies, so everything the package imports has to be installed next to it. Besides the two workspace packages above it needs `@nestjs/common` for `@Injectable` and `NotFoundException`, `typeorm` for the entity decorators, and `guid-typescript` for the id every new transaction gets.

{% callout type="note" title="It talks to nothing" %}
The three services take one constructor argument, the abstract `IItemRepository` from [`@smartsoft001/domain-core`](/docs/packages/domain-core). Your back end and the payment provider arrive as **arguments to each call**, not as injected dependencies, so every path through this package can be driven by plain objects. That is why the examples below run offline, against an array.
{% /callout %}

## What it is

Four payment providers, one transaction. The provider-specific code lives in [`@smartsoft001/payu`](/docs/packages/payu), [`@smartsoft001/paypal`](/docs/packages/paypal), [`@smartsoft001/paynow`](/docs/packages/paynow) and [`@smartsoft001/revolut`](/docs/packages/revolut); what stays the same is the order of the steps, the statuses a transaction moves through and the audit trail it accumulates. This package is that part.

A transaction is stored before anything external is called. `CreatorService` writes it as `prepare`, tells your own back end about it and writes it as `new`, then registers the order with the provider and writes it as `started`, appending a `TransHistory` entry at every step. If any of those steps throws, the record is updated once more with the status `error` and the error itself as the history payload, so a failed payment leaves a trace rather than nothing.

The other two services work on a transaction that already exists. `RefresherService` is what a provider webhook drives: it looks the transaction up by the id the provider issued and copies the remote status onto it. `RefundService` reverses a completed one.

## Usage

### Create a transaction

{% snippet file="node/src/trans/creator-service.example.ts" region="usage" /%}

The region assembles the four things `CreatorService.create` needs. An array-backed repository stands in for the Mongo one the NestJS module binds. `internalService` is the two-method contract your own back end implements. `paymentService` is a map keyed by `TransSystem`, here holding a single `payu` entry that fulfils `ITransPaymentSingleService` without touching the network. `newOrder` is the request a checkout page would build.

Its spec follows one order through. The call returns the provider's `ORD-1` and the redirect url the buyer has to follow. Exactly one transaction is stored. Its history reads `['prepare', 'new', 'started']`, in that order, which is the status walk made visible. The stored record ends in `started` and carries `ORD-1` as its `externalId`, which is the key the refresh flow later looks it up by.

### Reject a bad request

{% snippet file="node/src/trans/creator-validation.example.ts" region="usage" /%}

`create` validates first and validates synchronously: the check runs before the promise chain starts, so a bad request throws rather than rejecting. The region wraps the call in `async`/`await`, which turns both failure modes into one `catch`, and maps a `DomainValidationError` to its message.

Its spec walks every branch of the check and asserts the exact message for each, including that an unsupported provider such as `stripe` reports `system is empty` rather than anything more specific. Two further cases matter more than the messages: a rejected request leaves the repository empty, because validation happens before the first write, and a valid request still returns the order id through the same wrapper.

## API

### `CreatorService<T>`

`new CreatorService<T>(repository: IItemRepository<Trans<T>>)`.

`create(config, internalService, paymentService): Promise<{ orderId: string; redirectUrl?: string; responseData?: any }>` is the whole surface. It validates, then runs three steps:

| Step      | What happens                                                                                                                                                                                                   |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `prepare` | Every key of `config` is copied onto a new `Trans`, the id is a fresh `Guid.raw()`, and the record is created with `data` as its first history payload.                                                        |
| `new`     | `internalService.create(trans)` is awaited. An `amount` in its answer **overwrites** the requested amount, which is how a server-side price check corrects a tampered request. The record is updated.          |
| `started` | `paymentService[trans.system].create(...)` is awaited, `externalId` is set to the returned `orderId`, and the record is updated. The provider's answer is both the third history payload and the return value. |

Validation throws `DomainValidationError` with one of six messages, in this order, first failure wins.

| Message              | Raised when                                                                                                                             |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `config is empty`    | No request object at all.                                                                                                               |
| `name is empty`      | `name` is missing or blank.                                                                                                             |
| `client ip is empty` | `clientIp` is missing or blank.                                                                                                         |
| `amount is empty`    | `amount` is missing, zero, negative, or anything below `1`.                                                                             |
| `data is empty`      | The payload is missing.                                                                                                                 |
| `system is empty`    | `system` is missing **or** is not one of the four in `TRANS_SYSTEMS`. An unknown provider reports exactly this, and it is checked last. |

On failure after the first write, the record is updated with status `error` and the error as its history payload, the error is logged through `console.error` and rethrown unchanged. That final update is started but not awaited, so the caller can see the error before the write has landed.

### `RefresherService<T>`

`refresh(transId, internalService, paymentService, customData = {}): Promise<void>`. The `transId` is the **provider's** order id, not the local one: the lookup is `getByCriteria({ externalId: transId })` and takes the first row. A miss throws `NotFoundException('Transaction not found: ' + transId)`.

It then asks the provider for the current status. A status equal to the stored one returns immediately and writes nothing, which is what makes a webhook safe to deliver twice. Otherwise the new status and `modifyDate` are set, `customData` is attached to the provider payload under `customData`, and the entry is appended to the history.

`internalService.refresh(trans)` runs next, and its answer decides the ending. A falsy answer returns early, so the status change is **not** persisted at all. Any other answer is appended as a second history entry and the record is saved through `updatePartial` with only `modifyDate`, `status` and `history`. An error anywhere after the lookup records status `error` and rethrows.

### `RefundService<T>`

`refund(transId, internalService, paymentService, comment = 'Refund'): Promise<void>`. Here `transId` is the local id: the lookup is `repository.getById`. A miss throws `NotFoundException('Transaction not found: ' + transId)`.

Only a transaction whose status is `completed` may be refunded. Anything else throws `NotFoundException('Transaction is not completed/error: ' + transId)`, whose wording mentions `error` even though an errored transaction is rejected like every other status. The provider's `refund` is then called with the comment, the status becomes `refund`, the comment is attached to the provider payload under `customData`, and the record is saved in full. Failures take the same path as everywhere else: status `error`, then rethrow. `internalService` is accepted for symmetry with the other two services and is never called.

### `Trans<T>` and `TransHistory<T>`

`Trans<T>` is a TypeORM `@Entity('trans')` implementing `IEntity<string>`, with `@ObjectIdColumn({ generated: false })` on `id`, so ids come from the application rather than the database.

| Column                                           | Type                | Notes                                                                  |
| ------------------------------------------------ | ------------------- | ---------------------------------------------------------------------- |
| `id`                                             | `string`            | A GUID assigned by `CreatorService`.                                   |
| `externalId`                                     | `string`            | The provider's order id. The key `RefresherService` searches by.       |
| `name`, `amount`                                 | `string`, `number`  | The order description and the price the provider is asked to charge.   |
| `firstName`, `lastName`, `email`, `contactPhone` | `string`            | The buyer, as far as the provider needs it.                            |
| `data`                                           | `T`                 | Your own payload. Opaque to this package.                              |
| `system`                                         | `TransSystem`       | Which provider handles it, and which entry of the payment map is used. |
| `options`                                        | `any`               | Passed through to the provider's `create`.                             |
| `status`                                         | `TransStatus`       | Where in the lifecycle it sits.                                        |
| `modifyDate`                                     | `Date`              | Set on every transition.                                               |
| `clientIp`                                       | `string`            | Required by PayU, and required by the validation above.                |
| `history`                                        | `TransHistory<T>[]` | An embedded column, appended to at every step.                         |

A `TransHistory<T>` entry snapshots `amount`, `system`, `status` and `modifyDate` as they were at that moment, plus a `data` payload that differs per step: your `data` on `prepare`, the internal answer on `new`, the provider answer on `started`, the error on `error`. The payload is passed through `ObjectService.removeTypes` from [`@smartsoft001/utils`](/docs/packages/utils) first, so what is stored is a plain object.

### Types and constants

| Export          | Value                                                                                              |
| --------------- | -------------------------------------------------------------------------------------------------- |
| `TransSystem`   | `'payu' \| 'paypal' \| 'revolut' \| 'paynow'`                                                      |
| `TransStatus`   | `'prepare' \| 'new' \| 'error' \| 'started' \| 'completed' \| 'canceled' \| 'pending' \| 'refund'` |
| `TRANS_SYSTEMS` | `['payu', 'paypal', 'revolut', 'paynow']`, the runtime list the validation checks against.         |

### Contracts

`ITransCreate<T>` is the request: `amount`, `name`, `system`, `firstName`, `lastName`, `email`, `contactPhone`, `data`, `options` and `clientIp`, all required by the type even though only five are checked at runtime.

`ITransInternalService<T>` is what your back end implements: `create(trans)` and `refresh(trans)`, both returning a promise. Returning an object with an `amount` from `create` reprices the transaction; returning a falsy value from `refresh` stops the refresh from being persisted.

`ITransPaymentSingleService` is what a payment integration implements: `create(obj)` returning `{ orderId, redirectUrl?, responseData? }`, `getStatus(trans)` returning `{ status, data }`, and `refund(trans, comment)`. `ITransPaymentService` is the map from a provider name to one of those, and `trans.system` is the key used to index it.

### `TransConfig`

A class with a positional constructor, `new TransConfig(internalApiUrl, tokenConfig)`, where `tokenConfig` is `{ secretOrPrivateKey: string; expiredIn: number }`. It is declared here and consumed by [`@smartsoft001/trans-shell-app-services`](/docs/packages/trans-shell-app-services), which reads `internalApiUrl`, and by the NestJS module, which signs tokens with `tokenConfig`. An empty `internalApiUrl` is meaningful: it turns the built-in calls to your back end off.

### `DOMAIN_SERVICES`

`[CreatorService, RefresherService, RefundService]`, the provider array a Nest module spreads into its `providers`. `TransShellNestjsModule` does exactly that.

### Not part of the public API

`TransBaseService`, the abstract parent holding `addHistory` and `setError`, lives at `src/lib/trans.service.ts` and is not re-exported from the barrel. The three services extend it, but application code cannot, so a fourth service of your own has to reimplement the history handling rather than inherit it.

## Related packages

- [`@smartsoft001/trans-shell-app-services`](/docs/packages/trans-shell-app-services) wires these three services to the four payment integrations and to your back end.
- [`@smartsoft001/trans-shell-nestjs`](/docs/packages/trans-shell-nestjs) exposes them over HTTP, including the provider webhooks that drive the refresh.
- [`@smartsoft001/trans-shell-dtos-services`](/docs/packages/trans-shell-dtos-services) declares the decorated request model that mirrors `ITransCreate`.
- [`@smartsoft001/domain-core`](/docs/packages/domain-core) declares the repository contract and the validation error raised here.
- [`@smartsoft001/utils`](/docs/packages/utils) strips class information off every history payload.
- [`@smartsoft001/payu`](/docs/packages/payu), [`@smartsoft001/paypal`](/docs/packages/paypal), [`@smartsoft001/paynow`](/docs/packages/paynow) and [`@smartsoft001/revolut`](/docs/packages/revolut) are the four implementations of the payment contract.
