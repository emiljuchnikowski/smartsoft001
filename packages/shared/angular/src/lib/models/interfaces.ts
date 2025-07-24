import { Observable } from 'rxjs';
import { ComponentFactory, PipeTransform, Type } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { InputBaseComponent } from '../components';
import { IEntity } from '@smartsoft001/domain-core';

export interface IIconButtonOptions {
  icon: string;
  text?: string;
  handler?: () => void;
  component?: any;
  type?: 'default' | 'popover';
  disabled$?: Observable<boolean>;
  number?: number;
}

export type DynamicComponentType =
  "form" | "page" | "button" | "details" | "list" |
  "crud-list-page" | "crud-item-page";
export interface IDynamicComponentData {
  key: DynamicComponentType;
  component: Type<any>;
  data?: any;
}

export interface IFormOptions<T> {
  treeLevel?: number;
  model: T;
  control?: AbstractControl;
  mode?: "create" | "update" | string;
  loading$?: Observable<boolean>;
  uniqueProvider?: (values: Record<keyof T, any>) => Promise<boolean>,
  possibilities?: {
    [key: string]: Observable<{ id: any, text: string }[]>;
  }
  inputComponents?: {
    [key: string]: Type<InputBaseComponent<T>>;
  }
}

export type InputOptions<T> = IInputOptions & IInputFromFieldOptions<T>;

export interface IInputOptions {
  treeLevel: number;
  control: AbstractControl;
  possibilities$?: Observable<{ id: any, text: string }[]>;
  component?: Type<InputBaseComponent<any>>;
}

export interface IInputFromFieldOptions<T> {
  model: T;
  fieldKey: string;
  mode?: "create" | "update" | string;
}

export interface IDetailsComponentFactories<T> {
  top?: ComponentFactory<any>;
  bottom?: ComponentFactory<any>;
}

export interface IDetailsOptions<T extends IEntity<string>> {
  title?: string;
  cellPipe?: ICellPipe<T>;
  type: any;
  item$: Observable<T>;
  loading$?: Observable<boolean>;
  itemHandler?: (id: string) => void;
  removeHandler?: (item: T) => void;
  componentFactories?: IDetailsComponentFactories<T>;
}

export interface ICellPipe<T> extends PipeTransform {
  transform(value: T, columnName: string, translate?: (val: string) => string): string;
}

export interface IPageOptions {
  title: string;
  hideHeader?: boolean;
  hideMenuButton?: boolean;
  showBackButton?: boolean;
  endButtons?: Array<IIconButtonOptions>;
  search?: { text$: Observable<string>, set: (txt) => void }
}

export interface IListProvider<T> {
  getData: (filter) => void;
  onChangeMultiSelected?: (list: Array<T>) => void;
  onCleanMultiSelected$?: Observable<void>;
  list$: Observable<T[]>;
  loading$: Observable<boolean>;
}

export interface IListPaginationOptions {
  mode?: PaginationMode,
  limit: number,
  loadNextPage: () => Promise<boolean>,
  loadPrevPage: () => Promise<boolean>,
  page$: Observable<number>,
  totalPages$: Observable<number>
}

export enum PaginationMode {
  infiniteScroll = "infiniteScroll",
  singlePage = "singlePage"
}

export enum ListMode {
  mobile = "mobile",
  desktop = "desktop",
  masonryGrid = "masonryGrid"
}

export interface IItemOptionsForPage {
  routingPrefix: string;
  edit: boolean;
}

export interface IItemOptionsForCustom {
  select: (id: string) => void;
  edit: boolean;
}

export type ItemOptions = IItemOptionsForPage | IItemOptionsForCustom;

export interface IListComponentFactories<T> {
  top?: ComponentFactory<any>;
}

export interface IDetailsProvider<T> {
  getData: (id: string) => void;
  clearData: () => void;
  item$: Observable<T>;
  loading$: Observable<boolean>;
}

export interface IListOptions<T> {
  provider: IListProvider<T>;
  type: any;
  mode?: ListMode;

  pagination?: IListPaginationOptions;

  cellPipe?: ICellPipe<T>;
  componentFactories?: IListComponentFactories<T>,
  sort?: boolean | {
    default?: string;
    defaultDesc?: boolean;
  }

  details?:
    | boolean
    | {
    provider?: IDetailsProvider<T>;
    componentFactories?: IDetailsComponentFactories<T>;
  };

  item?:
    | boolean
    | {
    options?: ItemOptions;
  };

  remove?:
    | boolean
    | {
    provider?: IRemoveProvider<T>;
  };

  select?: 'multi'
}

export interface IRemoveProvider<T> {
  invoke: (id: string) => void;
  check?: (item: T) => boolean;
}
