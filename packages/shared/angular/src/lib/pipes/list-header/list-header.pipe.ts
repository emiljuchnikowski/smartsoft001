import {
  Inject,
  Optional,
  Pipe,
  PipeTransform,
  signal,
  Signal,
  Type,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { IModelLabelProvider, MODEL_LABEL_PROVIDER } from '../../providers';

@Pipe({
  name: 'smartListHeader',
})
export class ListHeaderPipe<T> implements PipeTransform {
  constructor(
    private translateService: TranslateService,
    @Optional()
    @Inject(MODEL_LABEL_PROVIDER)
    private modelLabelProvider: IModelLabelProvider,
  ) {}

  transform(data: T, key: string, type?: Type<any>): Signal<string> {
    if (key.indexOf('__array') === 0) {
      const info = key.split('.');
      const arrayKey = info[1];
      const index = Number(info[2]);
      const headerKey = info[3];

      return signal((data as any)[0][arrayKey][index][headerKey]);
    }

    if (this.modelLabelProvider) {
      const result = this.modelLabelProvider.get({ type, key });
      if (result) return result;
    }

    return signal(this.translateService.instant('MODEL.' + key));
  }
}
