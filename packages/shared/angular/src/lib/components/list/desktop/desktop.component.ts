import {
  CdkCell,
  CdkCellDef,
  CdkColumnDef,
  CdkHeaderCell,
  CdkHeaderCellDef,
  CdkHeaderRow,
  CdkHeaderRowDef,
  CdkRow,
  CdkRowDef,
  CdkTable,
} from '@angular/cdk/table';
import { NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  OnDestroy,
  OnInit,
  Signal,
  viewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { Subscription } from 'rxjs';

import { IEntity } from '@smartsoft001/domain-core';

import { IListComponentFactories, IListInternalOptions } from '../../../models';
import { FileUrlPipe, ListCellPipe, ListHeaderPipe } from '../../../pipes';
import { PagingComponent } from '../../paging';
import { ListBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-list-desktop',
  templateUrl: './desktop.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgTemplateOutlet,
    ListHeaderPipe,
    ListCellPipe,
    LazyLoadImageModule,
    FileUrlPipe,
    TranslatePipe,
    PagingComponent,
    CdkTable,
    CdkHeaderCell,
    CdkCell,
    CdkHeaderRow,
    CdkRow,
    CdkColumnDef,
    CdkHeaderCellDef,
    CdkCellDef,
    CdkHeaderRowDef,
    CdkRowDef,
  ],
})
export class ListDesktopComponent<T extends IEntity<string>>
  extends ListBaseComponent<T>
  implements OnInit, OnDestroy, AfterViewInit
{
  private _subscriptions = new Subscription();
  private _multiSelected: T[] = [];

  get desktopList(): Signal<T[]> {
    return this.list as Signal<T[]>;
  }

  componentFactories: IListComponentFactories<T> | null = null;

  containerClasses = computed(() => {
    const classes: string[] = [
      'smart:min-w-full',
      'smart:divide-y',
      'smart:divide-gray-300',
      'smart:dark:divide-white/10',
    ];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

  get desktopKeys(): Array<string> | null {
    if (this.keys) {
      return [
        ...(this.selectMode === 'multi' ? ['selectMulti'] : []),
        ...this.keys,
        ...(this.removeHandler ? ['removeAction'] : []),
        ...(this.itemHandler ? ['itemAction'] : []),
      ];
    }

    return null;
  }

  topTpl = viewChild<ViewContainerRef>('topTpl');

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
    // No-op: initialization handled via effect in base constructor
  }

  ngOnDestroy(): void {
    if (this._subscriptions) {
      this._subscriptions.unsubscribe();
    }
  }

  private generateDynamicComponents(): void {
    if (!this.componentFactories) return;

    if (this.componentFactories.top && this.topTpl()) {
      if (!this.topTpl()?.get(0)) {
        this.topTpl()?.createComponent(this.componentFactories.top);
      }
    }
  }
}
