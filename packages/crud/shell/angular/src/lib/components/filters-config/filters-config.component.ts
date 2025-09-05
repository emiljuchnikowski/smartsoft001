import { Component, computed, ElementRef, OnInit, Signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { StyleService } from '@smartsoft001/angular';

import { CrudFacade } from '../../+state/crud.facade';
import { ICrudFilterQueryItem } from '../../models';

@Component({
  selector: 'smart-crud-filters-config',
  template: `
    @let query = this.query();
    @if (query && query?.length) {
      <!--  <ion-toolbar>-->
      @for (item of query; track item) {
        <!--      <ion-chip (click)="onRemoveQuery(item)" color="medium" outline="true">-->
        <!--        <ion-icon name="filter-circle-outline" color="primary"></ion-icon>-->
        <!--        <ion-label>-->
        {{ 'MODEL.' + item.key | translate }} {{ item.type }}
        {{ item.value | translate }}
        <!--        </ion-label>-->
        <!--        <ion-icon name="close" color="danger"></ion-icon>-->
        <!--      </ion-chip>-->
      }
      <!--  </ion-toolbar>-->
    }
  `,
  imports: [TranslatePipe],
  styles: [
    `
      :host {
        ion-label {
          font-size: var(--small-font-size);
        }
      }
    `,
  ],
})
export class FiltersConfigComponent implements OnInit {
  query: Signal<ICrudFilterQueryItem[]>;

  constructor(
    private readonly facade: CrudFacade<any>,
    private styleService: StyleService,
    private elementRef: ElementRef,
  ) {}

  onRemoveQuery(item: ICrudFilterQueryItem): void {
    const index = this.facade.filter().query.indexOf(item);
    if (index > -1) {
      this.facade.filter().query.splice(index, 1);
    }
    this.facade.read(this.facade.filter());
  }

  ngOnInit(): void {
    this.styleService.init(this.elementRef);

    this.query = computed(() => {
      const filter = this.facade.filter();
      return filter?.query?.filter((i) => !i.hidden);
    });
  }
}
