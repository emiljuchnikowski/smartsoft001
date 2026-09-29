import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import { IBreadcrumbsItemClick } from './base/base.component';
import { BreadcrumbsStandardComponent } from './standard';
import { IBreadcrumbsOptions } from '../../models';
import { BREADCRUMBS_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';
import { forwardOutletOutputs } from '../base/forward-outlet-outputs';

@Component({
  selector: 'smart-breadcrumbs',
  template: `
    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="componentType(); inputs: componentInputs()"
      />
    } @else {
      <smart-breadcrumbs-standard
        [options]="options()"
        [class]="cssClass()"
        (itemClick)="itemClick.emit($event)"
      />
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [BreadcrumbsStandardComponent, NgComponentOutlet],
  host: { class: 'smart:contents' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsComponent {
  private injectedComponent = inject(BREADCRUMBS_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });

  options = input<IBreadcrumbsOptions>();
  cssClass = input<string>('', { alias: 'class' });

  itemClick = output<IBreadcrumbsItemClick>();

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() => ({
    options: this.options(),
    cssClass: this.cssClass(),
  }));

  private readonly outlet = viewChild(NgComponentOutlet);

  constructor() {
    forwardOutletOutputs(this.outlet, {
      itemClick: this.itemClick,
    });
  }
}
