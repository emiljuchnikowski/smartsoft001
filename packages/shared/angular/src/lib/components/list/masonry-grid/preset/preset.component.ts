import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

import { IEntity } from '@smartsoft001/domain-core';
import { FieldType, getModelFieldOptions } from '@smartsoft001/models';

import { FileUrlPipe, ListCellPipe } from '../../../../pipes';
import { getCardContainerClasses } from '../../../card/preset/preset-classes.util';
import { PagingComponent } from '../../../paging';
import { ListMasonryGridComponent } from '../masonry-grid.component';

@Component({
  selector: 'smart-list-masonry-grid-preset',
  templateUrl: './preset.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PagingComponent, FileUrlPipe, NgOptimizedImage, ListCellPipe],
})
export class ListMasonryGridPresetComponent<
  T extends IEntity<string>,
> extends ListMasonryGridComponent<T> {
  cardContainerClasses = getCardContainerClasses();

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
