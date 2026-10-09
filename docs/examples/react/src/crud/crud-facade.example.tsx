// #region usage
import { useEffect } from 'react';

import {
  CrudProvider,
  useCrudFacade,
  useCrudState,
} from '@smartsoft001/crud-shell-react';

import { Note, noteCrudConfig } from './crud-config.example';

function NoteTitles() {
  // The facade and the state of the nearest CrudProvider, already scoped to
  // the `entity` of its config.
  const facade = useCrudFacade<Note>();
  // `list` is undefined until the first read resolves.
  const notes = useCrudState<Note, Note[] | undefined>((state) => state.list);
  const loading = useCrudState<Note, boolean>((state) => !state.loaded);

  useEffect(() => {
    facade.read({});
  }, [facade]);

  return (
    <>
      {loading && <p>Loading notes…</p>}
      <ul>
        {(notes ?? []).map((note) => (
          <li key={note.id}>{note.title}</li>
        ))}
      </ul>
    </>
  );
}

export function NotesList() {
  return (
    <CrudProvider config={noteCrudConfig}>
      <NoteTitles />
    </CrudProvider>
  );
}
// #endregion
