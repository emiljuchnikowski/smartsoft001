import { Component, ElementRef, inject, OnInit } from '@angular/core';

import {
  BaseComponent,
  ButtonComponent,
  IButtonOptions,
  PopoverService,
  StyleService,
} from '@smartsoft001/angular';
import { IEntity } from '@smartsoft001/domain-core';

import { CrudFacade } from '../../+state/crud.facade';

@Component({
  selector: 'smart-crud-export',
  template: `
    <div class="p-5">
      <p class="my-2.5 mx-0">
        <smart-button [options]="buttonExportCsvOptions" class="w-full block"
          >CSV</smart-button
        >
      </p>
      <p>
        <smart-button [options]="buttonExportXlsxOptions" class="w-full block"
          >XLSX</smart-button
        >
      </p>
    </div>
  `,
  imports: [ButtonComponent],
})
export class ExportComponent<T extends IEntity<string>>
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
      expand: 'block',
    };
  }
}
