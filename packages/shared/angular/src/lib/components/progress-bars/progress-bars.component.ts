import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  ViewEncapsulation,
} from '@angular/core';

import { IProgressStepClick } from './base/base.component';
import { ProgressBarsStandardComponent } from './standard';
import { IProgressBarsOptions } from '../../models';
import { PROGRESS_BARS_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

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
}
