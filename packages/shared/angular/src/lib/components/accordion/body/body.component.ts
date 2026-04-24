import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'smart-accordion-body',
  template: `
    <div [class]="bodyClasses()">
      <ng-content></ng-content>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionBodyComponent {
  cssClass = input<string>('');

  bodyClasses = computed(() => {
    const classes = [
      'smart:px-4',
      'smart:py-3',
      'smart:text-gray-600',
      'smart:dark:text-gray-300',
    ];

    const extra = this.cssClass();
    if (extra) classes.push(extra);

    return classes.join(' ');
  });
}
