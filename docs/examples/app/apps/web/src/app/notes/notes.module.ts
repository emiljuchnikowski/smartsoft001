import { NgModule } from '@angular/core';

import { CrudModule } from '@smartsoft001/crud-shell-angular';

import { notesConfig } from './notes.config';

// #region module
/**
 * Registers the notes feature: the NgRx slice, the HTTP service and, because
 * `routing` is on, the three child routes ('' list, 'add' and ':id' item) the
 * application mounts under /notes.
 */
@NgModule({
  imports: [CrudModule.forFeature({ routing: true, config: notesConfig })],
})
export class NotesModule {}
// #endregion
