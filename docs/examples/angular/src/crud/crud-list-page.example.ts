// #region usage
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ListComponent } from '@smartsoft001/crud-shell-angular';

// With `routing: false` the app places the generated pages itself. The page
// takes no inputs: it reads everything from the CrudFullConfig that
// CrudModule.forFeature provided for this feature.
@Component({
  selector: 'docs-notes-page-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ListComponent],
  template: `<smart-crud-list-page></smart-crud-list-page>`,
})
export class NotesPageComponent {}
// #endregion
