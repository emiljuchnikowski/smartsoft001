import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  viewChild,
  viewChildren,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';

import { DynamicContentDirective } from '../../directives';
import { IButtonOptions } from '../../models';
import { CreateDynamicComponent } from '../base';
import { ButtonBaseComponent } from './base/base.component';
import { ButtonStandardComponent } from './standard/standard.component';

@Component({
  selector: 'smart-button',
  template: `
    @if (template() === 'default') {
      <smart-button-standard [options]="options()" [disabled]="disabled()">
        <ng-container [ngTemplateOutlet]="contentTpl"></ng-container>
      </smart-button-standard>
    }
    <ng-template #contentTpl>
      <ng-content></ng-content>
    </ng-template>
    <div class="dynamic-content"></div>
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [ButtonStandardComponent, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent extends CreateDynamicComponent<ButtonBaseComponent>(
  'button',
) {
  options = input.required<IButtonOptions>();
  disabled = input<boolean>(false);

  override contentTpl = viewChild<ViewContainerRef>('contentTpl');

  override dynamicContents = viewChildren<DynamicContentDirective>(
    DynamicContentDirective,
  );

  constructor() {
    super();

    effect(() => {
      this.options(); //Track changes only
      this.disabled(); //Track changes only
      this.refreshDynamicInstance();
    });
  }

  override refreshProperties(): void {
    this.baseInstance.options = this.options;
    this.baseInstance.disabled = this.disabled;
  }
}
