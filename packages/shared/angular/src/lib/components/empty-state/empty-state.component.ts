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

import {
  IEmptyStateActionClick,
  IEmptyStateItemClick,
} from './base/base.component';
import { EmptyStateStandardComponent } from './standard';
import { IEmptyStateOptions } from '../../models';
import { EMPTY_STATE_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';
import { forwardOutletOutputs } from '../base/forward-outlet-outputs';
import { outletInputs } from '../base/outlet-inputs';

@Component({
  selector: 'smart-empty-state',
  template: `
    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="componentType(); inputs: componentInputs()"
      />
    } @else {
      <smart-empty-state-standard
        [options]="options()"
        [class]="cssClass()"
        (actionClick)="actionClick.emit($event)"
        (itemClick)="itemClick.emit($event)"
      />
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [EmptyStateStandardComponent, NgComponentOutlet],
  host: { class: 'smart:contents' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {
  private injectedComponent = inject(EMPTY_STATE_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });

  options = input<IEmptyStateOptions>();
  cssClass = input<string>('', { alias: 'class' });

  actionClick = output<IEmptyStateActionClick>();
  itemClick = output<IEmptyStateItemClick>();

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() =>
    outletInputs(this.componentType(), {
      options: this.options(),
      cssClass: this.cssClass(),
    }),
  );

  private readonly outlet = viewChild(NgComponentOutlet);

  constructor() {
    forwardOutletOutputs(this.outlet, {
      actionClick: this.actionClick,
      itemClick: this.itemClick,
    });
  }
}
