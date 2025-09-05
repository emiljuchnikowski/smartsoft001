import { ChangeDetectorRef, Component } from '@angular/core';

import { IEntity } from '@smartsoft001/domain-core';

import { FileService } from '../../../services';
import { DetailBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-detail-video',
  template: `
    @let item = options?.item();
    @if (item && options?.key) {
      <video style="width: 100%" controls controlsList="nodownload">
        <source type="video/mp4" [src]="getUrl(item)" />
        Your browser does not support the video tag.
      </video>
    }
  `,
})
export class DetailVideoComponent<
  T extends IEntity<string>,
> extends DetailBaseComponent<T> {
  constructor(
    cd: ChangeDetectorRef,
    private fileService: FileService,
  ) {
    super(cd);
  }

  getUrl(item: T): string {
    return this.fileService.getUrl((item as any)[this.options.key].id);
  }
}
