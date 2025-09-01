import {
  CdkCell,
  CdkHeaderCell,
  CdkHeaderRow,
  CdkRecycleRows,
  CdkRow,
  CdkTable,
} from '@angular/cdk/table';
import { NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  Signal,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import {
  MatCellDef,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderRowDef,
  MatRowDef,
} from '@angular/material/table';
import {
  IonButton,
  IonCheckbox,
  IonChip,
  IonContent,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { Subscription } from 'rxjs';

import { IEntity } from '@smartsoft001/domain-core';

import { DetailsDirective } from '../../../directives';
import { IListComponentFactories, IListInternalOptions } from '../../../models';
import { FileUrlPipe, ListCellPipe, ListHeaderPipe } from '../../../pipes';
import { PagingComponent } from '../../paging';
import { ListBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-list-desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.scss', '../../../styles/desktop.scss'],
  imports: [
    IonContent,
    IonCheckbox,
    CdkTable,
    MatSort,
    CdkRecycleRows,
    MatColumnDef,
    CdkHeaderCell,
    CdkCell,
    IonButton,
    IonIcon,
    MatHeaderCellDef,
    NgTemplateOutlet,
    MatCellDef,
    DetailsDirective,
    ListHeaderPipe,
    MatSortHeader,
    ListCellPipe,
    LazyLoadImageModule,
    FileUrlPipe,
    TranslatePipe,
    IonChip,
    MatHeaderRowDef,
    CdkHeaderRow,
    CdkRow,
    MatRowDef,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    PagingComponent,
  ],
})
export class ListDesktopComponent<T extends IEntity<string>>
  extends ListBaseComponent<T>
  implements OnInit, OnDestroy, AfterViewInit
{
  private _subscriptions = new Subscription();
  private _multiSelected: T[] = [];

  desktopList = this.list as Signal<T[]>;

  componentFactories: IListComponentFactories<T> | null = null;

  get desktopKeys(): Array<string> | null {
    if (this.keys) {
      return [
        ...(this.selectMode === 'multi' ? ['selectMulti'] : []),
        ...this.keys,
        ...(this.removeHandler ? ['removeAction'] : []),
        // TODO : nikt tego nie chce :(
        //...(this.detailsComponent ? ["detailsAction"] : []),
        ...(this.itemHandler ? ['itemAction'] : []),
      ];
    }

    return null;
  }

  @ViewChild(MatSort, { static: true })
  sortObj!: MatSort;
  @ViewChild('topTpl', { read: ViewContainerRef, static: true })
  topTpl!: ViewContainerRef;

  protected override initList(val: IListInternalOptions<T>): void {
    super.initList(val);

    this.componentFactories = val?.componentFactories ?? null;

    this.generateDynamicComponents();

    if (this.provider?.onCleanMultiSelected$) {
      this._subscriptions.add(
        this.provider.onCleanMultiSelected$.subscribe(() => {
          this._multiSelected = [];
        }),
      );
    }
  }

  onChangeMultiselect(checked: boolean, element: T, list: T[]) {
    this._multiSelected = this._multiSelected.filter((m) =>
      list.some((i) => i === m),
    );

    if (checked) {
      this._multiSelected.push(element);
    } else {
      const index = this._multiSelected.indexOf(element);
      if (index > -1) {
        this._multiSelected.splice(index, 1);
      }
    }

    if (this.provider.onChangeMultiSelected) {
      this.provider.onChangeMultiSelected(this._multiSelected);
    }
  }

  myTrackById(val: any) {
    return val?.id;
  }

  ngAfterViewInit(): void {
    this.generateDynamicComponents();
  }

  ngOnInit(): void {
    const sort = this.sort as {
      default?: string | undefined;
      defaultDesc?: boolean | undefined;
    };

    if (this.sort) {
      this.sortObj.active = sort?.default ?? '';
      this.sortObj.direction = sort.defaultDesc ? 'desc' : 'asc';

      this._subscriptions.add(
        this.sortObj.sortChange.subscribe((sort) => {
          this.provider.getData({
            offset: 0,
            sortBy: sort.active ? sort.active : '',
            sortDesc: this.sortObj.direction === 'desc',
          });
        }),
      );
    } else {
      this.sortObj.disabled = true;
    }
  }

  ngOnDestroy(): void {
    if (this._subscriptions) {
      this._subscriptions.unsubscribe();
    }
  }

  private generateDynamicComponents(): void {
    if (!this.componentFactories) return;

    if (this.componentFactories.top && this.topTpl) {
      if (!this.topTpl.get(0)) {
        this.topTpl.createComponent(this.componentFactories.top);
      }
    }
  }

  protected readonly Object = Object;
}
