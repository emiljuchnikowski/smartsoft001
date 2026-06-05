import { inject, Injectable, signal, Signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { IModelLabelOptions, IModelLabelProvider } from '@smartsoft001/angular';

@Injectable()
export class CrudModelLabelProvider extends IModelLabelProvider {
  private translateService = inject(TranslateService);
  // Delegate to an app-level provider if one exists higher in the injector tree;
  // otherwise fall back to translating 'MODEL.<key>'. (FRA-293 GAP / belt-and-suspenders.)
  private parent = inject(IModelLabelProvider, {
    optional: true,
    skipSelf: true,
  });

  override get(options: IModelLabelOptions): Signal<string> {
    if (this.parent) return this.parent.get(options);
    return signal(
      this.translateService.instant('MODEL.' + options.key) as string,
    );
  }
}
