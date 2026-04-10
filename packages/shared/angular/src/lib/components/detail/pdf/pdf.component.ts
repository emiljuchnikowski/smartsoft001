import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { IEntity } from '@smartsoft001/domain-core';

import { IButtonOptions } from '../../../models';
import { FileService } from '../../../services';
// TODO: ButtonComponent moved to @smartsoft001-pro/angular (FRA-110)
// import { ButtonComponent } from '../../button';
import { DetailBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-detail-pdf',
  template: `
    @let item = options()?.item?.();
    @if (item && options()?.key) {
      <!-- TODO: ButtonComponent moved to @smartsoft001-pro/angular (FRA-110)
      <smart-button [options]="getButtonOptions(item)">
        {{ 'show' | translate }}
      </smart-button>
      -->
    }
  `,
  imports: [TranslatePipe],
})
export class DetailPdfComponent<
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
