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
import { ButtonCircularComponent } from './circular/circular.component';
import { ButtonRoundedComponent } from './rounded/rounded.component';
import { ButtonStandardComponent } from './standard/standard.component';

@Component({
  selector: 'smart-button',
  template: `
    @if (template() === 'default') {
      @if (options().circular) {
        <smart-button-circular
          [options]="options()"
          [disabled]="disabled()"
          [cssClass]="cssClass()"
        >
          <ng-container [ngTemplateOutlet]="contentTpl"></ng-container>
        </smart-button-circular>
      } @else if (options().rounded) {
        <smart-button-rounded
          [options]="options()"
          [disabled]="disabled()"
          [cssClass]="cssClass()"
        >
          <ng-container [ngTemplateOutlet]="contentTpl"></ng-container>
        </smart-button-rounded>
      } @else {
        <smart-button-standard
          [options]="options()"
          [disabled]="disabled()"
          [cssClass]="cssClass()"
        >
          <ng-container [ngTemplateOutlet]="contentTpl"></ng-container>
        </smart-button-standard>
      }
    }
    <ng-template #contentTpl>
      <ng-content></ng-content>
    </ng-template>
    <div class="dynamic-content"></div>
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [
    ButtonStandardComponent,
    ButtonRoundedComponent,
    ButtonCircularComponent,
    NgTemplateOutlet,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent extends CreateDynamicComponent<ButtonBaseComponent>(
  'button',
) {
  options = input.required<IButtonOptions>();
  disabled = input<boolean>(false);
  cssClass = input<string>('', { alias: 'class' });

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
    this.baseInstance.cssClass = this.cssClass;
  }
}
