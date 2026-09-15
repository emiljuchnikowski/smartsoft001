---
title: Getting started
section: Getting started
order: 0
---

smartsoft001 is a set of publishable npm packages that share the models, UI components and backend building blocks used across Angular, NestJS and Ionic projects. {% .lead %}

{% quick-links %}

{% quick-link title="Installation" icon="installation" href="/docs/installation" description="Add the packages you need to an existing Angular, NestJS or Ionic workspace." /%}

{% quick-link title="Packages" icon="presets" href="/docs/packages" description="Browse the shared libraries and the crud, auth and trans feature families." /%}

{% quick-link title="Components" icon="theming" href="/" description="Angular UI components and the metadata-driven forms and lists built on them." /%}

{% quick-link title="Claude Code skills" icon="plugins" href="/" description="The smart@smartsoft plugin that brings the repository conventions into Claude Code." /%}

{% /quick-links %}

---

## What is smartsoft001

The framework is an Nx monorepo published as `@smartsoft001/*` packages. Shared libraries cover models, domain-core, utils, Angular UI components, NestJS helpers, MongoDB access, users and integrations such as PayPal, PayU, Paynow, Revolut, Facebook and Google. On top of them sit three feature families: crud for metadata-driven data management, auth for authentication and trans for payment transactions across PayU, PayPal, Paynow and Revolut.

Every feature family is split the same way. The domain layer holds entities and business rules with no framework dependency, while the shell layer adapts that domain to a runtime: nestjs for the backend, angular for the frontend, dtos for the contracts between them and app-services for the glue. Every code sample in these docs is cut from code that is compiled and tested in CI, so it reflects the packages as they are published.

## Quick start

Install the packages you need in an existing workspace.

```bash
npm install @smartsoft001/angular @smartsoft001/models
```

Then drop a framework component into a standalone Angular component. The code below is not typed into this page: it is cut from an example file that is compiled and executed by the repository's test suite, so it always matches the published packages.

{% snippet file="angular/src/button/basic.example.ts" region="usage" /%}

Installation details and per-package guides are being published section by section, so this page will grow as each area of the framework is documented.
