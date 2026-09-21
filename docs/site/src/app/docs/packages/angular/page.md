---
title: '@smartsoft001/angular'
section: Packages
order: 24
package: '@smartsoft001/angular'
nextjs:
  metadata:
    title: '@smartsoft001/angular'
    description: 'The Angular UI library: 56 standalone smart-* components, the services, pipes and providers behind them, and the form factory that turns model metadata into a reactive form.'
---

Ships the 56 `smart-*` components every screen in the framework is built from, together with the services, pipes, providers and form factory that render them out of `@smartsoft001/models` metadata. {% .lead %}

---

## Install

```bash
npm install @smartsoft001/angular @smartsoft001/domain-core @smartsoft001/models @smartsoft001/utils
```

The published manifest declares [`@smartsoft001/models`](/docs/packages/models), [`@smartsoft001/domain-core`](/docs/packages/domain-core) and [`@smartsoft001/utils`](/docs/packages/utils) as peer dependencies, pinned to its own version. Every other import the library makes still has to resolve in the application. From Angular that means `@angular/common`, `@angular/core`, `@angular/forms`, `@angular/router` and `@angular/cdk`, plus `rxjs`. From the ecosystem it means `@ngx-translate/core`, which `SharedModule` injects in its constructor, `ngx-cookie` for the cookie-backed storage, `ng-dynamic-component` for the pluggable slots, `ng-lazyload-image` for list thumbnails, and `ngx-editor` and `ngx-color-picker` for two of the field editors. The remaining runtime helpers are `lodash`, `lodash-decorators`, `moment`, `jwt-decode` and `guid-typescript`. `@ngrx/store` is only needed by the applications that import `NgrxSharedModule`.

The components are styled with Tailwind CSS 4. The build compiles the library's own entry stylesheet and publishes the result as `styles.css` at the package root, so an application adds that one file to its styles and gets the whole component look. Every utility the library emits carries the `smart:` prefix, which keeps it from colliding with the application's own Tailwind layer, and the dark variant is redefined as class-based, so a `dark` class on `<html>` switches the theme rather than the operating system setting.

## What it is

This is the presentation layer the rest of the framework composes. The components are metadata-driven: `smart-form` and `smart-input` read the `@Field` options of a model and pick an editor per field, `smart-list` and `smart-detail` read the same options and pick a renderer, and none of that requires a template per entity. [`@smartsoft001/crud-shell-angular`](/docs/packages/crud-shell-angular) is the clearest consumer, its generated list and item screens are compositions of the elements here.

Two things make the library extensible without forking it. The five provider pairs, each an abstract class next to a matching `InjectionToken`, are where an application supplies labels, option lists, extra validators and the export and import behaviour. The dynamic component engine is the other: `CreateDynamicComponent` builds a facade that looks up a registered replacement by a `DynamicComponentType` key and renders it instead of the built-in template, which is how the CRUD pages plug themselves in under the `crud-list-page` and `crud-item-page` keys.

Everything is standalone. Each component, pipe and directive is imported directly by the component that uses it, and the `Shared*Module` classes exist to hand an NgModule application the same set in one import. `SharedModule` is the one module a bootstrapping application still needs, because it installs the default translations and pulls in the services.

## Usage

### Register the shared providers

{% snippet file="angular/src/getting-started/app-config.example.ts" region="usage" /%}

`SharedModule` has no `forRoot` and no `forFeature`, so it goes in through `importProvidersFrom`. It exports `TranslateModule`, `HttpClientModule`, `ReactiveFormsModule` and `CommonModule` alongside the library's own factories, services, pipes, pages and directives modules, and its constructor calls `setDefaultTranslationsAndLang`, which is why `provideTranslateService()` has to come with it. Without `TranslateService` in the injector the module cannot be constructed at all.

The spec that runs this configuration boots a `TestBed` from the providers array and proves the three consequences: `TranslateService` resolves, `ToastService` resolves, which means the services module came along with it, and the registered languages contain `pl`, which is the constructor side effect having run.

### Supply the field labels

