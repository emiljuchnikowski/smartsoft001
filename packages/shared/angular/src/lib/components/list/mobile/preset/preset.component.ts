import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { IEntity } from '@smartsoft001/domain-core';
import { FieldType, getModelFieldOptions } from '@smartsoft001/models';

import { FileUrlPipe, ListCellPipe } from '../../../../pipes';
import { getCardContainerClasses } from '../../../card/preset/preset-classes.util';
import { PagingComponent } from '../../../paging';
import { ListMobileComponent } from '../mobile.component';

@Component({
  selector: 'smart-list-mobile-preset',
  templateUrl: './preset.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslatePipe,
    LazyLoadImageModule,
    PagingComponent,
    ListCellPipe,
    FileUrlPipe,
  ],
})
export class ListMobilePresetComponent<
  T extends IEntity<string>,
> extends ListMobileComponent<T> {
  cardContainerClasses = getCardContainerClasses();

  gridClasses = computed(() => {
    const classes: string[] = [
      'smart:grid',
      'smart:gap-4',
      'smart:grid-cols-1',
      'smart:sm:grid-cols-2',
      'smart:lg:grid-cols-3',
    ];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

  isImageKey(key: string): boolean {
    if (!this.type) return false;
    const options = getModelFieldOptions(new this.type(), key);
    return options?.type === FieldType.image;
  }

  get titleKey(): string | null {
    if (!this.keys) return null;
    return this.keys.find((key) => !this.isImageKey(key)) ?? null;
  }
}
