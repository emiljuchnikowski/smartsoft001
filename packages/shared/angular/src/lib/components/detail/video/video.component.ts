import { Component, inject } from '@angular/core';

import { IEntity } from '@smartsoft001/domain-core';

import { FileService } from '../../../services';
import { DetailBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-detail-video',
  template: `
    @let item = options()?.item?.();
    @if (item && options()?.key) {
      <video style="width: 100%" controls controlsList="nodownload">
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

  getUrl(item: T): string | null {
    const key = this.options()?.key;
    if (key) {
      return this.fileService.getUrl((item as any)[key].id);
    }

    return null;
  }
}