Every label on a generated screen goes through the same lookup, and an application takes it over by registering one provider.

{% snippet file="angular/src/angular/model-label-provider.example.ts" region="usage" /%}

`IModelLabelProvider` is an abstract class, so it is its own DI token and the registration binds the implementation to the class itself. That detail matters: `ModelLabelPipe` and `ListHeaderPipe` inject the abstract class, optionally. The `MODEL_LABEL_PROVIDER` token declared next to it is exported but nothing in the library injects it, so registering against the token alone changes nothing.

The fallback is a value check, not a presence check. The pipe calls `get()`, reads the returned signal, and uses the result only when it is truthy; an empty string hands the key back to `translateService.instant('MODEL.' + key)`. Returning an empty string for the keys it does not know is therefore how a provider covers part of a model and leaves the rest to the translations.

Its spec asserts both halves against a real `ModelLabelPipe`: the mapped key comes back as `Adres e-mail`, the unmapped one as `MODEL.name`. Two further cases read the provider directly and show the signal carrying the label and the empty string.

### Use the pipes in a template

{% snippet file="angular/src/angular/pipes.example.ts" region="usage" /%}

Both pipes are standalone and are imported by the component that uses them, which is the normal path; `SharedPipesModule` re-exports the same set for an NgModule application. `smartSlug` delegates to `SlugService` from [`@smartsoft001/utils`](/docs/packages/utils), which strips the HTML, transliterates the Polish characters and hyphenates what is left. `smartEnumToList` is deliberately small: it is `Object.keys(value)` with a guard that passes a falsy input straight through, so it hands back the enum's keys in declaration order and nothing more.

The spec mounts the component and reads the DOM. The title renders as `zazolc-gesla-jazn`, the enum produces three list items, and their text is `draft`, `published`, `archived`, in that order.

### Build a form from the model

{% snippet file="angular/src/angular/form-factory.example.ts" region="usage" /%}

`FormFactory` is the bridge between the decorators and Angular's reactive forms. It is `@Injectable()` without `providedIn`, provided by `SharedFactoriesModule`, and it injects four things: `UntypedFormBuilder`, `AuthService`, `DetailsService` and `MODEL_VALIDATORS_PROVIDER`. The last one is not optional, so an application that registers no extra validators still has to provide the token, even as `null`. `create` walks the fields the mode admits, builds a control for each and attaches the validators the field metadata implies: required, email, phone number, PESEL, min, max, minimum and maximum length, the async uniqueness check and the `confirm` companion control.

Each control is recalculated once every validator it needs has been attached, so the group `create` hands back already carries the right status and nothing has to be refreshed before rendering the form or gating a submit button.

The spec covers what the metadata produced. The controls are exactly `name` and `email`, the two fields with a create block. The group is invalid straight out of `create` while `name` is empty, with `{ required: true }` on that control, and filling `name` makes it valid. `email` stays valid while empty, because `create: true` opted it into the form without making it mandatory, but `FieldType.email` still rejects `not-an-email` with `{ email: true }`.

### Put a component on screen

{% snippet file="angular/src/button/basic.example.ts" region="usage" /%}

The component classes are imported straight into the `imports` array, and their configuration arrives as one options object rather than a dozen inputs. `IButtonOptions` carries the `click` handler plus the design tokens, `variant`, `size`, `color`, and the shape and icon flags. The pattern repeats across the library: an options interface per component, typed against the shared `SmartVariant`, `SmartSize` and `SmartColor` unions.

Its spec mounts the component, finds the rendered `button` element, checks that the projected label reached it, then clicks it and asserts the signal in the host component flipped, which proves the options object's handler is wired through the facade to the standard implementation underneath.

## API

### Modules

