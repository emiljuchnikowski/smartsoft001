import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { MultiColumnLayoutStandardComponent } from './standard/standard.component';
import { IMultiColumnLayoutOptions } from '../../models';
import { MULTI_COLUMN_LAYOUT_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-multi-column-layout',
  template: `
    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="componentType(); inputs: componentInputs()"
      />
    } @else {
      <smart-multi-column-layout-standard
        [options]="options()"
        [class]="cssClass()"
      >
        <ng-content />
      </smart-multi-column-layout-standard>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [MultiColumnLayoutStandardComponent, NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiColumnLayoutComponent {
  private injectedComponent = inject(
    MULTI_COLUMN_LAYOUT_STANDARD_COMPONENT_TOKEN,
    {
      optional: true,
    },
  );

  options = input<IMultiColumnLayoutOptions>();
  cssClass = input<string>('', { alias: 'class' });

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() => ({
    options: this.options(),
    cssClass: this.cssClass(),
  }));
}
