import {
  computed,
  Directive,
  input,
  InputSignal,
  model,
  ModelSignal,
  TemplateRef,
} from '@angular/core';

import { IAccordionOptions } from '../../../models';

@Directive()
export abstract class AccordionBaseComponent {
  show: ModelSignal<boolean> = model<boolean>(false);
  options: InputSignal<IAccordionOptions | undefined> =
    input<IAccordionOptions>();
  cssClass: InputSignal<string> = input<string>('');

  headerTpl = input.required<TemplateRef<unknown>>();
  bodyTpl = input.required<TemplateRef<unknown>>();

  sharedContainerClasses = computed(() => {
    return [
      'smart:divide-y',
      'smart:divide-gray-200',
      'smart:rounded-lg',
      'smart:border',
      'smart:border-gray-200',
      'smart:dark:divide-white/10',
      'smart:dark:border-white/10',
    ];
  });

  toggle(): void {
    if (this.options()?.disabled) return;
    this.show.update((val) => !val);
  }
}
