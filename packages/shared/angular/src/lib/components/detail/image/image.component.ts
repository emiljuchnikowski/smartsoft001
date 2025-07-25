import {ChangeDetectorRef, Component} from '@angular/core';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

import {DetailBaseComponent} from "../base/base.component";
import {FileService} from "../../../services/file/file.service";

@Component({
    selector: 'smart-detail-image',
    templateUrl: './image.component.html',
    styleUrls: ['./image.component.scss']
})
export class DetailImageComponent<T> extends DetailBaseComponent<T> {
    imageUrl$: Observable<string>;

    constructor(cd: ChangeDetectorRef, private fileService: FileService) {
        super(cd);
    }

    protected afterSetOptionsHandler() {
        super.afterSetOptionsHandler();

        this.imageUrl$ = this.options.item$.pipe(
            map(item => {
                if (!item || !item[this.options.key]) return null;

                return this.fileService.getUrl(item[this.options.key].id);
            })
        );
    }
}
