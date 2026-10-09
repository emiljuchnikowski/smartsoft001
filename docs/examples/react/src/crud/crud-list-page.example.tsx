// #region usage
import {
  CrudProvider,
  SmartCrudListPage,
} from '@smartsoft001/crud-shell-react';

import { noteCrudConfig } from './crud-config.example';

// An application with a router of its own renders the page on its list
// route. The page takes no configuration props: it reads the CrudFullConfig
// of the CrudProvider around it. `basePath` is where the add button
// (`/notes/add`) and the row links (`/notes/:id`) lead.
export function NotesListRoute() {
  return (
    <CrudProvider config={noteCrudConfig}>
      <SmartCrudListPage basePath="/notes" />
    </CrudProvider>
  );
}
// #endregion
