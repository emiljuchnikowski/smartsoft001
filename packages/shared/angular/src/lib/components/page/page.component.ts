import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  TemplateRef,
  Type,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import { IPageOptions, SmartPageVariant } from '../../models';
import { PAGE_VARIANT_COMPONENTS_TOKEN } from '../../shared.inectors';
import { PageBaseComponent } from './base/base.component';
import { PageStandardComponent } from './standard/standard.component';

const baseMap: Partial<Record<SmartPageVariant, Type<PageBaseComponent>>> = {
  standard: PageStandardComponent,
};

@Component({
  selector: 'smart-page',
  template: `
    @let resolved = component();
    @if (resolved) {
      <ng-container
        *ngComponentOutlet="resolved; inputs: componentInputs()"
      ></ng-container>
    }
    <ng-template #defaultBodyRef>
      <ng-content></ng-content>
    </ng-template>
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageComponent {
  private extendMap = inject(PAGE_VARIANT_COMPONENTS_TOKEN, { optional: true });

  options = input<IPageOptions | null>();
  cssClass = input<string>('', { alias: 'class' });

  defaultBodyRef = viewChild<TemplateRef<unknown>>('defaultBodyRef');

  component = computed(() => {
    const variant = this.options()?.variant ?? 'standard';
    const map = { ...baseMap, ...(this.extendMap ?? {}) };
    return map[variant] ?? PageStandardComponent;
  });

  mergedOptions = computed<IPageOptions>(() => {
    const opts = this.options() ?? { title: '' };
    return { ...opts, bodyTpl: opts.bodyTpl ?? this.defaultBodyRef() };
  });

  componentInputs = computed(() => ({
    options: this.mergedOptions(),
    cssClass: this.cssClass(),
  }));
}
