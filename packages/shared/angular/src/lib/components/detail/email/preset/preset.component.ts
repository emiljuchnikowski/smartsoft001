import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';

import { DetailEmailComponent } from '../email.component';

@Component({
  selector: 'smart-detail-email-preset',
  template: `
    @let item = options()?.item?.();
    @let key = options()?.key;
    @if (item && key) {
      <a
        data-role="link"
        [class]="emailClasses()"
        [href]="'mailto:' + item[key]"
      >
        <svg
          data-role="icon"
          class="smart:size-4 smart:shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
          />
        </svg>
        {{ item[key] }}
      </a>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DetailEmailPresetComponent<
  T extends { [key: string]: any } | undefined,
> extends DetailEmailComponent<T> {
  override emailClasses = computed(() => {
    const classes = [
      'smart:inline-flex',
      'smart:items-center',
      'smart:gap-x-1.5',
      'smart:text-sm',
      'smart:text-blue-600',
      'smart:hover:underline',
      'smart:dark:text-blue-400',
    ];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}
