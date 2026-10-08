// #region usage
import { useEffect } from 'react';

import {
  CrudConfig,
  CrudProvider,
  useCrudFacade,
  useCrudState,
} from '@smartsoft001/crud-shell-react';

export interface Note {
  id: string;
  title: string;
}

// No model and no screens: the base configuration is enough for the store.
const notesConfig: CrudConfig<Note> = {
  apiUrl: '/api/notes',
  entity: 'notes',
  // Added to every read whose filter has no query of its own.
  baseQuery: [{ key: 'archived', type: '=', value: false }],
};

function NoteTitles() {
  const facade = useCrudFacade<Note>();
  const notes = useCrudState<Note, Note[] | undefined>((state) => state.list);
  const loaded = useCrudState<Note, boolean>((state) => state.loaded);

  useEffect(() => {
    facade.read({ limit: 5, offset: 0 });
  }, [facade]);

  if (!loaded) return <p>Loading…</p>;

  return (
    <ul>
      {(notes ?? []).map((note) => (
        <li key={note.id}>
          <span>{note.title}</span>
          <button type="button" onClick={() => facade.delete(note.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}

export function RecentNotes() {
  return (
    <CrudProvider config={notesConfig}>
      <NoteTitles />
    </CrudProvider>
  );
}
// #endregion
