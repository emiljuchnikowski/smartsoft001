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


## 💰 Payment amounts

The amount the payment provider charges comes from your server, never from the client.
`ITransInternalService.create` must resolve `{ amount }`, computed from trusted order data: a
positive safe integer in the provider's smallest currency unit (grosze for PLN, so `14999` for
149.99 PLN). Missing, zero, fractional, non-finite, string or unsafe integer values are rejected
with `DomainValidationError` before the provider is called. The client's `amount` is never a
fallback. It stays in `ITransCreate` and must still be at least `1`, only for compatibility.

Check customer and order access, stock, currency, discounts, tax and shipping in that service, and
never echo the request amount back. Compare the settled payment with the order before fulfilment.
This package does not calculate prices or authenticate the checkout.

### Upgrading

- Return `{ amount }` from `ITransInternalService.create`. The return type is now
  `Promise<ITransInternalCreateResult>`, so TypeScript flags implementations that don't.
- With the built-in HTTP internal service, the response of `POST internalApiUrl` must contain
  `amount`.
- With an empty `internalApiUrl` and no `TRANS_TOKEN_INTERNAL_SERVICE` provider, payments can no
  longer be created. Register an internal service first, also in development.
- `error` history entries now hold `{ name, message, status? }` (`TransErrorEvent`) instead of the
  raw error, so credentials in provider errors are never stored.
