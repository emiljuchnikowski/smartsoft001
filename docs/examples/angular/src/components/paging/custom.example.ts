// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import {
  PAGING_STANDARD_COMPONENT_TOKEN,
  PagingBaseComponent,
  PagingComponent,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-custom-paging',
  template: `
    <nav class="docs-paging" [class]="cssClass()" aria-label="Pagination">
      <p class="docs-paging__summary">
        Showing {{ showingFrom() }} to {{ showingTo() }} of
        {{ totalItems() }} results
      </p>

      <div class="docs-paging__pages">
        <button
          type="button"
          class="docs-paging__previous"
          [disabled]="!canGoBack()"
          (click)="previousPage()"
        >
          Previous
        </button>

        @for (page of pages(); track $index) {
          @if (page === '...') {
            <span class="docs-paging__gap" aria-hidden="true">&hellip;</span>
          } @else {
            <button
              type="button"
              class="docs-paging__page"
              [attr.aria-current]="page === currentPage() ? 'page' : null"
              (click)="goToPage(+page)"
            >
              {{ page }}
            </button>
          }
        }

        <button
          type="button"
          class="docs-paging__next"
          [disabled]="!canGoForward()"
          (click)="nextPage()"
        >
          Next
        </button>
      </div>
    </nav>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// smart-paging builds the custom component with createComponent() and calls
// setInput('class', ...), which resolves the alias, so the inherited cssClass
// input is used as is - do not redeclare it here.
export class CustomPagingComponent extends PagingBaseComponent {}

@Component({
  selector: 'docs-paging-custom-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PagingComponent],
  // The token swaps the standard paging for the custom one everywhere below
  // this component, so consumers keep writing `<smart-paging>`.
  providers: [
    {
      provide: PAGING_STANDARD_COMPONENT_TOKEN,
      useValue: CustomPagingComponent,
    },
  ],
  template: `
    <smart-paging
      [currentPage]="currentPage()"
      [totalPages]="5"
      [pageSize]="10"
      [totalItems]="48"
      (pageChange)="currentPage.set($event)"
    />
  `,
})
export class PagingCustomExampleComponent {
  readonly currentPage = signal(1);
}
// #endregion
