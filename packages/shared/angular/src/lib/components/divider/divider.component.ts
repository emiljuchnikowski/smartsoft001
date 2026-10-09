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

import { DividerStandardComponent } from './standard/standard.component';
import { IDividerOptions } from '../../models';
import { DIVIDER_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';
import { forwardOutletOutputs } from '../base/forward-outlet-outputs';
import { outletInputs } from '../base/outlet-inputs';

@Component({
  selector: 'smart-divider',
  template: `
    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="componentType(); inputs: componentInputs()"
      />
    } @else {
      <smart-divider-standard
        [label]="label()"
        [iconName]="iconName()"
        [title]="title()"
        [actionLabel]="actionLabel()"
        [options]="options()"
        [class]="cssClass()"
        (actionClick)="actionClick.emit()"
      />
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [DividerStandardComponent, NgComponentOutlet],
  host: { class: 'smart:contents' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DividerComponent {
  private injectedComponent = inject(DIVIDER_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });

  label = input<string>();
  iconName = input<string>();
  title = input<string>();
  actionLabel = input<string>();
  options = input<IDividerOptions>();
  cssClass = input<string>('', { alias: 'class' });

  actionClick = output<void>();

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() =>
    outletInputs(this.componentType(), {
      label: this.label(),
      iconName: this.iconName(),
      title: this.title(),
      actionLabel: this.actionLabel(),
      options: this.options(),
      cssClass: this.cssClass(),
    }),
  );

  private readonly outlet = viewChild(NgComponentOutlet);

  constructor() {
    forwardOutletOutputs(this.outlet, {
      actionClick: this.actionClick,
    });
  }
}
