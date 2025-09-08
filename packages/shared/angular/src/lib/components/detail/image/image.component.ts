import { Component, computed, inject, Signal } from '@angular/core';

import { FileService } from '../../../services';
import { DetailBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-detail-image',
  template: `
    <!--    <ion-card>-->
    @let url = imageUrl();
    @if (url) {
      <!--        <ion-img-->
      <!--          style="margin: 10px; height: 150px; width: 150px"-->
      <!--          [src]="url"-->
      <!--        ></ion-img>-->
    }
    <!--    </ion-card>-->
  `,
})
export class DetailImageComponent<
  T extends { [key: string]: any } | undefined,
> extends DetailBaseComponent<T> {
  private fileService = inject(FileService);

  imageUrl!: Signal<string | null>;

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
