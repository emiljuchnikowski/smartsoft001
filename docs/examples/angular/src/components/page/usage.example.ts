// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { IPageOptions, PageComponent } from '@smartsoft001/angular';

@Component({
  selector: 'docs-page-usage-example',
  imports: [PageComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageUsageExampleComponent {
  readonly searchText = signal('');

  readonly options: IPageOptions = {
    title: 'Team members',
    showBackButton: true,
    search: {
      text: this.searchText.asReadonly(),
      set: (text) => this.searchText.set(text),
    },
  };
}
// #endregion
