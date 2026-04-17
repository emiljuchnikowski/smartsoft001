import { Component, computed, inject, signal, Signal } from '@angular/core';

import { FileService } from '../../../services';
import { DetailBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-detail-image',
  template: `
    @let url = imageUrl();
    @if (url) {
      <img [class]="imageClasses()" [src]="url" alt="" />
    }
  `,
})
export class DetailImageComponent<
  T extends { [key: string]: any } | undefined,
> extends DetailBaseComponent<T> {
  private fileService = inject(FileService);

  imageUrl: Signal<string | null> = signal(null);

  imageClasses = computed(() => {
    const classes = [
      'smart:h-[150px]',
      'smart:w-[150px]',
      'smart:rounded-lg',
      'smart:object-cover',
    ];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

  protected override afterSetOptionsHandler() {
    const item = this.options()?.item?.();
    if (item) {
      this.imageUrl = computed(() => {
        const key = this.options()?.key;
        if (!item || !key) return null;

        return this.fileService.getUrl(item[key].id);
      });
    }
  }
}
