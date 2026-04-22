import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  Signal,
  viewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { IEntity } from '@smartsoft001/domain-core';

import { IListComponentFactories, IListInternalOptions } from '../../../models';
import { FileUrlPipe, ListCellPipe } from '../../../pipes';
import { PagingComponent } from '../../paging';
import { ListBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-list-mobile',
  templateUrl: './mobile.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslatePipe,
    LazyLoadImageModule,
    PagingComponent,
    ListCellPipe,
  ],
})
export class ListMobileComponent<T extends IEntity<string>>
  extends ListBaseComponent<T>
  implements AfterViewInit
{
  // Computed wrapping this.list so template can safely call it as a signal
  mobileList: Signal<T[]> = computed(
    () => ((this.list?.() as T[] | null) ?? []) as T[],
  );

  componentFactories: IListComponentFactories<T> | null = null;

  containerClasses = computed(() => {
    const classes: string[] = [
      'smart:divide-y',
      'smart:divide-gray-100',
      'dark:smart:divide-white/10',
    ];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

  topTpl = viewChild<ViewContainerRef>('topTpl');

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
    if (this.componentFactories.top && this.topTpl()) {
      if (!this.topTpl()?.get(0)) {
        this.topTpl()?.createComponent(this.componentFactories.top);
      }
    }
  }
}
