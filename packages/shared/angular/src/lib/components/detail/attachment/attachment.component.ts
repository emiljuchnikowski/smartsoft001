import {ChangeDetectorRef, Component} from '@angular/core';

import {IEntity} from "@smartsoft001/domain-core";

import {DetailBaseComponent} from "../base/base.component";
import {IButtonOptions} from "../../../models";
import {FileService} from "../../../services/file/file.service";

@Component({
    selector: 'smart-detail-attachment',
    templateUrl: './attachment.component.html',
    styleUrls: ['./attachment.component.scss']
})
export class DetailAttachmentComponent<T extends IEntity<string>> extends DetailBaseComponent<T> {
    constructor(cd: ChangeDetectorRef, private fileService: FileService) {
        super(cd);
    }

    getButtonOptions(item: { id }): IButtonOptions {
        return {
            click: () => {
                this.fileService.download(item.id);
            }
        }
    }
}
