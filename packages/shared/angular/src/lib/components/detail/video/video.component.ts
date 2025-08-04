import {ChangeDetectorRef, Component} from '@angular/core';

import {IEntity} from "@smartsoft001/domain-core";

import {DetailBaseComponent} from "../base/base.component";
import {FileService} from '../../../services';

@Component({
    selector: 'smart-detail-video',
    template: `
      @let item = options?.item();
      @if (item && options?.key) {
        <video style="width: 100%" controls controlsList="nodownload">
          <source type="video/mp4" [src]="getUrl(item[options.key!])">
          Your browser does not support the video tag.
        </video>
      }
    `,
    styleUrls: ['./video.component.scss']
})
export class DetailVideoComponent<T extends IEntity<string> & { [key: string]: any }> extends DetailBaseComponent<T> {
    constructor(cd: ChangeDetectorRef, private fileService: FileService) {
        super(cd);
    }

    getUrl(item: { id: string }): string {
        return this.fileService.getUrl(item.id);
    }
}
