import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  ViewEncapsulation,
} from '@angular/core';

import { AlertStandardComponent } from './standard/standard.component';
import { IAlertButton, IAlertOptions } from '../../models';
import { ALERT_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-alert',
  template: `
    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="componentType(); inputs: componentInputs()"
      />
    } @else {
      <smart-alert-standard
        [options]="options()"
        [class]="cssClass()"
        (dismissed)="dismissed.emit($event)"
      />
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [AlertStandardComponent, NgComponentOutlet],
  host: { class: 'smart:contents' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
  private injectedComponent = inject(ALERT_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });

  options = input.required<IAlertOptions>();
  cssClass = input<string>('', { alias: 'class' });

  dismissed = output<IAlertButton | null>();

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() => ({
    options: this.options(),
    cssClass: this.cssClass(),
  }));
}
