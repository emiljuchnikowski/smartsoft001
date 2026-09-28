// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { PagingComponent } from '@smartsoft001/angular';

@Component({
  selector: 'docs-paging-usage-example',
  imports: [PagingComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PagingUsageExampleComponent {
  readonly pageSize = 10;
  readonly totalItems = 97;
  readonly totalPages = Math.ceil(this.totalItems / this.pageSize);

  readonly currentPage = signal(1);

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }
}
// #endregion
