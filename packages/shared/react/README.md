# @smartsoft001/react

The React UI library of the smartsoft001 framework: the metadata-driven `smart-*` components of
[`@smartsoft001/angular`](https://www.npmjs.com/package/@smartsoft001/angular) as React components,
the `SmartProvider` with its services and hooks, and a framework-agnostic form engine that builds
forms from `@smartsoft001/models` metadata.

```bash
npm install @smartsoft001/react @smartsoft001/domain-core @smartsoft001/models @smartsoft001/utils react react-dom reflect-metadata
```

Import the compiled stylesheet once (`@smartsoft001/react/styles.css`), wrap the application in
`SmartProvider` and render `SmartForm`, `SmartList`, `SmartDetails` or any other component.

## Storybook

```bash
nx storybook react
```

The stories mirror the Angular Storybook one to one (same titles, story names and screens).

The full documentation is at https://framework.smartflow.biz.pl/docs/packages/react/.
