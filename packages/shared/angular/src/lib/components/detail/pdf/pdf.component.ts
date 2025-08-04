import {ChangeDetectorRef, Component} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import {IEntity} from "@smartsoft001/domain-core";

import {DetailBaseComponent} from "../base/base.component";
import {IButtonOptions} from "../../../models";
import {FileService} from '../../../services';
import { ButtonComponent } from '../../button';

@Component({
    selector: 'smart-detail-pdf',
    template: `
      @let item = options?.item();
      @if (item && options.key) {
        <smart-button [options]="getButtonOptions(item[options.key!])">
          {{ 'show' | translate }}
        </smart-button>
      }
    `,
    imports: [
        ButtonComponent,
        TranslatePipe,
    ],
    styleUrls: ['./pdf.component.scss']
})
export class DetailPdfComponent<T extends IEntity<string> & { [key: string]: any }> extends DetailBaseComponent<T> {
    constructor(cd: ChangeDetectorRef, private fileService: FileService) {
        super(cd);
    }

    getButtonOptions(item: { id: any }): IButtonOptions {
        return {
            click: () => {
                this.fileService.download(item.id);
            }
        }
    }
}
