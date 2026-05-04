import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  ViewEncapsulation,
} from '@angular/core';

import { IActionPanelActionClick } from './base/base.component';
import { ActionPanelStandardComponent } from './standard';
import { IActionPanelOptions } from '../../models';
import { ACTION_PANEL_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-action-panel',
  template: `
    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="componentType(); inputs: componentInputs()"
      />
    } @else {
      <smart-action-panel-standard
        [options]="options()"
        [class]="cssClass()"
        (actionClick)="actionClick.emit($event)"
      />
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [ActionPanelStandardComponent, NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionPanelComponent {
  private injectedComponent = inject(ACTION_PANEL_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });

  options = input<IActionPanelOptions>();
  cssClass = input<string>('', { alias: 'class' });

  actionClick = output<IActionPanelActionClick>();

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() => ({
    options: this.options(),
    cssClass: this.cssClass(),
  }));
}
