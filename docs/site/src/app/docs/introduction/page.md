---
title: Introduction
section: Getting started
order: 1
nextjs:
  metadata:
    title: Introduction
    description: What the smartsoft001 framework is, which packages it publishes and how they are layered.
---

smartsoft001 is an Nx monorepo that publishes 26 `@smartsoft001/*` npm packages: the models, UI components and backend building blocks shared by Angular, NestJS and Ionic projects. {% .lead %}

---

## What the framework is

The packages are consumed one at a time. There is no application shell to adopt and no runtime to boot: a project installs the libraries it needs, and each of them does one job. The shared libraries cover data models, domain patterns, utilities, Angular UI, NestJS wiring, MongoDB access, users and third-party integrations. On top of them sit three feature families, crud, auth and trans, which turn those building blocks into complete features.

The repository also ships `smart@smartsoft`, a Claude Code plugin whose skills automate the repository conventions, from scaffolding a workspace to running the review and release flows.

## Package families

| Family       | Packages                                                                                               | What it covers                                                                                                                                 |
| ------------ | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Shared       | `angular`, `models`, `domain-core`, `utils`                                                            | UI components built on Tailwind and signals, model decorators and metadata readers, repository patterns and `IEntity`, and validation helpers. |
| Backend      | `nestjs`, `mongo`, `users`                                                                             | The NestJS `SharedModule`, the JWT strategy and permission service, MongoDB access and the user entity definitions.                            |
| Payments     | `paypal`, `payu`, `paynow`, `revolut`                                                                  | Payment provider integrations behind one shape of service.                                                                                     |
| Integrations | `fb`, `google`                                                                                         | Facebook and Google clients.                                                                                                                   |
| crud         | `crud-domain`, `crud-shell-nestjs`, `crud-shell-angular`, `crud-shell-dtos`, `crud-shell-app-services` | Metadata-driven data management: generic REST endpoints on the backend and generated list and item pages on the frontend.                      |
| auth         | `auth-domain`, `auth-shell-nestjs`, `auth-shell-dtos`, `auth-shell-app-services`                       | Authentication, tokens and the contracts around them.                                                                                          |
| trans        | `trans-domain`, `trans-shell-nestjs`, `trans-shell-dtos-services`, `trans-shell-app-services`          | Payment transactions: create, refresh and refund across PayU, PayPal, Paynow and Revolut, with provider webhooks.                              |

## The domain and shell split

Every feature family is cut the same way. The `<family>-domain` package holds the entities and the business rules and depends on no framework, so it can be read and tested on its own. The `<family>-shell-*` packages adapt that domain to a runtime. `shell-nestjs` is the backend adapter, `shell-dtos` holds the contracts the two sides agree on, and `shell-app-services` is the glue that wires them together. `shell-angular` is the frontend adapter, and crud is the only family that ships one today. When you install a family you usually take the domain, the dtos and the shell for the runtime you are on.

{% callout type="note" title="The samples are executed, not written" %}
Every code sample in these docs is cut from a file in the repository that is compiled, linted and tested in CI, and the installation commands are run against the packages published on npm before each deploy. A sample cannot drift from the packages, because the build fails first.
{% /callout %}

## Where next

- [Installation](/docs/installation) adds the packages to a workspace and shows the minimum Angular and NestJS wiring.
- [Architecture](/docs/architecture) explains the layers and follows one entity from its decorators to a working screen.
- [CRUD](/docs/crud/overview) documents the family that generates the screens and the endpoints from one model.
- [Packages](/docs/packages) documents each library on its own page.
- [Components](/docs/components) documents every `smart-*` UI component with its API, an executed usage example and the live Storybook story.
- [Skills](/) will describe the `smart@smartsoft` Claude Code plugin.
