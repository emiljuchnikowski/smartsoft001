// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ISearchbarOptions, SearchbarComponent } from '@smartsoft001/angular';

@Component({
  selector: 'docs-searchbar-usage-example',
  imports: [SearchbarComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchbarUsageExampleComponent {
  readonly options: ISearchbarOptions = {
    placeholder: 'Search orders',
    debounceTime: 300,
    showToggleButton: true,
  };

  readonly query = signal('');
  readonly expanded = signal(true);
}
// #endregion