| Export                   | What it is                                                                                                                                                                                                            |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SharedModule`           | The bootstrap module. No `forRoot`. Exports `TranslateModule`, `HttpClientModule`, `ReactiveFormsModule`, `CommonModule` and the five modules below. Its constructor registers the default translations and language. |
| `NgrxSharedModule`       | Provides `NgrxStoreService`, imports `SharedModule`, and connects the store in its constructor, which is what fills the static `NgrxStoreService.store` the CRUD package registers its reducers through.              |
| `SharedServicesModule`   | Imports `TranslateModule.forChild()` and `CookieModule.withOptions()`, provides the twelve module-scoped services.                                                                                                    |
| `SharedFactoriesModule`  | Imports `ReactiveFormsModule`, provides `FormFactory`.                                                                                                                                                                |
| `SharedPipesModule`      | Declares and exports the eight pipes for NgModule applications.                                                                                                                                                       |
| `SharedDirectivesModule` | The same for the two directives.                                                                                                                                                                                      |
| `SharedPagesModule`      | The same for `DetailsPage`.                                                                                                                                                                                           |

`NgrxSharedModule` imports `ErrorEffects`, but the `EffectsModule.forFeature([ErrorEffects])` line is commented out, so no error effect is registered by importing it. `SharedComponentsModule` exists in the sources and is not re-exported from the barrel; components are standalone and imported one by one instead.

### Services

Seven services are `providedIn: 'root'` and need no registration. The rest come from `SharedServicesModule`, except the three at the bottom, which no shipped module provides.

| Service                          | `providedIn` | What it does                                                                                                                                               |
| -------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AppService`                     | `'root'`     | The application title and the header end buttons, as `title$` and `endButtons$` over static subjects, plus `addEndButton`, `removeEndButton`, `initTitle`. |
| `AuthService`                    | `'root'`     | The JWT held in `StorageService`. `isAuthenticated`, `expectPermissions`, `getPermissions`, `getTokenPayload`, `setToken`, `removeToken`.                  |
| `CalendarService`                | `'root'`     | Month generation for `smart-calendar`, over `moment`.                                                                                                      |
| `DetailsService`                 | `'root'`     | Holds the root object a detail view renders, as `$root`, `init` and `setRoot`.                                                                             |
| `DynamicComponentLoader<T>`      | `'root'`     | `getComponentsWithFactories`, which resolves component types to factories and remembers them in the static `declaredComponents`.                           |
| `MenuService`                    | `'root'`     | The menu items and their state, as signals, plus `openEnd`, `closeStart` and `closeEnd`.                                                                   |
| `StorageService`                 | `'root'`     | `setItem`, `getItem`, `removeItem`, `clear` over local storage.                                                                                            |
| `FileService`                    | Module       | `upload`, `download`, `delete` and `getUrl` against `FILE_SERVICE_CONFIG.apiUrl` + `/attachments`. Requires that token.                                    |
| `StyleService`                   | Module       | Writes an `IStyle` map onto an element as CSS variables. `init`, `set`, and the static `create`.                                                           |
| `ToastService`                   | Module       | `error` and `info`, plus the `addLockError` / `removeLockError` counter that suppresses errors.                                                            |
| `AlertService`                   | Module       | `show(options: IAlertOptions)`.                                                                                                                            |
| `ModalService`                   | Module       | `show(options: IModalServiceOptions)` and `dismiss`.                                                                                                       |
| `PopoverService`                 | Module       | `close()`.                                                                                                                                                 |
| `HardwareService`                | Module       | `isMobile`, `isMobileWeb` and `onBackButtonClick`.                                                                                                         |
| `UIService`                      | Module       | `showAlertWithDismissCallback`.                                                                                                                            |
| `ErrorService`                   | Neither      | `log(obj)`. Translates an HTTP error into a message and forwards it to `ToastService`.                                                                     |
| `NgrxStoreService`               | Neither      | Provided by `NgrxSharedModule`. `connect(store)` and the static `store` and `addReducer`.                                                                  |
| `DynamicComponentStorageService` | Neither      | Not injectable at all. The static `get(key, moduleRef)` reads `DYNAMIC_COMPONENTS_STORE` and returns the components whose `smartType` matches.             |

