import { Component, computed, inject } from '@angular/core';

import { IEntity } from '@smartsoft001/domain-core';

import { FileService } from '../../../services';
import { DetailBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-detail-video',
  template: `
    @let item = options()?.item?.();
    @if (item && options()?.key) {
      <video [class]="videoClasses()" controls controlsList="nodownload">
        <source type="video/mp4" [src]="getUrl(item)" />
        Your browser does not support the video tag.
      </video>
    }
  `,
})
export class DetailVideoComponent<
  T extends IEntity<string> | undefined,
> extends DetailBaseComponent<T> {
  private fileService = inject(FileService);

  videoClasses = computed(() => {
    const classes = ['smart:w-full', 'smart:rounded-lg'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

  getUrl(item: T): string | null {
    const key = this.options()?.key;
    if (key) {
      return this.fileService.getUrl((item as any)[key].id);
    }

    return null;
  }
}
