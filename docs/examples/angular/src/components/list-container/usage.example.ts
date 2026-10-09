// #region usage
import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  IListContainerOptions,
  ListContainerComponent,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-list-container-usage-example',
  imports: [ListContainerComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListContainerUsageExampleComponent {
  readonly options: IListContainerOptions = { variant: 'card-dividers' };

  readonly notifications = [
    { id: 'n1', text: 'Invoice #1042 was paid', time: '2 min ago' },
    { id: 'n2', text: 'Courtney Henry joined the team', time: '1 h ago' },
    { id: 'n3', text: 'Your export is ready to download', time: 'Yesterday' },
  ];
}
// #endregion
