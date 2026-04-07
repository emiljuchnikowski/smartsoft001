import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'smart-accordion-body',
  template: `
    <div
      class="smart:px-4 smart:py-3 smart:text-gray-600 dark:smart:text-gray-300"
    >
      <ng-content></ng-content>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionBodyComponent {}
