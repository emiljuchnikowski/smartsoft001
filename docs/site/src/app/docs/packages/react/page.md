---
title: '@smartsoft001/react'
section: Packages
order: 31
package: '@smartsoft001/react'
nextjs:
  metadata:
    title: '@smartsoft001/react'
    description: 'The React UI library: the smart-* components as React components, the provider, services and hooks behind them, and the form engine that turns model metadata into a form.'
---

The React counterpart of [`@smartsoft001/angular`](/docs/packages/angular): the same metadata-driven components, styled with the same Tailwind classes, with a provider, hooks and a framework-agnostic form engine in place of Angular's injector and reactive forms. {% .lead %}

---

## Install

```bash
npm install @smartsoft001/react @smartsoft001/domain-core @smartsoft001/models @smartsoft001/utils react react-dom reflect-metadata
```

React 19, `reflect-metadata` and the three `@smartsoft001` packages the models come from are peer dependencies. The library's own runtime helpers, `jwt-decode`, `moment` and `dompurify`, are regular dependencies. Nothing from Angular, RxJS or ngx-translate is needed.

The components are styled with Tailwind CSS 4 and every utility carries the `smart:` prefix, exactly as in the Angular library, so both render the same screens. The build publishes the compiled stylesheet as `styles.css` at the package root: import `@smartsoft001/react/styles.css` once in the application. A `dark` class on `<html>` switches the theme.

## What it is

The library re-implements the Angular layer of the framework for React, component by component. A `smart-button` is a `SmartButton`, a `smart-form` a `SmartForm`, and each keeps its options interface (`IButtonOptions`, `IFormOptions`, `IListOptions`) so code and documentation written for one reads the same against the other. `TemplateRef` slots are `ReactNode` props, signals and observables are plain props, and two-way models are controlled props with an uncontrolled fallback.

`SmartProvider` replaces Angular's injector. It holds the translations (the same Polish and English defaults), a router-agnostic navigation adapter, the services (auth, storage, HTTP, files, toasts, alerts, modals, menu, app title) and the model providers. It is also where implementations are swapped: the `*_STANDARD_COMPONENT_TOKEN` tokens become the `components` registry, so `components={{ button: SmartButtonPreset }}` restyles every button, and `SMART_PRESET_COMPONENTS` registers every preset at once.

Forms do not depend on a form library. `SmartFormControl`, `SmartFormGroup` and `SmartFormArray` follow Angular's reactive forms semantics — status propagation, async validators with a pending state, disabled controls left out of the value, the same error keys — and the hooks bind them to React through `useSyncExternalStore`. `FormFactory` builds them from the model with every rule of the Angular factory.

## Usage

### Wrap the application

{% snippet file="react/src/react-stack/app-providers.example.tsx" region="usage" /%}

The provider creates its services once and keeps them for its lifetime, so the configuration objects should be stable: module constants as here, or memoised values. Without a provider the components still work against a default configuration, which is how the library's own tests render most of them. The spec renders through these providers and proves the English dictionary, the file service pointed at `/api` and the preset buttons are in place.

### Render a form from the model

{% snippet file="react/src/react/contact-form.example.tsx" region="usage" /%}

`SmartForm` asks the provider's factory for a form built from `options.model` in `options.mode`, then renders one `SmartInput` per control, which picks the field component by the field's type. `onInvokeSubmit` receives the value on submit or Enter; `onValueChange`, `onValuePartialChange` (only the edited fields) and `onValidChange` report as the user types. The spec fills the name in and submits, and asserts the submitted value.

### Build the form yourself

{% snippet file="react/src/react/form-factory.example.ts" region="usage" /%}

The factory is usable outside React. Modes pick the fields (`create`, `update`, `multiUpdate` or a custom one) and merge the mode's options over the field's; a field whose permissions the user lacks is left out; `confirm` adds a `<key>Confirm` control that has to match; `enabled` specifications add and remove controls as the value changes, `$root` included; a validators provider can replace what the metadata derived. The spec asserts the four controls, the required and email errors, the mismatched confirmation and the valid end state.

## API

### Provider and hooks

