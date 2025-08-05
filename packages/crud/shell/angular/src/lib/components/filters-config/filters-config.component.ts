import { IonChip, IonIcon, IonLabel, IonToolbar } from '@ionic/angular/standalone';
import { Component, computed, ElementRef, OnInit, Signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import {StyleService} from "@smartsoft001/angular";

import {ICrudFilterQueryItem} from '../../models';
import { CrudFacade } from '../../+state/crud.facade';

@Component({
  selector: 'smart-crud-filters-config',
  templateUrl: './filters-config.component.html',
  imports: [
    IonToolbar,
    IonChip,
    IonIcon,
    IonLabel,
    TranslatePipe
  ],
  styleUrls: ['./filters-config.component.scss']
})
export class FiltersConfigComponent implements OnInit {
  query: Signal<ICrudFilterQueryItem[]>;

  constructor(
      private readonly facade: CrudFacade<any>,
      private styleService: StyleService,
      private elementRef: ElementRef
  ) { }

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
      return filter?.query?.filter(i => !i.hidden);
    });
  }
}
