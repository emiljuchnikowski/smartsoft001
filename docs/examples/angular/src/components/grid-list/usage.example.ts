// #region usage
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { GridListComponent, IGridListOptions } from '@smartsoft001/angular';

@Component({
  selector: 'docs-grid-list-usage-example',
  imports: [GridListComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridListUsageExampleComponent {
  readonly options: IGridListOptions = {
    title: 'Team',
    description: 'The people behind the product.',
    // The preset lays the tiles out in three columns from the `lg` breakpoint.
    columns: 3,
    items: [
      {
        id: 'lindsay',
        title: 'Lindsay Walton',
        description: 'Front-end Developer',
        href: '/team/lindsay-walton',
      },
      { id: 'courtney', title: 'Courtney Henry', description: 'Designer' },
      { id: 'tom', title: 'Tom Cook', description: 'Director of Product' },
    ],
  };
}
// #endregion
