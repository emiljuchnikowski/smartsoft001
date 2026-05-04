import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { PagingBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-paging-standard',
  template: `
    <nav aria-label="Pagination" [class]="wrapperClasses()">
      <button
        type="button"
        [disabled]="!canGoBack()"
        (click)="previousPage()"
        class="smart:inline-flex smart:items-center smart:rounded-md smart:border smart:border-gray-300 smart:bg-white smart:px-3 smart:py-1.5 smart:text-sm smart:font-medium smart:text-gray-700 hover:smart:bg-gray-50 disabled:smart:opacity-50 disabled:smart:cursor-not-allowed smart:dark:border-white/10 smart:dark:bg-white/5 smart:dark:text-gray-200 dark:hover:smart:bg-white/10"
      >
        {{ 'prev' | translate }}
      </button>

      <div class="smart:inline-flex smart:items-center smart:gap-1">
        @for (page of pages(); track $index) {
          @if (page === '...') {
            <span
              class="smart:px-2 smart:py-1 smart:text-sm smart:text-gray-500 smart:dark:text-gray-400"
              >...</span
            >
          } @else {
            <button
              type="button"
              (click)="goToPage(+page)"
              [attr.aria-current]="page === currentPage() ? 'page' : null"
              [class]="
                page === currentPage()
                  ? 'smart:inline-flex smart:items-center smart:rounded-md smart:bg-indigo-600 smart:px-3 smart:py-1.5 smart:text-sm smart:font-semibold smart:text-white smart:dark:bg-indigo-500'
                  : 'smart:inline-flex smart:items-center smart:rounded-md smart:px-3 smart:py-1.5 smart:text-sm smart:font-medium smart:text-gray-700 hover:smart:bg-gray-50 smart:dark:text-gray-200 dark:hover:smart:bg-white/10'
              "
            >
              {{ page }}
            </button>
          }
        }
      </div>

      <button
        type="button"
        [disabled]="!canGoForward()"
        (click)="nextPage()"
        class="smart:inline-flex smart:items-center smart:rounded-md smart:border smart:border-gray-300 smart:bg-white smart:px-3 smart:py-1.5 smart:text-sm smart:font-medium smart:text-gray-700 hover:smart:bg-gray-50 disabled:smart:opacity-50 disabled:smart:cursor-not-allowed smart:dark:border-white/10 smart:dark:bg-white/5 smart:dark:text-gray-200 dark:hover:smart:bg-white/10"
      >
        {{ 'next' | translate }}
      </button>
    </nav>
  `,
  imports: [TranslatePipe],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PagingStandardComponent extends PagingBaseComponent {
  readonly wrapperClasses = computed(() => {
    const base =
      'smart:flex smart:items-center smart:justify-between smart:gap-2 smart:py-3';
    const extra = this.cssClass();
    return extra ? `${base} ${extra}` : base;
  });
}