{% callout type="warning" title="The overlay services are shells today" %}
`ToastService`, `AlertService`, `ModalService`, `PopoverService`, `UIService` and `HardwareService` wrap an overlay layer the package no longer ships, and every call inside them is commented out. They still resolve and still return, but nothing appears: `ModalService.show` hands back an empty object cast to `IModal`, and `HardwareService.isMobile` is a hard-coded `false`. Anything built on them inherits that. `DetailsDirective` and `DetailsPage` both open their content through `ModalService`, and `ErrorService.log` reports through `ToastService`. The `smart-modal`, `smart-drawer` and `smart-notification` components are unaffected, they render their own markup.
{% /callout %}

Also exported from the services barrel: `SmartFormGroup`, the `UntypedFormGroup` subclass `FormFactory` returns, and the `FILE_SERVICE_CONFIG` and `DYNAMIC_COMPONENTS_STORE` tokens.

### Factories

| Export                             | What it does                                                                                                                                                                                                                                                             |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `FormFactory`                      | `create(obj, ops?)` returns a `Promise<SmartFormGroup>` built from the model metadata. `ops` takes a `mode` of `create`, `update`, `multiUpdate` or a custom string, a `uniqueProvider` and a `root`. Provided by `SharedFactoriesModule`.                               |
| `FormFactory.checkModelMeta(obj)`  | Static. Throws unless the class carries `@Model`.                                                                                                                                                                                                                        |
| `FormFactory.getOptions(obj, key)` | Static. The `IFieldOptions` recorded for one property.                                                                                                                                                                                                                   |
| `FormFactory.getOptionsFromMode`   | Static. Folds the `create` or `update` block into the top-level options for that mode.                                                                                                                                                                                   |
| `CreateDynamicComponent(type)`     | Returns an abstract `@Directive()` mixin extending `BaseComponent`. It resolves a registered replacement for the `DynamicComponentType` key and flips its `template` signal between `'custom'` and `'default'`. Lives in `components/base`, not in the factories barrel. |

`BaseComponent` and the `IDynamicComponent<T>` interface come from the same file and are exported too.

### Providers and tokens

Each extension point is an abstract class plus an `InjectionToken` of the same name. Which of the two the library actually injects differs per pair, and registering against the wrong one silently does nothing.

| Abstract class                | Token                          | Injected by                                                                                          | Purpose                                                                      |
| ----------------------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `IModelLabelProvider`         | `MODEL_LABEL_PROVIDER`         | The abstract class, optionally, by `ModelLabelPipe` and `ListHeaderPipe`. Nothing injects the token. | Field and column labels. `get(options)` returns a `Signal<string>`.          |
| `IModelPossibilitiesProvider` | `MODEL_POSSIBILITIES_PROVIDER` | The token, optionally, by the input possibilities base component.                                    | The option lists of enum, radio and select fields, as a writable signal.     |
| `IModelValidatorsProvider`    | `MODEL_VALIDATORS_PROVIDER`    | The token, required, by `FormFactory`.                                                               | Extra sync and async validators per field. Must be provided, even as `null`. |
| `IModelExportProvider`        | `MODEL_EXPORT_PROVIDER`        | The token, optionally, by `FormComponent`.                                                           | Turns a model and a value into an export.                                    |
| `IModelImportProvider`        | `MODEL_IMPORT_PROVIDER`        | The token, optionally, by `FormComponent`.                                                           | `getAccept(type)` and `convert(type, file)` behind the import control.       |

The providers barrel also exports the `IModelLabelOptions`, `IModelPossibilitiesOptions`, `IModelValidatorsOptions` and `IModelValidators` interfaces, the `IFormProvider` and `IAppProvider` interfaces, and a concrete `ModelValidatorsProvider`.

### Component substitution

Every facade component injects a token for its standard implementation, so a replacement can be provided without touching the template. The file that declares them, `src/lib/shared.inectors.ts`, is exported from the package barrel, so all of them can be imported from `@smartsoft001/angular`. The four below are the ones that come with a preset map filling them with the Preline-styled variants.

