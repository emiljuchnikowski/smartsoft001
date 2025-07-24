import {Component, ElementRef, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

import {IEntity} from "@smartsoft001/domain-core";
import {StyleService} from "@smartsoft001/angular";

import {ICrudFilterQueryItem} from '../../models/interfaces';
import { CrudFacade } from '../../+state/crud.facade';

@Component({
  selector: 'smart-crud-filters-config',
  templateUrl: './filters-config.component.html',
  styleUrls: ['./filters-config.component.scss']
})
export class FiltersConfigComponent<T extends IEntity<string>> implements OnInit {
  query$: Observable<ICrudFilterQueryItem[]>;

  constructor(
      private readonly facade: CrudFacade<any>,
      private styleService: StyleService,
      private elementRef: ElementRef
  ) { }

  onRemoveQuery(item: ICrudFilterQueryItem): void {
    const index = this.facade.filter.query.indexOf(item);
    if (index > -1) {
      this.facade.filter.query.splice(index, 1);
    }
    this.facade.read(this.facade.filter);
  }

  ngOnInit(): void {
    this.styleService.init(this.elementRef);

    this.query$ = this.facade.filter$.pipe(
        map(filter => {
          return filter?.query?.filter(i => !i.hidden);
        })
    );
  }
}
