// #region usage
import { NgModule } from '@angular/core';

import { CrudModule } from '@smartsoft001/crud-shell-angular';

import { noteCrudConfig } from './crud-config.example';

// `routing: false` registers the CRUD core module only: the NgRx slice, the
// services and the components. The app places `<smart-crud-list-page>` and
// `<smart-crud-item-page>` itself. Use `routing: true` to get the generated
// list/add/:id routes instead.
export const notesCrudFeature = CrudModule.forFeature({
  routing: false,
  config: noteCrudConfig,
});

@NgModule({
  imports: [notesCrudFeature],
})
export class NotesModule {}
// #endregion
