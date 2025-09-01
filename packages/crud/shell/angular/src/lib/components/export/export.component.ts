import { Component, ElementRef, OnInit } from '@angular/core';

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
  templateUrl: './export.component.html',
  imports: [ButtonComponent],
  styleUrls: ['./export.component.scss'],
})
export class ExportComponent<T extends IEntity<string>>
  extends BaseComponent
  implements OnInit
{
  buttonExportCsvOptions: IButtonOptions = this.initButtonExportOptions('csv');
  buttonExportXlsxOptions: IButtonOptions =
    this.initButtonExportOptions('xlsx');

  constructor(
    private facade: CrudFacade<T>,
    private popoverService: PopoverService,
    private styleService: StyleService,
    private elementRef: ElementRef,
  ) {
    super();
  }

  ngOnInit(): void {
    this.styleService.init(this.elementRef);
  }

  private initButtonExportOptions(format: string): IButtonOptions {
    return {
      click: () => {
        this.facade.export(
          {
            ...this.facade.filter(),
            offset: null,
            limit: null,
          },
          format,
        );

        const loading = this.facade.loading();
        if (loading) return;
        this.popoverService.close();
      },
      loading: this.facade.loading,
      expand: 'block',
    };
  }
}
