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

import { IProgressStepClick } from './base/base.component';
import { ProgressBarsStandardComponent } from './standard';
import { IProgressBarsOptions } from '../../models';
import { PROGRESS_BARS_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';
import { forwardOutletOutputs } from '../base/forward-outlet-outputs';

@Component({
  selector: 'smart-progress-bars',
  template: `
    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="componentType(); inputs: componentInputs()"
      />
    } @else {
      <smart-progress-bars-standard
        [options]="options()"
        [class]="cssClass()"
        (stepClick)="stepClick.emit($event)"
      />
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [ProgressBarsStandardComponent, NgComponentOutlet],
  host: { class: 'smart:contents' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBarsComponent {
  private injectedComponent = inject(PROGRESS_BARS_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });

  options = input<IProgressBarsOptions>();
  cssClass = input<string>('', { alias: 'class' });

  stepClick = output<IProgressStepClick>();

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() => ({
    options: this.options(),
    cssClass: this.cssClass(),
  }));

  private readonly outlet = viewChild(NgComponentOutlet);

  constructor() {
    forwardOutletOutputs(this.outlet, {
      stepClick: this.stepClick,
    });
  }
}
