import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';

import { IconName } from './base/base.component';
import { IconChevronDownComponent } from './chevron-down/chevron-down.component';
import { IconChevronUpComponent } from './chevron-up/chevron-up.component';
import { IconSpinnerComponent } from './spinner/spinner.component';

@Component({
  selector: 'smart-icon',
  template: `
    @if (template(); as tpl) {
      <ng-container [ngTemplateOutlet]="tpl" />
    } @else {
      @switch (name()) {
        @case ('spinner') {
          <smart-icon-spinner [class]="cssClass()" />
        }
        @case ('chevron-down') {
          <smart-icon-chevron-down [class]="cssClass()" />
        }
        @case ('chevron-up') {
          <smart-icon-chevron-up [class]="cssClass()" />
        }
      }
    }
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgTemplateOutlet,
    IconSpinnerComponent,
    IconChevronDownComponent,
    IconChevronUpComponent,
  ],
})
export class IconComponent {
  name = input<IconName>();
  cssClass = input<string>('', { alias: 'class' });
  template = input<TemplateRef<unknown> | null>(null);
}
