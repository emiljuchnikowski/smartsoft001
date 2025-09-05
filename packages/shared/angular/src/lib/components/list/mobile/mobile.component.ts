import {
  AfterViewInit,
  Component,
  Signal,
  ViewChild,
  ViewContainerRef,
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
  imports: [
    TranslatePipe,
    FileUrlPipe,
    LazyLoadImageModule,
    PagingComponent,
    ListCellPipe,
  ],
})
export class ListMobileComponent<T extends IEntity<string>>
  extends ListBaseComponent<T>
  implements AfterViewInit
{
  listMobile = this.list as Signal<T[]>;
  componentFactories: IListComponentFactories<T> | null = null;

  @ViewChild('topTpl', { read: ViewContainerRef, static: true })
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
