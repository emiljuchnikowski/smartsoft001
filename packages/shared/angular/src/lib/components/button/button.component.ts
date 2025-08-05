import {
  ChangeDetectionStrategy, Component, Input, QueryList, TemplateRef, ViewChild,
  ViewChildren, ViewEncapsulation, WritableSignal
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import {IButtonOptions} from '../../models';
import {ButtonBaseComponent} from "./base/base.component";
import {CreateDynamicComponent} from '../base';
import {DynamicContentDirective} from '../../directives';
import { ButtonStandardComponent } from './standard/standard.component';

@Component({
  selector: 'smart-button',
  template: `
    @if (template() === 'default') {
      <smart-button-standard [options]="options" [disabled]="disabled">
        <ng-container [ngTemplateOutlet]="contentTpl"></ng-container>
      </smart-button-standard>
    }
    <ng-template #contentTpl>
      <ng-content></ng-content>
    </ng-template>
    <div class="dynamic-content"></div>
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [
    ButtonStandardComponent,
    NgTemplateOutlet
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent extends CreateDynamicComponent<ButtonBaseComponent>("button") {
  private _options!: WritableSignal<IButtonOptions>;
  private _disabled!: WritableSignal<boolean>;

  @Input() set options(val: IButtonOptions) {
    this._options.set(val);
    this.refreshDynamicInstance();
  }
  get options(): IButtonOptions { return this._options(); }

  @Input() set disabled(val: boolean) {
    this._disabled.set(val);
    this.refreshDynamicInstance();
  }
  get disabled(): boolean { return this._disabled(); }

  @ViewChild("contentTpl", { read: TemplateRef, static: false })
  override contentTpl: TemplateRef<any> | null = null;

  @ViewChildren(DynamicContentDirective, { read: DynamicContentDirective })
  override dynamicContents = new QueryList<DynamicContentDirective>();

  override refreshProperties(): void {
    this.baseInstance.options = this.options;
    this.baseInstance.disabled = this.disabled;
  }
}
