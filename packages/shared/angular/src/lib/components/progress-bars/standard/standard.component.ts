import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

import { ProgressBarsBaseComponent } from '../base';

@Component({
  selector: 'smart-progress-bars-standard',
  templateUrl: './standard.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
})
export class ProgressBarsStandardComponent extends ProgressBarsBaseComponent {
  protected onStepClick(stepId: string): void {
    this.stepClick.emit({ stepId });
  }

  protected get isBarLayout(): boolean {
    return this.options()?.layout === 'progress-bar';
  }

  protected get clampedValue(): number {
    const v = this.options()?.value ?? 0;
    return Math.max(0, Math.min(100, v));
  }
}
