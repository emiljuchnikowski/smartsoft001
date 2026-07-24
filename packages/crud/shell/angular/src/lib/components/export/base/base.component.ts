import { Directive, ElementRef, inject, Injector, OnInit } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, take } from 'rxjs/operators';

import {
  BaseComponent,
  IButtonOptions,
  PopoverService,
  StyleService,
} from '@smartsoft001/angular';
import { IEntity } from '@smartsoft001/domain-core';

import { CrudFacade } from '../../../+state';

@Directive()
export class ExportBaseComponent<T extends IEntity<string>>
  extends BaseComponent
  implements OnInit
{
  private facade = inject(CrudFacade<T>);
  private popoverService = inject(PopoverService);
  private styleService = inject(StyleService);
  private elementRef = inject(ElementRef);
  private injector = inject(Injector);

  buttonExportCsvOptions: IButtonOptions = this.initButtonExportOptions('csv');
  buttonExportXlsxOptions: IButtonOptions =
    this.initButtonExportOptions('xlsx');

  ngOnInit(): void {
    this.styleService.init(this.elementRef);
  }

  private initButtonExportOptions(format: string): IButtonOptions {
    return {
      click: () => {
        this.facade.export(
          {
            ...this.facade.filter(),
            offset: undefined,
            limit: undefined,
          },
          format,
        );

        toObservable(this.facade.loaded, { injector: this.injector })
          .pipe(
            filter((l) => !!l),
            take(1),
          )
          .subscribe(() => this.popoverService.close().then());
      },
      loading: this.facade.loading,
    };
  }
}
