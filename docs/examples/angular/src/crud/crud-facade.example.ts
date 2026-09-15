// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';

import { CrudFacade } from '@smartsoft001/crud-shell-angular';

import { Note } from './crud-config.example';

@Component({
  selector: 'docs-notes-list-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (facade.loading()) {
      <p>Loading notes…</p>
    }
    <ul>
      @for (note of notes(); track note.id) {
        <li>{{ note.title }}</li>
      }
    </ul>
  `,
})
export class NotesListComponent implements OnInit {
  // CrudFacade is provided by CrudModule.forFeature; its signals are already
  // scoped to the `entity` named in the config.
  readonly facade = inject(CrudFacade<Note>);

  // `list()` is undefined until the first read resolves.
  readonly notes = computed(() => this.facade.list() ?? []);

  ngOnInit(): void {
    this.facade.read({});
  }
}
// #endregion
