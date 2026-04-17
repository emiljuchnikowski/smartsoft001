import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { IconDefaultComponent } from '@smartsoft001/angular';

@Component({
  selector: 'smart-accordion-header',
  template: `
    <button
      type="button"
      [class]="buttonClasses()"
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
  imports: [IconDefaultComponent],
})
export class AccordionHeaderComponent {
  open = input<boolean>(false);
  disabled = input<boolean>(false);
  cssClass = input<string>('');

  buttonClasses = computed(() => {
    const classes = [
      'smart:flex',
      'smart:w-full',
      'smart:items-center',
      'smart:justify-between',
      'smart:px-4',
      'smart:py-3',
      'smart:text-left',
      'smart:font-medium',
      'smart:text-gray-900',
      'smart:cursor-pointer',
      'hover:smart:bg-gray-50',
      'dark:smart:text-white',
      'dark:hover:smart:bg-gray-800',
    ];

    const extra = this.cssClass();
    if (extra) classes.push(extra);

    return classes.join(' ');
  });
}
