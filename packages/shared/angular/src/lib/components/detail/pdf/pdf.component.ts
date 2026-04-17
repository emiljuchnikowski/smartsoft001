import { Component, computed, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { IEntity } from '@smartsoft001/domain-core';

import { FileService } from '../../../services';
import { DetailBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-detail-pdf',
  template: `
    @let item = options()?.item?.();
    @let key = options()?.key;
    @if (item && key) {
      <button type="button" [class]="buttonClasses()" (click)="show(item, key)">
        {{ 'show' | translate }}
      </button>
    }
  `,
  imports: [TranslatePipe],
})
export class DetailPdfComponent<
  T extends IEntity<string> | undefined,
> extends DetailBaseComponent<T> {
  private fileService = inject(FileService);

  buttonClasses = computed(() => {
    const classes = [
      'smart:inline-flex',
      'smart:items-center',
      'smart:rounded-md',
      'smart:bg-indigo-600',
      'smart:px-3',
      'smart:py-2',
      'smart:text-sm',
      'smart:font-semibold',
      'smart:text-white',
      'smart:shadow-sm',
      'hover:smart:bg-indigo-500',
      'dark:smart:bg-indigo-500',
      'dark:hover:smart:bg-indigo-400',
    ];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

  show(item: T, key: string): void {
    this.fileService.download((item as any)[key].id);
  }
}
