// #region usage
import {
  CrudFullConfig,
  CrudProvider,
  SmartCrudItemPage,
} from '@smartsoft001/crud-shell-react';

import { Note, noteCrudConfig } from './crud-config.example';

// With `details` a note opens read-only, and `edit` adds the edit button.
const noteDetailsConfig: CrudFullConfig<Note> = {
  ...noteCrudConfig,
  details: true,
};

// The route of one note (`/notes/:id`) or of a new one (`/notes/add`), with
// the id from the application's router. The page sets its mode once, when it
// is created, so the key gives adding and an id a page of their own.
export function NoteRoute({ id }: { id?: string }) {
  return (
    <CrudProvider config={noteDetailsConfig}>
      <SmartCrudItemPage key={id ? 'item' : 'add'} id={id} basePath="/notes" />
    </CrudProvider>
  );
}
// #endregion
