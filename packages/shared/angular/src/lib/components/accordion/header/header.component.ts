import {
  ChangeDetectionStrategy,
  Component,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { IconComponent } from '../../icon/icon.component';

@Component({
  selector: 'smart-accordion-header',
  template: `
    <button
      type="button"
      class="smart:flex smart:w-full smart:items-center smart:justify-between smart:px-4 smart:py-3 smart:text-left smart:font-medium smart:text-gray-900 smart:cursor-pointer hover:smart:bg-gray-50 dark:smart:text-white dark:hover:smart:bg-gray-800"
      [class.smart:cursor-not-allowed]="disabled()"
      [class.smart:opacity-50]="disabled()"
      [disabled]="disabled()"
    >
      <ng-content></ng-content>
      <smart-icon
        [name]="open() ? 'chevron-up' : 'chevron-down'"
        cssClass="smart:text-gray-400 smart:transition-transform smart:duration-200"
      />
    </button>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
})
export class AccordionHeaderComponent {
  open = input<boolean>(false);
  disabled = input<boolean>(false);
}
