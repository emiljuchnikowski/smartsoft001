// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  BreadcrumbsComponent,
  IBreadcrumbsItemClick,
  IBreadcrumbsOptions,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-breadcrumbs-usage-example',
  imports: [BreadcrumbsComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsUsageExampleComponent {
  readonly options: IBreadcrumbsOptions = {
    layout: 'simple-with-chevrons',
    separator: 'chevron',
    ariaLabel: 'Breadcrumb',
    items: [
      { id: 'home', label: 'Home' },
      { id: 'projects', label: 'Projects' },
      { id: 'nero', label: 'Project Nero', current: true },
    ],
  };

  readonly lastItemId = signal<string | null>(null);

  onItemClick({ itemId }: IBreadcrumbsItemClick): void {
    this.lastItemId.set(itemId);
  }
}
// #endregion
