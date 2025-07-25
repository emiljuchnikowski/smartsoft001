import {Inject, Optional, Pipe, PipeTransform, Type} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {Observable, of} from "rxjs";

import {IModelLabelProvider, MODEL_LABEL_PROVIDER} from "../../providers/model-label.provider";

@Pipe({
    name: 'smartModelLabel'
})
export class ModelLabelPipe<T> implements PipeTransform {
    constructor(
        private translateService: TranslateService,
        @Optional() @Inject(MODEL_LABEL_PROVIDER) private modelLabelProvider: IModelLabelProvider) {
    }

    transform(instance: T, key: string, type?: Type<any> | Function): Observable<string> {
        if (this.modelLabelProvider) {
            const result$ = this.modelLabelProvider.get({
                instance: instance,
                key: key,
                type: type as Type<any>
            });

            if (result$) return result$;
        }

        return of(this.translateService.instant('MODEL.' + key));
    }
}