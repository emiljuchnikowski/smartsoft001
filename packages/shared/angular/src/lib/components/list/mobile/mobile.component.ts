import {AfterViewInit, Component, ViewChild, ViewContainerRef} from "@angular/core";
import {
  IonInfiniteScroll, IonInfiniteScrollContent,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList
} from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';

import { IEntity } from "@smartsoft001/domain-core";

import { ListBaseComponent } from "../base/base.component";
import {IListComponentFactories, IListInternalOptions} from "../../../models";
import { FileUrlPipe, ListCellPipe } from '../../../pipes';
import { PagingComponent } from '../../paging';

@Component({
  selector: 'smart-list-mobile',
  templateUrl: './mobile.component.html',
  styleUrls: ['./mobile.component.scss'],
  imports: [
    IonList,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    TranslatePipe,
    IonItem,
    IonLabel,
    FileUrlPipe,
    LazyLoadImageModule,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    PagingComponent,
    AsyncPipe,
    ListCellPipe
  ]
})
export class ListMobileComponent<T extends IEntity<string & { [key: string]: any; }>>
  extends ListBaseComponent<T>
  implements AfterViewInit {

  listMobile$ = this.list$ as Observable<readonly T[]>;

  componentFactories: IListComponentFactories<T> | null = null;

  @ViewChild("topTpl", { read: ViewContainerRef, static: true })
  topTpl!: ViewContainerRef;

  protected override initList(val: IListInternalOptions<T>): void {
    super.initList(val);

    this.componentFactories = val.componentFactories ?? null;

    this.generateDynamicComponents();
  }

  ngAfterViewInit(): void {
    this.generateDynamicComponents();
  }

  private generateDynamicComponents(): void {
    if (!this.componentFactories) return;

    if (this.componentFactories.top && this.topTpl) {
      if (!this.topTpl.get(0)) {
        this.topTpl.createComponent(this.componentFactories.top);
      }
    }
  }
}
