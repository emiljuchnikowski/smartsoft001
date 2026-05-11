import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { ListContainerStandardComponent } from './standard/standard.component';
import { IListContainerOptions } from '../../models';
import { LIST_CONTAINER_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-list-container',
  template: `
    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="componentType(); inputs: componentInputs()"
      />
    } @else {
      <smart-list-container-standard [options]="options()" [class]="cssClass()">
        <ng-content />
      </smart-list-container-standard>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [ListContainerStandardComponent, NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListContainerComponent {
  private injectedComponent = inject(LIST_CONTAINER_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });

  options = input<IListContainerOptions>();
  cssClass = input<string>('', { alias: 'class' });

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() => ({
    options: this.options(),
    cssClass: this.cssClass(),
  }));
}
