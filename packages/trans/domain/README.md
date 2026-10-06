# 📦 @smartsoft001/trans-domain

![npm](https://img.shields.io/npm/v/@smartsoft001/trans-domain) ![downloads](https://img.shields.io/npm/dm/@smartsoft001/trans-domain)

## 🚀 Usage

`npm i @smartsoft001/trans-domain`

## 🛠️ Services & Methods

### CreatorService

Methods:

<table>
    <tr>
        <td>create</td>
        <td>Creates a new transaction, prepares it, sets it as new, and starts the payment process. Returns orderId, redirectUrl, and responseData.</td>
    </tr>
</table>

### RefresherService

Methods:

<table>
    <tr>
        <td>refresh</td>
        <td>Refreshes the status of a transaction by querying the payment service and updating the transaction accordingly.</td>
    </tr>
</table>

### RefundService

Methods:

<table>
    <tr>
        <td>refund</td>
        <td>Processes a refund for a completed transaction and updates its status and history.</td>
    </tr>
</table>

### TransConfig

Constructor:

<table>
    <tr>
        <td>constructor</td>
        <td>Initializes configuration with internalApiUrl and tokenConfig (secretOrPrivateKey, expiredIn).</td>
    </tr>
</table>


## 🔁 Idempotent fulfilment

`RefresherService` applies the business effect of a status change through
`ITransInternalService.refreshOnce(trans, idempotencyKey)` and never falls back to `refresh`. Your
handler must deduplicate the effect atomically in durable storage by that key and resolve the same
receipt when the key is replayed: write the effect and a unique-key row in one database transaction,
or use an outbox. A rename without deduplication, a mutex in one Node process or marking the order
paid before fulfilment does not meet the contract. External effects need idempotency at their own
boundary.

The key is derived from the transaction id, the provider, the provider's order id and the target
status, so every instance and every retry uses the same key, including a retry after fulfilment
succeeded but the status write failed. A failure keeps the previous persisted status so a retry can
recover. The provider is always asked for the actual status; notification content is not trusted.
The library cannot make arbitrary external effects exactly-once: test with independent processes,
database transactions, crashes and replayed receipts.

### Upgrading

- Implement `refreshOnce`. It is now required by `ITransInternalService`, so TypeScript flags
  services without it; at runtime they are refused before any effect runs.
- `refresh` is optional and `@deprecated`. Nothing calls it, refunds included, so move its logic to
  `refreshOnce`.
- With the built-in HTTP internal service, make `PUT {internalApiUrl}/{id}` honour the
  `Idempotency-Key` header, then set `TransConfig.idempotentInternalApi = true`. Without the flag
  every status change is refused; the flag alone provides no deduplication.
- With an empty `internalApiUrl` and no `TRANS_TOKEN_INTERNAL_SERVICE` provider (offline/dev mode),
  payments can be created but never completed.
- A failed refresh no longer stores status `error`; the record keeps its last persisted status.
