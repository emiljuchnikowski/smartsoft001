import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { StatsStandardComponent } from './standard';
import { IStatsOptions } from '../../models';
import { STATS_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-stats',
  template: `
    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="componentType(); inputs: componentInputs()"
      />
    } @else {
      <smart-stats-standard [options]="options()" [class]="cssClass()" />
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [StatsStandardComponent, NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsComponent {
  private injectedComponent = inject(STATS_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });

  options = input<IStatsOptions>();
  cssClass = input<string>('', { alias: 'class' });

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() => ({
    options: this.options(),
    cssClass: this.cssClass(),
  }));
}
