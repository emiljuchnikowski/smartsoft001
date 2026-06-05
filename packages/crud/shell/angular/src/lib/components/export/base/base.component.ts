import { Directive, ElementRef, inject, OnInit } from '@angular/core';

import {
  BaseComponent,
  IButtonOptions,
  PopoverService,
  StyleService,
} from '@smartsoft001/angular';
import { IEntity } from '@smartsoft001/domain-core';

import { CrudFacade } from '../../../+state';

// TODO(FRA-293 Tor A / Phase 3): author OnPush-safe when the template is rebuilt.
@Directive()
export class ExportBaseComponent<T extends IEntity<string>>
  extends BaseComponent
  implements OnInit
{
  private facade = inject(CrudFacade<T>);
  private popoverService = inject(PopoverService);
  private styleService = inject(StyleService);
  private elementRef = inject(ElementRef);

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

        const loading = this.facade.loading();
        if (loading) return;
        this.popoverService.close().then();
      },
      loading: this.facade.loading,
    };
  }
}
