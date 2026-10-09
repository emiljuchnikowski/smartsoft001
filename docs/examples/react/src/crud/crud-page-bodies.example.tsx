// #region usage
import type { ReactNode } from 'react';

import {
  SmartCrudItemPageBodyProps,
  SmartCrudItemPageStandard,
  SmartCrudListPageBodyProps,
  SmartCrudListPageStandard,
  useCrudConfig,
  useCrudItemPageBase,
} from '@smartsoft001/crud-shell-react';
import {
  ListMode,
  SmartDetails,
  SmartForm,
  SmartList,
  SmartProvider,
} from '@smartsoft001/react';

// The registry is shared by every CRUD feature under the provider, so a body
// checks the entity and leaves the other features their standard body.
function NotesListBody(props: SmartCrudListPageBodyProps) {
  const config = useCrudConfig();

  if (config.entity !== 'notes') {
    return <SmartCrudListPageStandard {...props} />;
  }

  return props.listOptions ? (
    <SmartList options={{ ...props.listOptions, mode: ListMode.masonryGrid }} />
  ) : null;
}

// #region item-body
// useCrudItemPageBase builds the form and puts it into `props.formRef`, the
// form the page validates before add and save. Call it only in the component
// that renders that form.
function NotesItemForm(props: SmartCrudItemPageBodyProps) {
  const { formOptions } = useCrudItemPageBase(props);

  return formOptions ? (
    <section aria-label="Note form">
      <SmartForm
        options={formOptions}
        onValueChange={props.onChange}
        onValuePartialChange={props.onPartialChange}
        onValidChange={props.onValidChange}
      />
    </section>
  ) : null;
}

function NotesItemBody(props: SmartCrudItemPageBodyProps) {
  const config = useCrudConfig();

  if (config.entity !== 'notes') {
    return <SmartCrudItemPageStandard {...props} />;
  }

  if (props.mode === 'details') {
    return props.detailsOptions ? (
      <SmartDetails options={props.detailsOptions} />
    ) : null;
  }

  return <NotesItemForm {...props} />;
}
// #endregion

// A module constant: the provider's context changes with a new object.
const components = {
  'crud-list-page': NotesListBody,
  'crud-item-page': NotesItemBody,
};

const translations = { MODEL: { title: 'Title', content: 'Content' } };

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SmartProvider
      language="eng"
      translations={translations}
      components={components}
    >
      {children}
    </SmartProvider>
  );
}
// #endregion
