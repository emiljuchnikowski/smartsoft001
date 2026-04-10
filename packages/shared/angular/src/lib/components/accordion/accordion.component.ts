import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  ModelSignal,
  ViewEncapsulation,
} from '@angular/core';

import { IAccordionOptions } from '../../models';
import { AccordionBodyComponent } from './body/body.component';
import { AccordionHeaderComponent } from './header/header.component';

@Component({
  selector: 'smart-accordion',
  template: `
    <div
      class="smart:divide-y smart:divide-gray-200 smart:rounded-lg smart:border smart:border-gray-200 dark:smart:divide-white/10 dark:smart:border-white/10"
    >
      <div (click)="toggle()">
        <smart-accordion-header
          [open]="show()"
          [disabled]="options()?.disabled ?? false"
        >
          <ng-content select="[accordionHeader]"></ng-content>
        </smart-accordion-header>
      </div>

      @if (show()) {
        <smart-accordion-body>
          <ng-content select="[accordionBody]"></ng-content>
        </smart-accordion-body>
      }
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AccordionHeaderComponent, AccordionBodyComponent],
})
export class AccordionComponent {
  show: ModelSignal<boolean> = model<boolean>(false);
  options = input<IAccordionOptions>();

  toggle(): void {
    if (this.options()?.disabled) return;
    this.show.update((val) => !val);
  }
}
