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

import { IVerticalNavItemClick } from './base/base.component';
import { VerticalNavigationStandardComponent } from './standard';
import { IVerticalNavOptions } from '../../models';
import { VERTICAL_NAVIGATION_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-vertical-navigation',
  template: `
    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="componentType(); inputs: componentInputs()"
      />
    } @else {
      <smart-vertical-navigation-standard
        [options]="options()"
        [class]="cssClass()"
        (itemClick)="itemClick.emit($event)"
      />
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [VerticalNavigationStandardComponent, NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerticalNavigationComponent {
  private injectedComponent = inject(
    VERTICAL_NAVIGATION_STANDARD_COMPONENT_TOKEN,
    {
      optional: true,
    },
  );

  options = input<IVerticalNavOptions>();
  cssClass = input<string>('', { alias: 'class' });

  itemClick = output<IVerticalNavItemClick>();

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() => ({
    options: this.options(),
    cssClass: this.cssClass(),
  }));
}
