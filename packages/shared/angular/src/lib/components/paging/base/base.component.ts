import { computed, Directive, input, output } from '@angular/core';

export type PagingVariant = 'card-footer' | 'centered' | 'simple';

@Directive()
export abstract class PagingBaseComponent {
  readonly currentPage = input<number>(1);
  readonly totalPages = input<number>(1);
  readonly pageSize = input<number>(10);
  readonly totalItems = input<number>(0);
  readonly variant = input<PagingVariant>('card-footer');
  readonly cssClass = input<string>('', { alias: 'class' });

  readonly pageChange = output<number>();

  readonly showingFrom = computed(() =>
    this.totalItems() === 0
      ? 0
      : (this.currentPage() - 1) * this.pageSize() + 1,
  );

  readonly showingTo = computed(() =>
    Math.min(this.currentPage() * this.pageSize(), this.totalItems()),
  );

  readonly canGoBack = computed(() => this.currentPage() > 1);

  readonly canGoForward = computed(
    () => this.currentPage() < this.totalPages(),
  );

  readonly pages = computed<(number | '...')[]>(() => {
    const total = this.totalPages();
    const current = this.currentPage();

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const result: (number | '...')[] = [];
    const nearby = new Set<number>();

    nearby.add(1);
    nearby.add(total);
    nearby.add(current);
    if (current - 1 >= 1) nearby.add(current - 1);
    if (current + 1 <= total) nearby.add(current + 1);

    const sorted = [...nearby].sort((a, b) => a - b);

    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
        result.push('...');
      }
      result.push(sorted[i]);
    }

    return result;
  });

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) {
      return;
    }
    this.pageChange.emit(page);
  }

  nextPage(): void {
    if (this.canGoForward()) {
      this.goToPage(this.currentPage() + 1);
    }
  }

  previousPage(): void {
    if (this.canGoBack()) {
      this.goToPage(this.currentPage() - 1);
    }
  }
}
