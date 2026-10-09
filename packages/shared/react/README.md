# @smartsoft001/react

A metadata-driven UI library for React. Describe a model once with the `@Model` / `@Field`
decorators of `@smartsoft001/models` and the components render it: `SmartForm` builds the inputs
and validation from the field options, `SmartList` the columns, `SmartDetails` the read-only view.
Around them come layout, navigation and feedback components, a `SmartProvider` with the services
they share, and a form engine that needs no form library.

```bash
npm install @smartsoft001/react @smartsoft001/domain-core @smartsoft001/models @smartsoft001/utils react react-dom reflect-metadata
```

React 19, `reflect-metadata` and the three `@smartsoft001` packages the models come from are peer
dependencies.

## Usage

Import the compiled stylesheet once (`@smartsoft001/react/styles.css`) and wrap the application in
`SmartProvider`:

```tsx
import '@smartsoft001/react/styles.css';

import type { ReactNode } from 'react';

import {
  createHistoryNavigation,
  SmartProvider,
  SMART_PRESET_COMPONENTS,
} from '@smartsoft001/react';

const navigation = createHistoryNavigation();

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SmartProvider
      language="eng"
      navigation={navigation}
      fileServiceConfig={{ apiUrl: '/api' }}
      {...SMART_PRESET_COMPONENTS}
    >
      {children}
    </SmartProvider>
  );
}
```

Then render a component, e.g. a form built from a model:

```tsx
import { useState } from 'react';

import { Field, FieldType, Model } from '@smartsoft001/models';
import { SmartForm } from '@smartsoft001/react';

@Model({})
export class Contact {
  @Field({ type: FieldType.text, create: { required: true } })
  name!: string;

  @Field({ type: FieldType.email, create: true })
  email!: string;
}

export function ContactForm({ onSave }: { onSave: (value: Contact) => void }) {
  const [model] = useState(() => new Contact());

  return (
    <SmartForm
      options={{ model, mode: 'create', show: true }}
      onInvokeSubmit={(value) => onSave(value as Contact)}
    />
  );
}
```

## What is inside

- **Components** — `SmartForm`, `SmartList`, `SmartDetails`, `SmartInput` (one field component per
  `FieldType`), and the layout, navigation and feedback pieces around them: `SmartApp`, `SmartPage`,
  `SmartCard`, `SmartModal`, `SmartTabs`, `SmartTable`, `SmartNotification` and more. Most come in a
  standard and a Preline-styled preset implementation; each renders the standard one unless the
  provider registers another.
- **`SmartProvider`** — the translations (Polish and English defaults, merged with the application's
  dictionary), a router-agnostic navigation adapter, the services, the component registry
  (`components`, `inputFieldComponents`, `detailFieldComponents`, `listModeComponents`) and the
  model providers. `SMART_PRESET_COMPONENTS` registers every preset at once. Without a provider the
  components still work against a default configuration.
- **Services** — `AuthService` (the JWT in storage and its permissions), `SmartHttpClient` (`fetch`
  with interceptors; the default one adds the bearer token), `FileService` (attachments with upload
  progress), `ToastService`, `AlertService` and `ModalService` (rendered by `SmartOverlays`, which
  the provider includes), and `AppService`, `MenuService`, `StyleService`, `ErrorService`,
  `StorageService`. Each has a `use…` hook.
- **Forms** — `SmartFormControl`, `SmartFormGroup` and `SmartFormArray`: status propagates up the
  tree, async validators run once the sync ones pass and hold the control `PENDING`, disabled
  controls are left out of the value. `useControlState` and `useControlBinding` connect them to
  React. `FormFactory` and `useModelForm` build them from a model: modes, permissions, nested
  objects and arrays, confirmations, unique checks and `enabled` specifications.
- **Helpers** — `SmartStore` / `useStore` (the small external store the services keep their state
  in), `trustHtml` and `sanitizeHtml` (HTML from lists and details is sanitised with DOMPurify
  unless trusted), and model label and list cell helpers.

The components are styled with Tailwind CSS 4; every utility carries the `smart:` prefix, so the
library's classes never collide with the application's. A `dark` class on `<html>` switches the
theme.

## Storybook

```bash
nx storybook react
```

The stories show the components and their variants, with a toolbar switch for the dark theme.

The full documentation is at https://framework.smartflow.biz.pl/docs/packages/react/.
