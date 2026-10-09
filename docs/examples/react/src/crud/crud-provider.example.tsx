// #region usage
import { CrudProvider, SmartCrudPages } from '@smartsoft001/crud-shell-react';
import { SmartProvider } from '@smartsoft001/react';

import { noteCrudConfig } from './crud-config.example';

// The labels of the generated screens: a `MODEL.<field>` key per field.
const translations = { MODEL: { title: 'Title', content: 'Content' } };

// The feature: the store, the effects, the facade and the file service of
// `notes` for everything inside the provider, and the three screens:
// the list on /notes, a new note on /notes/add, one note on /notes/:id.
export function NotesFeature() {
  return (
    <CrudProvider config={noteCrudConfig}>
      <SmartCrudPages basePath="/notes" />
    </CrudProvider>
  );
}

// One SmartProvider at the root is the whole prerequisite.
export function App() {
  return (
    <SmartProvider language="eng" translations={translations}>
      <NotesFeature />
    </SmartProvider>
  );
}
// #endregion
