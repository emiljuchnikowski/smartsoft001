import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  Signal,
  signal,
  TemplateRef,
  viewChild,
  viewChildren,
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

import { CreateDynamicComponent } from '../base';
import { ListBaseComponent } from './base/base.component';
import { DynamicContentDirective } from '../../directives';
import { IListInternalOptions, IListOptions, ListMode } from '../../models';
import { HardwareService } from '../../services';
import { LoaderComponent } from '../loader';
import { ListDesktopComponent } from './desktop/desktop.component';
import { ListMasonryGridComponent } from './masonry-grid/masonry-grid.component';
import { ListMobileComponent } from './mobile/mobile.component';

@Component({
  selector: 'smart-list',
  templateUrl: './list.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    ListDesktopComponent,
    ListMobileComponent,
    ListMasonryGridComponent,
    TranslatePipe,
    NgTemplateOutlet,
    LoaderComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent<
  T extends IEntity<string>,
> extends CreateDynamicComponent<ListBaseComponent<any>>('list') {
  private _options: WritableSignal<IListInternalOptions<T>> = signal(
    {} as IListInternalOptions<T>,
  );
  private hardwareService = inject(HardwareService);

  mode: Signal<ListMode> = signal<ListMode>(ListMode.desktop);

  ListMode = ListMode;

  options = input.required<IListOptions<T>>();

  get internalOptions(): IListInternalOptions<T> {
    return this._options();
  }

  override contentTpl = viewChild<TemplateRef<any>>('contentTpl');

  override dynamicContents = viewChildren(DynamicContentDirective);

  constructor() {
    super();

    effect(() => {
      this._options.set(this.options());
      this.initFields();
      this.initModel();
      this.refreshDynamicInstance();
    });
  }

  override refreshProperties(): void {
    this.baseComponentRef.setInput('options', this._options());
  }

  private initFields(): void {
    this._options.update((options) => {
      return {
        ...options,
        fields: _.sortBy(
          getModelFieldsWithOptions(
            new (this._options() as any).type(),
          )?.filter((item) => item?.options?.list),
          (item) => (item?.options?.list as IFieldListMetadata).order,
        ),
      };
    });
  }

  private initModel(): void {
    this.mode = computed(
      () =>
        this._options()?.mode ??
        (this.hardwareService.isMobile ? ListMode.mobile : ListMode.desktop),
    );
  }
}
