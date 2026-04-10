import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { ICardOptions, SmartCardVariant } from '../../models';

@Component({
  selector: 'smart-card',
  template: `
    <div [class]="containerClasses()">
      @let title = options()?.title;
      @if (hasHeader()) {
        <div [class]="headerClasses()">
          @if (title) {
            <h3
              class="smart:text-base smart:font-semibold smart:text-gray-900 dark:smart:text-white"
            >
              {{ title }}
            </h3>
          }
          <ng-content select="[cardHeader]"></ng-content>
        </div>
      }

      <div [class]="bodyClasses()">
        <ng-content></ng-content>
      </div>

      @if (hasFooter()) {
        <div [class]="footerClasses()">
          <ng-content select="[cardFooter]"></ng-content>
        </div>
      }
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  readonly options = input<ICardOptions>();
  readonly hasHeader = input<boolean>(false);
  readonly hasFooter = input<boolean>(false);

  containerClasses = computed(() => {
    const opts = this.options();
    const variant: SmartCardVariant = opts?.variant ?? 'basic';
    const classes = ['smart:overflow-hidden'];
    const hasDivider = this.hasHeader() || this.hasFooter();

    if (hasDivider && !opts?.grayFooter && !opts?.grayBody) {
      classes.push(
        'smart:divide-y',
        'smart:divide-gray-200',
        'dark:smart:divide-white/10',
      );
    }

    switch (variant) {
      case 'edge-to-edge':
        classes.push(
          'smart:bg-white',
          'smart:shadow-sm',
          'sm:smart:rounded-lg',
          'dark:smart:bg-gray-800/50',
          'dark:smart:shadow-none',
          'dark:smart:outline',
          'dark:smart:-outline-offset-1',
          'dark:smart:outline-white/10',
        );
        break;
      case 'well':
        classes.push(
          'smart:rounded-lg',
          'smart:bg-gray-50',
          'dark:smart:bg-gray-800/50',
        );
        break;
      case 'well-on-gray':
        classes.push(
          'smart:rounded-lg',
          'smart:bg-gray-200',
          'dark:smart:bg-gray-800/50',
        );
        break;
      case 'well-edge-to-edge':
        classes.push(
          'smart:bg-gray-50',
          'sm:smart:rounded-lg',
          'dark:smart:bg-gray-800/50',
        );
        break;
      default:
        classes.push(
          'smart:rounded-lg',
          'smart:bg-white',
          'smart:shadow-sm',
          'dark:smart:bg-gray-800/50',
          'dark:smart:shadow-none',
          'dark:smart:outline',
          'dark:smart:-outline-offset-1',
          'dark:smart:outline-white/10',
        );
        break;
    }

    return classes.join(' ');
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
