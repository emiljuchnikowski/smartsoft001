import { NgOptimizedImage } from '@angular/common';
import {
  Component,
  ViewChild,
  ViewContainerRef,
  AfterViewInit,
  Signal,
  computed,
} from '@angular/core';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonRow,
} from '@ionic/angular/standalone';

import { IEntity } from '@smartsoft001/domain-core';
import { FieldType, getModelFieldsWithOptions } from '@smartsoft001/models';

import { IListComponentFactories, IListInternalOptions } from '../../../models';
import { FileUrlPipe, ListCellPipe } from '../../../pipes';
import { PagingComponent } from '../../paging';
import { ListBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-list-masonry-grid',
  templateUrl: './masonry-grid.component.html',
  styleUrls: ['./masonry-grid.component.scss'],
  imports: [
    PagingComponent,
    IonInfiniteScrollContent,
    IonInfiniteScroll,
    IonIcon,
    IonButton,
    IonCol,
    IonRow,
    IonCard,
    FileUrlPipe,
    IonCardContent,
    NgOptimizedImage,
    ListCellPipe,
  ],
})
export class ListMasonryGridComponent<T extends IEntity<string>>
  extends ListBaseComponent<T>
  implements AfterViewInit
{
  componentFactories: IListComponentFactories<T> | null = null;

  listWithImages!: Signal<{ data: T; image: any }[] | null>;

  @ViewChild('topTpl', { read: ViewContainerRef, static: true })
  topTpl!: ViewContainerRef;

  ngAfterViewInit(): void {
    this.generateDynamicComponents();
  }

  protected override afterInitOptions() {
    const fieldOptions = getModelFieldsWithOptions(new this.type());
    const imageFieldOptions = fieldOptions.find(
      (item) => item.options.type === FieldType.image,
    );

    this.listWithImages = computed(() => {
      const list = this.list();
      if (!list) return null;

      return (list as T[]).map((item) => {
        return {
          data: item,
          image: (item as any)[imageFieldOptions?.key ?? ''],
        };
      }) as { data: T; image: any }[];
    });
  }

  protected override initList(val: IListInternalOptions<T>): void {
    super.initList(val);

    this.componentFactories = val?.componentFactories ?? null;

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

  protected readonly Object = Object;
}
