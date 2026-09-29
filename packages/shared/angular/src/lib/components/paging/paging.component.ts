import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  output,
  ViewContainerRef,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  outputToObservable,
  takeUntilDestroyed,
} from '@angular/core/rxjs-interop';

import { PAGING_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';
import { PagingBaseComponent, PagingVariant } from './base/base.component';
import { PagingStandardComponent } from './standard/standard.component';

@Component({
  selector: 'smart-paging',
  template: `<ng-container #anchor></ng-container>`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PagingComponent {
  private readonly injectedComponent = inject(PAGING_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });
  private readonly destroyRef = inject(DestroyRef);

  private readonly anchor = viewChild.required('anchor', {
    read: ViewContainerRef,
  });

  private componentRef: ComponentRef<PagingBaseComponent> | null = null;

  readonly currentPage = input<number>(1);
  readonly totalPages = input<number>(1);
  readonly pageSize = input<number>(10);
  readonly totalItems = input<number>(0);
  /**
   * Layout variant forwarded to the rendered paging component. Purely
   * visual: styled by the preset, the standard only exposes it as
   * `data-variant`.
   */
  readonly variant = input<PagingVariant>('card-footer');
  readonly cssClass = input<string>('', { alias: 'class' });

  readonly pageChange = output<number>();

  constructor() {
    effect(() => {
      const target = this.injectedComponent ?? PagingStandardComponent;
      const anchor = this.anchor();

      if (!this.componentRef) {
        anchor.clear();
        this.componentRef = anchor.createComponent(target);
        outputToObservable(this.componentRef.instance.pageChange)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((page) => this.pageChange.emit(page));
      }

      const host = this.componentRef.location as ElementRef<HTMLElement>;
      host.nativeElement.setAttribute(
        'data-smart-paging-host',
        this.injectedComponent ? 'injected' : 'standard',
      );

      this.componentRef.setInput('currentPage', this.currentPage());
      this.componentRef.setInput('totalPages', this.totalPages());
      this.componentRef.setInput('pageSize', this.pageSize());
      this.componentRef.setInput('totalItems', this.totalItems());
      this.componentRef.setInput('variant', this.variant());
      this.componentRef.setInput('class', this.cssClass());
    });
  }
}
