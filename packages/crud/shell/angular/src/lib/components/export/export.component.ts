import {Component, ElementRef, OnInit} from '@angular/core';
import {Observable} from "rxjs";

import {BaseComponent, IButtonOptions, PopoverService, StyleService} from "@smartsoft001/angular";
import {IEntity} from "@smartsoft001/domain-core";

import {CrudFacade} from "../../+state/crud.facade";

@Component({
  selector: 'smart-crud-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent<T extends IEntity<string>> extends BaseComponent implements OnInit {

  buttonExportCsvOptions: IButtonOptions = this.initButtonExportOptions('csv');
  buttonExportXlsxOptions: IButtonOptions = this.initButtonExportOptions('xlsx');

  loading$: Observable<boolean> = this.facade.loading$;

  constructor(
      private facade: CrudFacade<T>,
      private popoverService: PopoverService,
      private styleService: StyleService,
      private elementRef: ElementRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.styleService.init(this.elementRef);
  }

  private initButtonExportOptions(format: string): IButtonOptions {
    return {
      click: () => {
        this.facade.export({
          ...this.facade.filter,
          offset: null,
          limit: null
        }, format);

        const subscription = this.facade.loaded$.subscribe(val => {
          if (!val) return;
          this.popoverService.close();
          subscription.unsubscribe();
        });
      },
      loading$: this.facade.loading$,
      expand: 'block'
    }
  }
}
