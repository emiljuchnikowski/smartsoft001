import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
  ViewEncapsulation,
} from '@angular/core';

import { ButtonGroupStandardComponent } from './standard/standard.component';
import { IButtonGroupButton, IButtonGroupOptions } from '../../models';
import { BUTTON_GROUP_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

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

  buttonClick = output<{ buttonId: string }>();

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() => ({
    buttons: this.buttons(),
    options: this.options(),
    selected: this.selected(),
    cssClass: this.cssClass(),
  }));
}
