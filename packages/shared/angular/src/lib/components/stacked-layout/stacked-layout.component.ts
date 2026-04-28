import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { StackedLayoutStandardComponent } from './standard/standard.component';
import { IStackedLayoutOptions } from '../../models';
import { STACKED_LAYOUT_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-stacked-layout',
  template: `
    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="componentType(); inputs: componentInputs()"
      />
    } @else {
      <smart-stacked-layout-standard [options]="options()" [class]="cssClass()">
        <ng-content />
      </smart-stacked-layout-standard>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [StackedLayoutStandardComponent, NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StackedLayoutComponent {
  private injectedComponent = inject(STACKED_LAYOUT_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });

  options = input<IStackedLayoutOptions>();
  cssClass = input<string>('', { alias: 'class' });

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() => ({
    options: this.options(),
    cssClass: this.cssClass(),
  }));
}
