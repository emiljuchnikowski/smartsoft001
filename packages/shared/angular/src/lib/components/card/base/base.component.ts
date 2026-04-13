import {
  computed,
  Directive,
  input,
  InputSignal,
  TemplateRef,
} from '@angular/core';

import { ICardOptions } from '../../../models';

@Directive()
export abstract class CardBaseComponent {
  options: InputSignal<ICardOptions | undefined> = input<ICardOptions>();
  hasHeader: InputSignal<boolean> = input<boolean>(false);
  hasFooter: InputSignal<boolean> = input<boolean>(false);
  cssClass: InputSignal<string> = input<string>('');

  headerTpl = input<TemplateRef<unknown>>();
  bodyTpl = input.required<TemplateRef<unknown>>();
  footerTpl = input<TemplateRef<unknown>>();

  sharedContainerClasses = computed(() => {
    const opts = this.options();
    const classes = ['smart:overflow-hidden'];
    const hasDivider = this.hasHeader() || this.hasFooter();

    if (hasDivider && !opts?.grayFooter && !opts?.grayBody) {
      classes.push(
        'smart:divide-y',
        'smart:divide-gray-200',
        'dark:smart:divide-white/10',
      );
    }

    return classes;
  });

  headerClasses = computed(() => {
    return 'smart:px-4 smart:py-5 sm:smart:px-6';
  });

  bodyClasses = computed(() => {
    const opts = this.options();
    const classes = ['smart:px-4', 'smart:py-5', 'sm:smart:p-6'];

    if (opts?.grayBody) {
      classes.push('smart:bg-gray-50', 'dark:smart:bg-gray-800/50');
    }

    return classes.join(' ');
  });

  footerClasses = computed(() => {
    const opts = this.options();
    const classes = ['smart:px-4', 'smart:py-4', 'sm:smart:px-6'];

    if (opts?.grayFooter) {
      classes.push('smart:bg-gray-50', 'dark:smart:bg-gray-800/50');
    }

    return classes.join(' ');
  });
}
