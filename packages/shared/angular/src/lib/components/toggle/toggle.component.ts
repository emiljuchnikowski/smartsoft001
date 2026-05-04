import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  ViewEncapsulation,
} from '@angular/core';

import { ToggleStandardComponent } from './standard/standard.component';
import { IToggleOptions } from '../../models';
import { TOGGLE_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-toggle',
  template: `
    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="componentType(); inputs: componentInputs()"
      />
    } @else {
      <smart-toggle-standard
        [(value)]="value"
        [disabled]="disabled()"
        [options]="options()"
        [class]="cssClass()"
      />
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [ToggleStandardComponent, NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleComponent {
  private injectedComponent = inject(TOGGLE_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });

  value = model<boolean>(false);
  disabled = input<boolean>(false);
  options = input<IToggleOptions>();
  cssClass = input<string>('', { alias: 'class' });

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() => ({
    value: this.value(),
    disabled: this.disabled(),
    options: this.options(),
    cssClass: this.cssClass(),
  }));
}
