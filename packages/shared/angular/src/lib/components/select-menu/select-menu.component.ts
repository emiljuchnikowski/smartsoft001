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

import { SelectMenuValue } from './base/base.component';
import { SelectMenuStandardComponent } from './standard';
import { ISelectMenuOptions } from '../../models';
import { SELECT_MENU_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-select-menu',
  template: `
    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="componentType(); inputs: componentInputs()"
      />
    } @else {
      <smart-select-menu-standard
        [(value)]="value"
        [disabled]="disabled()"
        [options]="options()"
        [class]="cssClass()"
      />
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [SelectMenuStandardComponent, NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectMenuComponent {
  private injectedComponent = inject(SELECT_MENU_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });

  value = model<SelectMenuValue>(null);
  disabled = input<boolean>(false);
  options = input<ISelectMenuOptions>();
  cssClass = input<string>('', { alias: 'class' });

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() => ({
    value: this.value(),
    disabled: this.disabled(),
    options: this.options(),
    cssClass: this.cssClass(),
  }));
}
