import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { IInfoOptions } from '../../models';
import { INFO_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';
import { InfoStandardComponent } from './standard/standard.component';

@Component({
  selector: 'smart-info',
  template: `
    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="componentType(); inputs: componentInputs()"
      />
    } @else {
      <smart-info-standard [options]="options()" [class]="cssClass()" />
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [InfoStandardComponent, NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoComponent {
  private injectedComponent = inject(INFO_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });

  options = input.required<IInfoOptions>();
  cssClass = input<string>('', { alias: 'class' });

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() => ({
    options: this.options(),
    cssClass: this.cssClass(),
  }));
}
