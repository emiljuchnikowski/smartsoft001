# 📦 @smartsoft001/trans-shell-app-services

![npm](https://img.shields.io/npm/v/@smartsoft001/trans-shell-app-services) ![downloads](https://img.shields.io/npm/dm/@smartsoft001/trans-shell-app-services)

## 🚀 Usage

`npm i @smartsoft001/trans-shell-app-services`

## 🛠️ Services & Methods

### TransService

Methods:

<table>
    <tr>
        <td>create</td>
        <td>Creates a new transaction using the CreatorService, internal service, and payment services. Returns orderId, redirectUrl, and responseData.</td>
    </tr>
    <tr>
        <td>refresh</td>
        <td>Refreshes the status of a transaction using the RefresherService, internal service, and payment services.</td>
    </tr>
    <tr>
        <td>refund</td>
        <td>Processes a refund for a completed transaction using the RefundService, internal service, and payment services.</td>
    </tr>
    <tr>
        <td>getById</td>
        <td>Retrieves a transaction by its ID from the repository.</td>
    </tr>
</table>

## ⚠️ Internal service and payment amounts

`TransService.create` charges only the `amount` your internal service approves. Register a provider
under `TRANS_TOKEN_INTERNAL_SERVICE` whose `create` returns `{ amount }` (a positive integer in minor
units), or set `internalApiUrl` to a back end whose response contains `amount`. With neither, the
built-in fallback makes no request and `create` rejects with `DomainValidationError`, so no payment
can be created in that offline mode. Refreshes still work.
