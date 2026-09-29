import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import { IButtonGroupButtonClick } from './base/base.component';
import { ButtonGroupStandardComponent } from './standard/standard.component';
import { IButtonGroupButton, IButtonGroupOptions } from '../../models';
import { BUTTON_GROUP_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';
import { forwardOutletOutputs } from '../base/forward-outlet-outputs';

@Component({
  selector: 'smart-button-group',
  template: `
    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="componentType(); inputs: componentInputs()"
      />
    } @else {
      <smart-button-group-standard
        [buttons]="buttons()"
        [options]="options()"
        [(selected)]="selected"
        [class]="cssClass()"
        (buttonClick)="buttonClick.emit($event)"
      />
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [ButtonGroupStandardComponent, NgComponentOutlet],
  host: { class: 'smart:contents' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonGroupComponent {
  private injectedComponent = inject(BUTTON_GROUP_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });

  buttons = input<IButtonGroupButton[]>([]);
  options = input<IButtonGroupOptions>();
  selected = model<string | undefined>(undefined);
  cssClass = input<string>('', { alias: 'class' });

  buttonClick = output<IButtonGroupButtonClick>();

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() => ({
    buttons: this.buttons(),
    options: this.options(),
    selected: this.selected(),
    cssClass: this.cssClass(),
  }));

  private readonly outlet = viewChild(NgComponentOutlet);

  constructor() {
    forwardOutletOutputs(this.outlet, {
      selected: this.selected,
      buttonClick: this.buttonClick,
    });
  }
}
