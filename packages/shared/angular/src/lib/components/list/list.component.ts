import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
  Signal,
  Type,
  ViewEncapsulation,
  WritableSignal,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import * as _ from 'lodash';

import { IEntity } from '@smartsoft001/domain-core';
import {
  getModelFieldsWithOptions,
  IFieldListMetadata,
} from '@smartsoft001/models';

import { IListInternalOptions, IListOptions, ListMode } from '../../models';
import { HardwareService } from '../../services';
import { LIST_MODE_COMPONENTS_TOKEN } from '../../shared.inectors';
import { LoaderComponent } from '../loader';
import { ListBaseComponent } from './base/base.component';
import { ListDesktopComponent } from './desktop/desktop.component';
import { ListMasonryGridComponent } from './masonry-grid/masonry-grid.component';
import { ListMobileComponent } from './mobile/mobile.component';

const baseMap: Partial<Record<ListMode, Type<ListBaseComponent<any>>>> = {
  [ListMode.desktop]: ListDesktopComponent,
  [ListMode.mobile]: ListMobileComponent,
  [ListMode.masonryGrid]: ListMasonryGridComponent,
};

@Component({
  selector: 'smart-list',
  templateUrl: './list.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [NgComponentOutlet, TranslatePipe, LoaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent<T extends IEntity<string>> {
  private hardwareService = inject(HardwareService);
  private extendMap = inject(LIST_MODE_COMPONENTS_TOKEN, { optional: true });

  private _options: WritableSignal<IListInternalOptions<T>> = signal(
    {} as IListInternalOptions<T>,
  );

  ListMode = ListMode;

  options = input.required<IListOptions<T>>();
  cssClass = input<string>('', { alias: 'class' });

  get internalOptions(): IListInternalOptions<T> {
    return this._options();
  }

  mode: Signal<ListMode> = computed(
    () =>
      this._options()?.mode ??
      (this.hardwareService.isMobile ? ListMode.mobile : ListMode.desktop),
  );

  componentType = computed(() => {
    const map = { ...baseMap, ...(this.extendMap ?? {}) };
    return map[this.mode()] ?? ListDesktopComponent;
  });

  componentInputs = computed(() => ({
    options: this._options(),
    class: this.cssClass(),
  }));

  constructor() {
    effect(() => {
      const options = this.options();
      this._options.set({
        ...options,
        fields: _.sortBy(
          getModelFieldsWithOptions(new (options as any).type())?.filter(
            (item) => item?.options?.list,
          ),
          (item) => (item?.options?.list as IFieldListMetadata).order,
        ),
      });
    });
  }
}
