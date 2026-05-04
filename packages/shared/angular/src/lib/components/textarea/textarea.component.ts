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

import { ITextareaActionClick } from './base/base.component';
import { TextareaStandardComponent } from './standard';
import { ITextareaOptions } from '../../models';
import { TEXTAREA_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-textarea',
  template: `
    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="componentType(); inputs: componentInputs()"
      />
    } @else {
      <smart-textarea-standard
        [(value)]="value"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        [options]="options()"
        [class]="cssClass()"
        (actionClick)="actionClick.emit($event)"
      />
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [TextareaStandardComponent, NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaComponent {
  private injectedComponent = inject(TEXTAREA_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });

  value = model<string>('');
  placeholder = input<string>('');
  disabled = input<boolean>(false);
  options = input<ITextareaOptions>();
  cssClass = input<string>('', { alias: 'class' });

  actionClick = output<ITextareaActionClick>();

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() => ({
    value: this.value(),
    placeholder: this.placeholder(),
    disabled: this.disabled(),
    options: this.options(),
    cssClass: this.cssClass(),
  }));
}
