/**
 * The differences allowed between `@smartsoft001/angular` and
 * `@smartsoft001/react`.
 *
 * The two libraries ship the same components with the same options. Rule R18
 * of `npx nx run docs:check` compares the components and their skills, R19 the
 * declarations of the shared models and the component types that share a
 * name. An entry here is the only way to let the frameworks differ, and each
 * one says why. An entry that no longer matches a difference is an error as
 * well: once the frameworks agree, remove it.
 *
 * Data only: the rules that read it live in `check-rules.mjs`.
 */

/**
 * @typedef {'angular' | 'react'} Framework
 *
 * @typedef {object} ComponentException
 * @property {Framework} only The framework that ships the component.
 * @property {string} reason Why the other framework has no counterpart.
 *
 * @typedef {object} ApiException
 * @property {Framework} [only] The framework that declares it; without
 *   `only`, the two declarations may differ in any way.
 * @property {string} reason Why the frameworks differ.
 */

/**
 * Components one framework ships and the other does not, by component name
 * (the directory in the library and the suffix of the component skill).
 *
 * An entry exempts the component from R18 for the other framework (no
 * component, no skill there) and from R9 and R15 (no story usage region, no
 * usage example): a component of one framework has no component page, it is
 * documented on the page of its package, so neither would be embedded
 * anywhere. The framework that ships it still needs its component skill.
 *
 * @type {Record<string, ComponentException>}
 */
export const COMPONENT_EXCEPTIONS = {
  overlays: {
    only: 'react',
    reason:
      '`SmartProvider` renders the hosts of `ModalService`, `AlertService` ' +
      'and `ToastService` (`SmartModalHost`, `SmartAlertHost`, ' +
      '`SmartToastHost`); the Angular services mount their own component at ' +
      'the end of `<body>`.',
  },
  app: {
    only: 'react',
    reason:
      "The Angular library ships `AppBaseComponent`, an abstract base an application's " +
      'shell extends, and no `smart-app` wrapper; `SmartApp` renders ' +
      '`useApp` in React.',
  },
}

/**
 * Declarations of the shared models, and component types that share a name,
 * that may differ: by declaration name, or `Name.member` for one member of an
 * interface (without the trailing `$` of an Angular `Observable` member).
 *
 * @type {Record<string, ApiException>}
 */
export const API_EXCEPTIONS = {
  SmartPossibility: {
    only: 'react',
    reason:
      'The entry of a `possibilities` list: the Angular models spell out ' +
      '`{ id, text, checked }` inside the `WritableSignal` the form updates, ' +
      'React names the type of the plain array it takes.',
  },
  SmartSubscribable: {
    only: 'react',
    reason:
      'The structural `subscribe()` type React accepts for ' +
      '`onCleanMultiSelected$`, so the library needs no RxJS; Angular takes ' +
      'an RxJS `Observable`.',
  },
  InputComponentType: {
    only: 'react',
    reason:
      'The component that renders one form field, a React `ComponentType`; ' +
      'Angular declares the same role as `InputBaseComponentType`.',
  },
  InputBaseComponentType: {
    only: 'angular',
    reason:
      'A forward declaration in `models/forward-types.ts` that breaks the ' +
      'circular import between the models and the Angular input components; ' +
      'React declares the same role as `InputComponentType`.',
  },
}
