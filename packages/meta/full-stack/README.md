# @smartsoft001/full-stack

One install for a project with an Angular frontend and a NestJS backend. Pulls `@smartsoft001/core`
plus both runtime stacks.

```bash
npm install @smartsoft001/full-stack
```

This package ships no code of its own. It pins one version of each package below, so a project
installs the whole framework at a single version instead of resolving the stacks one by one:

- [`@smartsoft001/core`](https://www.npmjs.com/package/@smartsoft001/core)
- [`@smartsoft001/angular-stack`](https://www.npmjs.com/package/@smartsoft001/angular-stack)
- [`@smartsoft001/nestjs-stack`](https://www.npmjs.com/package/@smartsoft001/nestjs-stack)

Payments are a separate opt-in: add
[`@smartsoft001/payments-stack`](https://www.npmjs.com/package/@smartsoft001/payments-stack) when
the backend takes them.

The full documentation is at https://emiljuchnikowski.github.io/smartsoft001/docs/installation/.
