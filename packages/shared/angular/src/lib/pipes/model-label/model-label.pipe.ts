import { Inject, Optional, Pipe, PipeTransform, Signal, Type } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {Observable, of} from "rxjs";

import {IModelLabelProvider, MODEL_LABEL_PROVIDER} from "../../providers/model-label.provider";
import { toSignal } from '@angular/core/rxjs-interop';

@Pipe({
    name: 'smartModelLabel'
})
export class ModelLabelPipe<T> implements PipeTransform {
    constructor(
        private translateService: TranslateService,
        @Optional() @Inject(MODEL_LABEL_PROVIDER) private modelLabelProvider: IModelLabelProvider) {
    }

    transform(instance: T, key: string, type?: Type<any> | Function): string {
        if (this.modelLabelProvider) {
            const result = toSignal(this.modelLabelProvider.get({
                instance: instance,
                key: key,
                type: type as Type<any>
            }));

            if (result()) return result() as string;
        }

        return toSignal(this.translateService.instant('MODEL.' + key))() as string;
    }
}