| Export                                                                                                                                                                              | What it is                                                                                                                                                                                                        |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SmartProvider`                                                                                                                                                                     | The root: `language`, `translations` or `translate`, `navigation`, services, `components`, `inputFieldComponents`, `detailFieldComponents`, `listModeComponents`, the model providers, `appProvider`, `overlays`. |
| `useSmart()`                                                                                                                                                                        | The whole context value.                                                                                                                                                                                          |
| `useTranslate()`                                                                                                                                                                    | The translate function; a missing key comes back as the key, like ngx-translate's `instant`.                                                                                                                      |
| `useNavigation()`, `createHistoryNavigation()`                                                                                                                                      | The navigation adapter and the default one over `window.history`. Supply your router's through `navigation`, with an optional `linkComponent`.                                                                    |
| `useSmartComponent(key, fallback)`                                                                                                                                                  | The registered implementation for a key, used by every wrapper.                                                                                                                                                   |
| `useAuthService()`, `useHttpClient()`, `useFileService()`, `useToastService()`, `useAlertService()`, `useModalService()`, `useMenuService()`, `useAppService()`, `useFormFactory()` | The services of the provider.                                                                                                                                                                                     |
| `useModelLabel(instance, key, type)`                                                                                                                                                | A field label: the label provider's, or `MODEL.<key>` translated.                                                                                                                                                 |
| `SMART_PRESET_COMPONENTS`, `INPUT_PRESET_FIELD_COMPONENTS`, `DETAIL_PRESET_FIELD_COMPONENTS`, `LIST_PRESET_MODE_COMPONENTS`                                                         | The preset implementations, all together or per area.                                                                                                                                                             |

### Forms

| Export                                                   | What it is                                                                                                                                                                                 |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `SmartFormControl`, `SmartFormGroup`, `SmartFormArray`   | The form model. `value`, `status`, `errors`, `touched`, `dirty`, `valueChanges`, `statusChanges`, `setValue`, `patchValue`, `reset`, `disable`, `enable`, `markAllAsTouched`, `get(path)`. |
| `SmartValidators`                                        | `required`, `requiredTrue`, `email`, `min`, `max`, `minLength`, `maxLength`, `pattern`, with Angular's error keys.                                                                         |
| `useControlState(control)`, `useControlBinding(control)` | The live state of a control, and the value / change / blur binding of an element.                                                                                                          |
| `FormFactory`, `useModelForm(model, options)`            | The factory and the hook that builds and keeps a form for a model.                                                                                                                         |

### Services

| Service                                                                                                            | What it does                                                                                                                                                                                            |
| ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AuthService`                                                                                                      | The JWT in storage: `isAuthenticated`, `expectPermissions`, `getPermissions`, `getTokenPayload`, `getAccessToken`, `setToken`, `removeToken`.                                                           |
| `SmartHttpClient`                                                                                                  | A `fetch` client with interceptors; `createAuthInterceptor` adds the bearer token, which the default client does.                                                                                       |
| `FileService`                                                                                                      | `upload` (with progress), `download`, `delete` and `getUrl` under `<apiUrl>/attachments`.                                                                                                               |
| `ToastService`, `AlertService`, `ModalService`                                                                     | Rendered by `SmartOverlays`, which the provider includes: toasts through `SmartNotification`, alerts through `SmartAlert`, modals through `SmartModal`. Unlike the Angular shells, they show something. |
| `AppService`, `MenuService`, `StyleService`, `DetailsService`, `ErrorService`, `CalendarService`, `StorageService` | The same responsibilities as their Angular namesakes.                                                                                                                                                   |

### Components

Every component of the Angular library is here under its React name: `SmartAccordion`, `SmartActionPanel`, `SmartAlert`, `SmartApp`, `SmartAvatar`, `SmartBadge`, `SmartBreadcrumbs`, `SmartButton`, `SmartButtonGroup`, `SmartCalendar`, `SmartCard`, `SmartCardHeading`, `SmartCommandPalette`, `SmartContainer`, `SmartDateEdit`, `SmartDateRange`, `SmartDescriptionList`, `SmartDetail`, `SmartDetails`, `SmartDivider`, `SmartDrawer`, `SmartDropdown`, `SmartEmptyState`, `SmartExport`, `SmartFeed`, `SmartForm`, `SmartGridList`, `SmartIcon`, `SmartImport`, `SmartInfo`, `SmartInput` and a field component per `FieldType`, `SmartList`, `SmartListContainer`, `SmartLoader`, `SmartMediaObject`, `SmartModal`, `SmartMultiColumnLayout`, `SmartNavbar`, `SmartNotification`, `SmartPage`, `SmartPageHeading`, `SmartPaging`, `SmartPasswordStrength`, `SmartProgressBars`, `SmartSearchbar`, `SmartSectionHeading`, `SmartSelectMenu`, `SmartSidebarLayout`, `SmartSidebarNavigation`, `SmartSignInForm`, `SmartStackedLayout`, `SmartStackedList`, `SmartStats`, `SmartTable`, `SmartTabs`, `SmartTextarea`, `SmartToggle`, `SmartVerticalNavigation`. Each has a `Standard` implementation, a `Preset` one where Angular has it, and the base logic as a `use<Name>` hook for custom implementations.

HTML that details and lists render is sanitised with DOMPurify. A cell pipe that returns `trustHtml(html)` opts out, the counterpart of returning `SafeHtml` in Angular.

## Related packages

[`@smartsoft001/crud-shell-react`](/docs/packages/crud-shell-react) builds the list and item screens of a collection from these components, and [`@smartsoft001/react-stack`](/docs/packages/react-stack) installs both with `core`. The models these components read are described by [`@smartsoft001/models`](/docs/packages/models).
