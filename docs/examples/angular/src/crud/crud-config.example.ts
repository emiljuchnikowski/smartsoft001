// #region usage
import { ListMode } from '@smartsoft001/angular';
import { CrudFullConfig } from '@smartsoft001/crud-shell-angular';
import { Field, FieldType, Model } from '@smartsoft001/models';

@Model({ titleKey: 'title' })
export class Note {
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
