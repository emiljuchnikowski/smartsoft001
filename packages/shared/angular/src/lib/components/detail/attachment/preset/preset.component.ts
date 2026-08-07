import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { IEntity } from '@smartsoft001/domain-core';

import { DetailAttachmentComponent } from '../attachment.component';

@Component({
  selector: 'smart-detail-attachment-preset',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @let item = options()?.item?.();
    @let key = options()?.key;
    @if (item && key) {
      <span [class]="chipClasses()" data-role="chip">
        <svg
          class="smart:shrink-0 smart:size-5 smart:text-gray-500 smart:dark:text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"
          />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        </svg>
        @if (fileName()) {
          <span
            data-role="name"
            class="smart:text-sm smart:font-medium smart:text-gray-900 smart:dark:text-white smart:truncate"
          >
            {{ fileName() }}
          </span>
        }
        <button
          type="button"
          data-role="download"
          class="smart:inline-flex smart:items-center smart:gap-x-1 smart:text-sm smart:font-medium smart:text-gray-500 smart:hover:text-blue-600 smart:dark:text-gray-400 smart:dark:hover:text-blue-400 smart:focus:outline-hidden"
          (click)="download(item, key)"
        >
          {{ 'download' | translate }}
        </button>
      </span>
    }
  `,
  imports: [TranslatePipe],
})
export class DetailAttachmentPresetComponent<
  T extends IEntity<string> | undefined,
> extends DetailAttachmentComponent<T> {
  fileName = computed<string | null>(() => {
    const item = this.options()?.item?.();
    const key = this.options()?.key;
    if (!item || !key) return null;
    const value = (item as any)[key];
    return value?.fileName ?? value?.name ?? null;
  });

  chipClasses = computed(() => {
    const classes = [
      'smart:inline-flex',
      'smart:items-center',
      'smart:gap-x-3',
      'smart:p-3',
      'smart:bg-white',
      'smart:dark:bg-gray-800',
      'smart:border',
      'smart:border-gray-200',
      'smart:dark:border-gray-700',
      'smart:rounded-lg',
    ];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}
