// #region usage
import {
  CrudFullConfig,
  CrudProvider,
  SmartCrudPages,
} from '@smartsoft001/crud-shell-react';
import { IEntity } from '@smartsoft001/domain-core';
import { Field, FieldType, Model } from '@smartsoft001/models';
import { SmartProvider } from '@smartsoft001/react';

@Model({ titleKey: 'title' })
export class Note implements IEntity<string> {
  id!: string;

  @Field({
    type: FieldType.text,
    list: true,
    details: true,
    create: { required: true },
    update: true,
  })
  title!: string;
}

// Module constants: the provider creates its service and facade again
// whenever `config` is a new object.
export const notesConfig: CrudFullConfig<Note> = {
  apiUrl: '/api/notes',
  entity: 'notes',
  type: Note,
  title: 'Notes',
  details: true,
  add: true,
  edit: true,
  remove: true,
  search: true,
  pagination: { limit: 10 },
  sort: { default: 'title' },
};

const translations = { MODEL: { title: 'Title' } };

export function NotesApp() {
  return (
    <SmartProvider language="eng" translations={translations}>
      <CrudProvider config={notesConfig}>
        {/* The list on /notes, a new note on /notes/add, a note on /notes/:id */}
        <SmartCrudPages basePath="/notes" />
      </CrudProvider>
    </SmartProvider>
  );
}
// #endregion
