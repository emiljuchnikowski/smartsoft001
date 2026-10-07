# 📦 @smartsoft001/payu

![npm](https://img.shields.io/npm/v/@smartsoft001/payu) ![downloads](https://img.shields.io/npm/dm/@smartsoft001/payu)

## 🚀 Usage

`npm i @smartsoft001/payu`

## 🛠️ Services & Methods

### PayuService

Methods:

<table>
    <tr>
        <td>create</td>
        <td>Initiates a new payment order with an external payment API</td>
    </tr>
    <tr>
        <td>getStatus</td>
        <td>Retrieves the current status of an existing payment order</td>
    </tr>
    <tr>
        <td>refund</td>
        <td>Issues a refund for an existing payment order</td>
    </tr>
</table>

## ⚠️ Errors

A failed PayU call is never rethrown as the raw axios error, because that error carries the OAuth
client secret or the `Authorization: Bearer` token. Each method logs one line through the NestJS
`Logger` and throws a plain `Error` with no `cause`, `config` or `response`:

- `PayU authentication failed (HTTP {status})`
- `PayU order creation failed (HTTP {status})`
- `PayU status lookup failed (HTTP {status})`
- `PayU refund failed (HTTP {status})`

The ` (HTTP {status})` suffix is present only when PayU answered, so `401` and `5xx` stay
distinguishable. Code that read `e.response` from these errors must read the message instead.
