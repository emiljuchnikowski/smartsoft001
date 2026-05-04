import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { SmartColor, SmartSize } from '../../models';
import { LOADER_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';
import { LoaderStandardComponent } from './standard/standard.component';

@Component({
  selector: 'smart-loader',
  template: `
    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="componentType(); inputs: componentInputs()"
      />
    } @else {
      <smart-loader-standard
        [show]="show()"
        [size]="size()"
        [color]="color()"
        [class]="cssClass()"
      />
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [LoaderStandardComponent, NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {
  private injectedComponent = inject(LOADER_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });

  show = input<boolean>(false);
  size = input<SmartSize>('md');
  color = input<SmartColor>('indigo');
  cssClass = input<string>('', { alias: 'class' });

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() => ({
    show: this.show(),
    size: this.size(),
    color: this.color(),
    cssClass: this.cssClass(),
  }));
}
