// #region usage
import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  IStackedListOptions,
  StackedListComponent,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-stacked-list-usage-example',
  imports: [StackedListComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StackedListUsageExampleComponent {
  readonly options: IStackedListOptions = {
    title: 'Team members',
    description: 'People with access to this workspace.',
    withDividers: true,
    items: [
      {
        id: 'leslie',
        title: 'Leslie Alexander',
        description: 'leslie.alexander@example.com',
        meta: 'Co-Founder / CEO',
        href: '/team/leslie',
      },
      {
        id: 'michael',
        title: 'Michael Foster',
        description: 'michael.foster@example.com',
        meta: 'Co-Founder / CTO',
        href: '/team/michael',
      },
      {
        id: 'dries',
        title: 'Dries Vincent',
        description: 'dries.vincent@example.com',
        meta: 'Business Relations',
        href: '/team/dries',
      },
    ],
  };
}
// #endregion
