import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { SidebarLayoutStandardComponent } from './standard/standard.component';
import { ISidebarLayoutOptions } from '../../models';
import { SIDEBAR_LAYOUT_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-sidebar-layout',
  template: `
    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="componentType(); inputs: componentInputs()"
      />
    } @else {
      <smart-sidebar-layout-standard [options]="options()" [class]="cssClass()">
        <ng-content />
      </smart-sidebar-layout-standard>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [SidebarLayoutStandardComponent, NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarLayoutComponent {
  private injectedComponent = inject(SIDEBAR_LAYOUT_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });

  options = input<ISidebarLayoutOptions>();
  cssClass = input<string>('', { alias: 'class' });

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() => ({
    options: this.options(),
    cssClass: this.cssClass(),
  }));
}
