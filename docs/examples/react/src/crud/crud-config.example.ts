// #region usage
import { CrudFullConfig } from '@smartsoft001/crud-shell-react';
import { IEntity } from '@smartsoft001/domain-core';
import { Field, FieldType, Model } from '@smartsoft001/models';
import { ListMode } from '@smartsoft001/react';

@Model({ titleKey: 'title' })
export class Note implements IEntity<string> {
  id!: string;

  @Field({
    type: FieldType.text,
    create: true,
    update: true,
    list: true,
    details: true,
  })
  title!: string;

  @Field({
    type: FieldType.longText,
    create: true,
    update: true,
    list: true,
    details: true,
  })
  content!: string;
}

// A module constant: CrudProvider builds its service and facade again for
// every new configuration object.
export const noteCrudConfig: CrudFullConfig<Note> = {
  apiUrl: 'https://api.example.com/notes',
  entity: 'notes',
  type: Note,
  title: 'Notes',
  add: true,
  edit: true,
  remove: true,
  search: true,
  pagination: { limit: 25 },
  sort: { default: 'title', defaultDesc: false },
  list: { mode: ListMode.desktop },
};
// #endregion
