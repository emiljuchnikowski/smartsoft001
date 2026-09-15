// #region usage
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { EnumToListPipe, SlugPipe } from '@smartsoft001/angular';

export enum NoteStatus {
  draft = 'draft',
  published = 'published',
  archived = 'archived',
}

/**
 * Every pipe in `@smartsoft001/angular` is standalone, so a component imports
 * the pipe classes directly. `SharedPipesModule` re-exports the same set for
 * NgModule-based applications.
 */
@Component({
  selector: 'docs-pipes-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EnumToListPipe, SlugPipe],
  template: `
    <p data-testid="slug">{{ title | smartSlug }}</p>
    <ul>
      @for (status of statuses | smartEnumToList; track status) {
        <li>{{ status }}</li>
      }
    </ul>
  `,
})
export class PipesExampleComponent {
  // smartSlug strips HTML, transliterates Polish characters and hyphenates.
  readonly title = 'Zażółć <b>gęślą</b> jaźń';

  // smartEnumToList turns an enum object into its list of keys.
  readonly statuses = NoteStatus;
}
// #endregion
