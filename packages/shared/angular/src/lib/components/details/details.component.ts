import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { IEntity } from '@smartsoft001/domain-core';

import { IDetailsOptions } from '../../models';
import { DETAILS_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';
import { DetailsStandardComponent } from './standard/standard.component';

@Component({
  selector: 'smart-details',
  template: `
    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="componentType(); inputs: componentInputs()"
      />
    } @else {
      <smart-details-standard
        [options]="options()"
        [class]="cssClass()"
      ></smart-details-standard>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [DetailsStandardComponent, NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsComponent<T extends IEntity<string>> {
  private injectedComponent = inject(DETAILS_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });

  options = input<IDetailsOptions<T> | undefined>(undefined);
  cssClass = input<string>('', { alias: 'class' });

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() => ({
    options: this.options(),
    class: this.cssClass(),
  }));
}
