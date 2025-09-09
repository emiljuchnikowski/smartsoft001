import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { IEntity } from '@smartsoft001/domain-core';

import { IButtonOptions } from '../../../models';
import { FileService } from '../../../services';
import { ButtonComponent } from '../../button';
import { DetailBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-detail-attachment',
  template: `
    @let item = options()?.item?.();
    @if (item && options()?.key) {
      <smart-button [options]="getButtonOptions(item)">
        {{ 'download' | translate }}
      </smart-button>
    }
  `,
  imports: [ButtonComponent, TranslatePipe],
})
export class DetailAttachmentComponent<
  T extends IEntity<string> | undefined,
> extends DetailBaseComponent<T> {
  private fileService = inject(FileService);

  getButtonOptions(item: T): IButtonOptions {
    return {
      click: () => {
        const key = this.options()?.key;
        if (key) {
          this.fileService.download((item as any)[key].id);
        }
      },
    };
  }
}
