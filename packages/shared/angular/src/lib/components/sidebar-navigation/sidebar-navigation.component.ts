import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import {
  ISidebarNavItemClick,
  ISidebarNavItemToggle,
} from './base/base.component';
import { SidebarNavigationStandardComponent } from './standard';
import { ISidebarNavOptions } from '../../models';
import { SIDEBAR_NAVIGATION_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';
import { forwardOutletOutputs } from '../base/forward-outlet-outputs';
import { outletInputs } from '../base/outlet-inputs';

@Component({
  selector: 'smart-sidebar-navigation',
  template: `
    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="componentType(); inputs: componentInputs()"
      />
    } @else {
      <smart-sidebar-navigation-standard
        [options]="options()"
        [class]="cssClass()"
        (itemClick)="itemClick.emit($event)"
        (itemToggle)="itemToggle.emit($event)"
      />
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [SidebarNavigationStandardComponent, NgComponentOutlet],
  host: { class: 'smart:contents' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarNavigationComponent {
  private injectedComponent = inject(
    SIDEBAR_NAVIGATION_STANDARD_COMPONENT_TOKEN,
    {
      optional: true,
    },
  );

  options = input<ISidebarNavOptions>();
  cssClass = input<string>('', { alias: 'class' });

  itemClick = output<ISidebarNavItemClick>();
  itemToggle = output<ISidebarNavItemToggle>();

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() =>
    outletInputs(this.componentType(), {
      options: this.options(),
      cssClass: this.cssClass(),
    }),
  );

  private readonly outlet = viewChild(NgComponentOutlet);

  constructor() {
    forwardOutletOutputs(this.outlet, {
      itemClick: this.itemClick,
      itemToggle: this.itemToggle,
    });
  }
}
