import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { ContainerStandardComponent } from './standard/standard.component';
import { IContainerOptions } from '../../models';
import { CONTAINER_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-container',
  template: `
    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="componentType(); inputs: componentInputs()"
      />
    } @else {
      <smart-container-standard [options]="options()" [class]="cssClass()">
        <ng-content />
      </smart-container-standard>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [ContainerStandardComponent, NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContainerComponent {
  private injectedComponent = inject(CONTAINER_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });

  options = input<IContainerOptions>();
  cssClass = input<string>('', { alias: 'class' });

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() => ({
    options: this.options(),
    cssClass: this.cssClass(),
  }));
}
