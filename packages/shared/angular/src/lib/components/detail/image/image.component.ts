import { ChangeDetectorRef, Component, computed, Signal } from '@angular/core';
import { IonCard, IonImg } from '@ionic/angular/standalone';

import {DetailBaseComponent} from "../base/base.component";
import {FileService} from '../../../services';

@Component({
    selector: 'smart-detail-image',
    template: `
        <ion-card>
            @let url = imageUrl();
            @if (url) {
                <ion-img style="margin: 10px; height: 150px; width: 150px"
                         [src]="url"></ion-img>
            }
        </ion-card>
    `,
    imports: [
        IonCard,
        IonImg,
    ],
    styleUrls: ['./image.component.scss']
})
export class DetailImageComponent<T extends { [key: string]: any }> extends DetailBaseComponent<T> {
    imageUrl!: Signal<string| null>;

    constructor(cd: ChangeDetectorRef, private fileService: FileService) {
        super(cd);
    }

    protected override afterSetOptionsHandler() {
        super.afterSetOptionsHandler();

        if (this.options?.item) {
            this.imageUrl = computed(() => {
                const item = this.options?.item?.();
                if (!item || !item[this.options.key]) return null

                return this.fileService.getUrl(item[this.options.key].id);
            });
        }
    }
}
