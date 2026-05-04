import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { IButtonOptions } from '../../models';
import { BUTTON_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';
import { ButtonStandardComponent } from './standard/standard.component';

@Component({
  selector: 'smart-button',
  template: `
    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="componentType(); inputs: componentInputs()"
      />
    } @else {
      <smart-button-standard
        [options]="options()"
        [disabled]="disabled()"
        [class]="cssClass()"
      >
        <ng-container [ngTemplateOutlet]="contentRef"></ng-container>
      </smart-button-standard>
    }
    <ng-template #contentRef>
      <ng-content></ng-content>
    </ng-template>
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [ButtonStandardComponent, NgComponentOutlet, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  private injectedComponent = inject(BUTTON_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });

  options = input.required<IButtonOptions>();
  disabled = input<boolean>(false);
  cssClass = input<string>('', { alias: 'class' });

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() => ({
    options: this.options(),
    disabled: this.disabled(),
    cssClass: this.cssClass(),
  }));
}
