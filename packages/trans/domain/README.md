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

