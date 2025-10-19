import {
  Directive,
  inject,
  input,
  viewChild,
  ViewContainerRef,
} from '@angular/core';

import {
  BaseComponent,
  DynamicComponentType,
  IListOptions,
} from '@smartsoft001/angular';
import { IEntity } from '@smartsoft001/domain-core';

import { CrudFullConfig } from '../../../crud.config';

@Directive()
export abstract class CrudListPageBaseComponent<
  T extends IEntity<string>,
> extends BaseComponent {
  public config = inject(CrudFullConfig<T>);

  static smartType: DynamicComponentType = 'crud-list-page';

  contentTpl = viewChild<ViewContainerRef>('contentTpl');

  listOptions = input<IListOptions<T> | null>();
}
