---
title: '@smartsoft001/payments-stack'
section: Packages
order: 4
package: '@smartsoft001/payments-stack'
nextjs:
  metadata:
    title: '@smartsoft001/payments-stack'
    description: '@smartsoft001/payments-stack installs the payment transaction family and the four provider integrations, for services that take payments.'
---

`@smartsoft001/payments-stack` installs the payment transaction family and the four provider integrations, for services that take payments. {% .lead %}

---

## Install

```bash
npm install @smartsoft001/payments-stack
```

## What it is

It ships no code of its own, only pinned dependencies. It is separate from [`nestjs-stack`](/docs/packages/nestjs-stack) so a service that never touches payments does not carry four provider SDKs.

## Usage

After installing, wire the provider you use. PayPal, for example:

{% snippet file="node/src/paypal/paypal-service.example.ts" region="usage" /%}

## API

None of its own. The package is a manifest with pinned dependencies, so what it brings is its whole interface:

| Package                                                                             |
| ----------------------------------------------------------------------------------- |
| [`@smartsoft001/trans-domain`](/docs/packages/trans-domain)                         |
| [`@smartsoft001/trans-shell-app-services`](/docs/packages/trans-shell-app-services) |
| [`@smartsoft001/trans-shell-nestjs`](/docs/packages/trans-shell-nestjs)             |
| [`@smartsoft001/paypal`](/docs/packages/paypal)                                     |
| [`@smartsoft001/payu`](/docs/packages/payu)                                         |
| [`@smartsoft001/paynow`](/docs/packages/paynow)                                     |
| [`@smartsoft001/revolut`](/docs/packages/revolut)                                   |

Every version is pinned exactly, so the set installs at one version and a release never leaves two of these packages on different ones.

## Related packages

Each provider also has its own page: [`paypal`](/docs/packages/paypal), [`payu`](/docs/packages/payu), [`paynow`](/docs/packages/paynow), [`revolut`](/docs/packages/revolut).
