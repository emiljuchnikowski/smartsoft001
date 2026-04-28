import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { PageHeadingStandardComponent } from './standard/standard.component';
import { IPageHeadingOptions } from '../../models';
import { PAGE_HEADING_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-page-heading',
  template: `
    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="componentType(); inputs: componentInputs()"
      />
    } @else {
      <smart-page-heading-standard [options]="options()" [class]="cssClass()" />
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [PageHeadingStandardComponent, NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeadingComponent {
  private injectedComponent = inject(PAGE_HEADING_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });

  options = input<IPageHeadingOptions>();
  cssClass = input<string>('', { alias: 'class' });

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() => ({
    options: this.options(),
    cssClass: this.cssClass(),
  }));
}