| Token                           | Preset map                       | Replaces                                    |
| ------------------------------- | -------------------------------- | ------------------------------------------- |
| `INPUT_FIELD_COMPONENTS_TOKEN`  | `INPUT_PRESET_FIELD_COMPONENTS`  | The field editors, keyed by `FieldType`.    |
| `DETAIL_FIELD_COMPONENTS_TOKEN` | `DETAIL_PRESET_FIELD_COMPONENTS` | The detail renderers, keyed by `FieldType`. |
| `PAGE_VARIANT_COMPONENTS_TOKEN` | `PAGE_PRESET_VARIANT_COMPONENTS` | The page shell, keyed by variant.           |
| `FORM_STANDARD_COMPONENT_TOKEN` | Not applicable                   | The form body.                              |

{% callout type="note" title="One token per component family" %}
The same file declares a `*_STANDARD_COMPONENT_TOKEN` for each of the 46 component families, `FORM_STANDARD_COMPONENT_TOKEN` above among them, plus `LIST_MODE_COMPONENTS_TOKEN` for the list modes. All of them are part of the public API, so `providers: [{ provide: BUTTON_STANDARD_COMPONENT_TOKEN, useValue: MyButton }]` in an application swaps the standard implementation out wherever the facade renders it. A spec at the package entry point asserts that they stay reachable.
{% /callout %}

### Directives

