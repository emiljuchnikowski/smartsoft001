---
title: Packages
section: Packages
order: 0
nextjs:
  metadata:
    title: Packages
    description: Every @smartsoft001 package, grouped by family, with one line on what each one does and a link to its reference page.
---

The framework publishes 26 `@smartsoft001/*` packages, installed one at a time. This page lists all of them by family, so you can find the one you need and jump to its reference page. {% .lead %}

---

## Shared libraries

The building blocks the rest of the framework is written against. Nothing here depends on a feature family.

| Package                                     | Purpose                                                                                                                               |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| [`angular`](/docs/packages/angular)         | The Angular UI library: metadata-driven `smart-*` components, plus the services, pipes, directives and form factory behind them.      |
| [`models`](/docs/packages/models)           | Describes an entity once with decorators, and exposes readers so generic code can validate it, render it and trim it per operation.   |
| [`domain-core`](/docs/packages/domain-core) | The contracts a domain layer is written against: repositories, a unit of work, composable query specifications and two domain errors. |
| [`utils`](/docs/packages/utils)             | Static helper services with no framework attached: identifiers, Polish document validation, array and object handling, slugs.         |

## Backend

The pieces a NestJS service repeats, and the storage and identity types they share.

| Package                           | Purpose                                                                                                                            |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| [`nestjs`](/docs/packages/nestjs) | One configurable module, the JWT strategy behind the guards, a permission check, a user decorator and a domain error filter.       |
| [`mongo`](/docs/packages/mongo)   | The MongoDB side of the storage contracts: one import binds the abstract repositories to implementations backed by the driver.     |
| [`users`](/docs/packages/users)   | Two interfaces that describe who is acting, so the authentication, repository and CRUD packages all mean the same thing by "user". |

## Payments

Four providers behind one shape of service, each usable on its own or through the trans family.

| Package                             | Purpose                                                                                            |
| ----------------------------------- | -------------------------------------------------------------------------------------------------- |
| [`paypal`](/docs/packages/paypal)   | Creates, confirms, status-checks and refunds PayPal payments through the legacy `paypal-rest-sdk`. |
| [`payu`](/docs/packages/payu)       | Calls the PayU REST API v2_1 for order creation, status lookup and refunds.                        |
| [`paynow`](/docs/packages/paynow)   | Talks to the Paynow payments API, with HMAC-SHA256 request signing and idempotency keys.           |
| [`revolut`](/docs/packages/revolut) | Talks to the Revolut Merchant orders API, pinned to API version `2024-09-01`.                      |

## Integrations

Two thin clients that turn a social login token into an identity.

| Package                           | Purpose                                                                                |
| --------------------------------- | -------------------------------------------------------------------------------------- |
| [`fb`](/docs/packages/fb)         | Resolves a Facebook access token to a user id and an email through the Graph API.      |
| [`google`](/docs/packages/google) | Validates a Google OAuth access token and returns the user id and the email behind it. |

## crud

Metadata-driven data management: generic REST endpoints on the backend, generated list and item screens on the frontend.

| Package                                                             | Purpose                                                                                                                             |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| [`crud-domain`](/docs/packages/crud-domain)                         | Two types, and nothing else: the options object a bulk insert takes and the mode it carries.                                        |
| [`crud-shell-nestjs`](/docs/packages/crud-shell-nestjs)             | One module call gives a collection its REST routes, its JWT guards and, optionally, a websocket feed of its changes.                |
| [`crud-shell-angular`](/docs/packages/crud-shell-angular)           | Generates the list and item screens of a collection from one configuration object and the model's own metadata.                     |
| [`crud-shell-dtos`](/docs/packages/crud-shell-dtos)                 | The shapes that cross the wire: one decorated credentials model, and the three payloads the change feed emits.                      |
| [`crud-shell-app-services`](/docs/packages/crud-shell-app-services) | Sits between a transport and a repository, applying the same four rules to every record: permission, validation, trimming, hashing. |

## auth

Authentication, tokens and the contracts around them.

| Package                                                             | Purpose                                                                                                                  |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| [`auth-domain`](/docs/packages/auth-domain)                         | One factory that turns a token request into a signed bearer token, across four grant types, with three extension points. |
| [`auth-shell-nestjs`](/docs/packages/auth-shell-nestjs)             | Two dynamic modules and a single route, `POST /token`, wired to the factory that issues the token.                       |
| [`auth-shell-dtos`](/docs/packages/auth-shell-dtos)                 | One class, two required fields: the credentials model the auth family renders as a login form.                           |
| [`auth-shell-app-services`](/docs/packages/auth-shell-app-services) | One service with one method: look the optional token providers up in the injector, then call the factory.                |

## trans

Payment transactions: one record per payment, kept in step with the provider that processes it.

| Package                                                                 | Purpose                                                                                                                     |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| [`trans-domain`](/docs/packages/trans-domain)                           | A payment as a record that keeps its own history: created, handed to a provider, refreshed, refunded, one entry per step.   |
| [`trans-shell-nestjs`](/docs/packages/trans-shell-nestjs)               | One module call gives an application a route that starts a payment and a webhook for every provider it enabled.             |
| [`trans-shell-dtos-services`](/docs/packages/trans-shell-dtos-services) | One decorated class: the payment request a checkout form collects, described once for the form, the check and the trimming. |
| [`trans-shell-app-services`](/docs/packages/trans-shell-app-services)   | The one service an application calls: it picks the payment provider, decides who your back end is, and delegates.           |

{% callout type="note" title="Two names for the trans DTO package" %}
Its manifest name is `@smartsoft001/trans-shell-dtos-services`, which is what this page links to, while the path alias code in this repository imports is `@smartsoft001/trans-shell-dtos`. It is also the one package on this page that is not published to npm, so it cannot be installed from the registry. Its page explains how to consume it anyway.
{% /callout %}

## How to read a package page

Every page in this section is built the same way, so you can skim the part you need. **Install** gives the exact install command, or explains why there is none. **What it is** describes the package in prose, including the decisions that are easier to read than to infer from the source. **Usage** walks through the common task with a worked example. **API** documents the exported classes, functions and types, one table or subsection each. **Related packages** points at the packages you will reach for next.

No code on these pages is typed into the markdown. Every example is cut from a file in `docs/examples`, which is compiled, linted and executed by the repository's test suite, and the install commands are run against the published packages before each deploy. An example cannot drift away from the package it documents, because the build fails first.
