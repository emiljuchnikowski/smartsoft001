import {
  Directive,
  ElementRef,
  inject,
  input,
  InputSignal,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';

import { MenuService, StyleService } from '@smartsoft001/angular';
import { IEntity } from '@smartsoft001/domain-core';
import {
  FieldType,
  getModelFieldsWithOptions,
  getModelOptions,
  IFieldListMetadata,
  IModelFilter,
} from '@smartsoft001/models';

import { CrudFacade } from '../../../+state/crud.facade';
import { CrudConfig } from '../../../crud.config';
import { ICrudFilter } from '../../../models';

// Rendered by an OnPush concrete (FiltersComponent). The base exposes signals
// (`list()`, `filter()`) and is therefore OnPush-compatible.
@Directive()
export class FiltersBaseComponent<T extends IEntity<string>> implements OnInit {
  private menuService = inject(MenuService);
  private config = inject(CrudConfig<T>);
  private facade = inject(CrudFacade<T>);
  private styleService = inject(StyleService);
  private elementRef = inject(ElementRef);

  list!: WritableSignal<Array<IModelFilter>>;

  filter!: Signal<ICrudFilter | undefined>;

  /**
   * Hide menu used only from MenuService
   */
  readonly hideMenu: InputSignal<boolean> = input<boolean>(false);

  async onClose(): Promise<void> {
    await this.menuService.closeEnd();
  }

  ngOnInit(): void {
    this.styleService.init(this.elementRef);
    this.list = signal([]);

    const modelFilters = getModelOptions(this.config.type)?.filters;

    this.list.set([
      ...(modelFilters
        ? modelFilters.map((item) => {
            if (!item.label) {
              item.label = 'MODEL.' + item.key;
            }
            return item;
          })
        : []),
      ...getModelFieldsWithOptions(new this.config.type())
        .filter((item) => (item.options?.list as IFieldListMetadata)?.filter)
        .map((item) => ({
          key: item.key,
          type:
            item.options.type === FieldType.text ||
            item.options.type === FieldType.longText
              ? ('~=' as const)
              : ('=' as const),
          label: 'MODEL.' + item.key,
          fieldType: item.options.type,
        })),
    ]);
    this.filter = this.facade.filter;
  }
}