| Class                     | Selector           | What it does                                                                                                                                          |
| ------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DetailsDirective`        | `[smartDetails]`   | Opens a component in a modal on click, emitting `smartDetailsShowed` and `smartDetailsDismissed`. Goes through `ModalService`, see the warning above. |
| `DynamicContentDirective` | `.dynamic-content` | Marks the projected slots a dynamic component fills.                                                                                                  |

### Pipes

| Class            | Template name     | What it does                                                              |
| ---------------- | ----------------- | ------------------------------------------------------------------------- |
| `ModelLabelPipe` | `smartModelLabel` | The label of a field, from the registered provider or from `MODEL.<key>`. |
| `ListHeaderPipe` | `smartListHeader` | The same lookup for a list column header.                                 |
| `ListCellPipe`   | `smartListCell`   | Formats one cell of a list according to the field metadata.               |
| `EnumToListPipe` | `smartEnumToList` | `Object.keys(value)`, with a falsy input passed through untouched.        |
| `FileUrlPipe`    | `smartFileUrl`    | An attachment id as a URL, through `FileService`.                         |
| `SlugPipe`       | `smartSlug`       | Slugifies a string with `SlugService`, including the Polish characters.   |
| `RemoveHtmlPipe` | `smartRemoveHtml` | Strips the tags from a string.                                            |
| `TrustHtmlPipe`  | `smartTrustHtml`  | Marks a string as trusted HTML for the sanitiser.                         |

### Components

All 56 are standalone, all follow the `smart-<name>` / `<Name>Component` naming, and each is configured through a single options input rather than a list of inputs. Each one has its own reference page in the Components section of these docs (coming soon), so this is the index rather than the documentation.

**Layout and page structure.** `smart-container`, `smart-page`, `smart-page-heading`, `smart-section-heading`, `smart-card`, `smart-card-heading`, `smart-divider`, `smart-list-container`, `smart-multi-column-layout`, `smart-sidebar-layout`, `smart-stacked-layout`.

**Navigation.** `smart-navbar`, `smart-sidebar-navigation`, `smart-vertical-navigation`, `smart-tabs`, `smart-breadcrumbs`, `smart-dropdown`, `smart-command-palette`, `smart-paging`.

**Data display.** `smart-list`, `smart-table`, `smart-stacked-list`, `smart-grid-list`, `smart-description-list`, `smart-details`, `smart-detail`, `smart-feed`, `smart-stats`, `smart-media-object`, `smart-avatar`, `smart-badge`, `smart-icon`, `smart-accordion`, `smart-calendar`, `smart-info`.

**Forms and editing.** `smart-form`, `smart-input`, `smart-textarea`, `smart-toggle`, `smart-select-menu`, `smart-searchbar`, `smart-date-edit`, `smart-date-range`, `smart-password-strength`, `smart-sign-in-form`, `smart-button`, `smart-button-group`, `smart-action-panel`.

**Overlays and status.** `smart-modal`, `smart-drawer`, `smart-notification`, `smart-loader`, `smart-empty-state`, `smart-progress-bars`.

**Import and export.** `smart-export`, `smart-import`.

Three of them fan out into families that are the real metadata engine. `smart-input` dispatches to about 35 field editors, one per `FieldType`, from address and currency through NIP, PESEL and phone number to the file, image, PDF and video uploads. `smart-detail` dispatches to about 17 read-only renderers over the same types. `smart-list` has three modes, desktop, mobile and masonry grid. Each of those has a Preline-styled `preset` twin, and the preset maps in the substitution table are how an application switches the whole family over at once.

### Design tokens and styling

| Export                                                                                                            | Kind       | What it is                                                                                                                                                                                                                                    |
| ----------------------------------------------------------------------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SmartVariant`                                                                                                    | Type       | `'primary' \| 'secondary' \| 'soft'`.                                                                                                                                                                                                         |
| `SmartSize`                                                                                                       | Type       | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`.                                                                                                                                                                                                       |
| `SmartColor`                                                                                                      | Type       | The 22 Tailwind hues, from `slate` through `rose`.                                                                                                                                                                                            |
| `COMPONENT_COLORS`                                                                                                | Const      | `Record<string, ColorVariantClasses>`, the class list for each hue and variant. Every class is an explicit string, never a template literal, so the Tailwind scanner can see it.                                                              |
| `ColorVariantClasses`                                                                                             | Interface  | `{ primary: string[]; secondary: string[]; soft: string[] }`.                                                                                                                                                                                 |
| `IStyle`, `StyleType`                                                                                             | Types      | The CSS-variable theming surface `StyleService` writes: around 90 names covering the primary, secondary, tertiary, success, warning, danger, dark, medium and light ramps, the fonts, the button sizing and the phone and tablet breakpoints. |
| `SmartAvatarSize`, `SmartAvatarShape`                                                                             | Types      | Per-component token unions. There is one of these for most families, alongside layout unions such as `SmartNavbarLayout`, `SmartTabsLayout`, `SmartBreadcrumbsLayout`, `SmartModalVariant` and `SmartDrawerVariant`.                          |
| `DynamicComponentType`                                                                                            | Type       | The keys the dynamic component engine recognises, including `crud-list-page` and `crud-item-page`.                                                                                                                                            |
| `IAppOptions`, `ICardOptions`, `IButtonOptions`, `IIconButtonOptions`, `IFormOptions<T>`, `IDynamicComponentData` | Interfaces | The options objects the components take as their single input.                                                                                                                                                                                |

### Pages

`DetailsPage<T extends IEntity<string>>` and `SharedPagesModule`. The page reads its options from the navigation parameters of an application shell the package no longer ships, and that lookup is commented out, so it renders an empty details view unless the options are supplied another way.

### Decorators

| Export                                    | What it does                                                                                   |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `SmartNgModule`, `SmartNgModuleDecorator` | Wraps `@NgModule` with the library's own registration. `SmartNgModule` is an alias.            |
| `ReduxAction`, `ReduxActionDecorator`     | Marks a class as an NgRx action, giving it a generated unique type. `ReduxAction` is an alias. |
| `ReduxSelect`                             | Property decorator, three overloads, that binds a property to a slice of the store.            |
| `fastPropGetter(paths)`                   | The helper behind it: compiles a dotted path into a getter function.                           |

## Related packages

- [`@smartsoft001/models`](/docs/packages/models) provides the `@Model` and `@Field` metadata every component and the form factory read.
- [`@smartsoft001/crud-shell-angular`](/docs/packages/crud-shell-angular) composes these components into generated list and item screens.
- [`@smartsoft001/utils`](/docs/packages/utils) backs the slug, PESEL, NIP and specification helpers used by the pipes and the form factory.
- [`@smartsoft001/domain-core`](/docs/packages/domain-core) defines the `IEntity<string>` bound the list, details and page types are generic over.
