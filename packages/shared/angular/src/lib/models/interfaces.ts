import {
  ComponentFactory,
  PipeTransform,
  Signal,
  TemplateRef,
  Type,
  WritableSignal,
} from '@angular/core';
import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormControl,
} from '@angular/forms';
import { Observable } from 'rxjs';

import { IEntity } from '@smartsoft001/domain-core';
import { IFieldOptions, IModelOptions } from '@smartsoft001/models';

import { IAppProvider } from '../providers';
import { InputBaseComponentType } from './forward-types';
import { IStyle } from './style';

export interface IAppOptions {
  provider: IAppProvider;
  logo?: string;
  menu?: {
    showForAnonymous?: boolean;
    items?: IMenuItem[];
  };
  style?: IStyle;
}

export interface ICardOptions {
  title?: string;
  buttons?: Array<IIconButtonOptions>;
  grayFooter?: boolean;
  grayBody?: boolean;
}

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
  | 'form'
  | 'page'
  | 'page-heading'
  | 'button'
  | 'calendar'
  | 'card-heading'
  | 'details'
  | 'description-list'
  | 'info'
  | 'list'
  | 'loader'
  | 'multi-column-layout'
  | 'password-strength'
  | 'searchbar'
  | 'section-heading'
  | 'sidebar-layout'
  | 'stacked-layout'
  | 'stats'
  | 'toggle'
  | 'crud-list-page'
  | 'crud-item-page';
export interface IDynamicComponentData {
  key: DynamicComponentType;
  component: Type<any>;
  data?: any;
}

export interface IFormOptions<T> {
  model: T;
  show: boolean;
  treeLevel?: number;
  control?: AbstractControl;
  mode?: 'create' | 'update' | string;
  loading$?: Observable<boolean>;
  uniqueProvider?: (values: Record<keyof T, any>) => Promise<boolean>;
  possibilities?: {
    [key: string]: WritableSignal<
      { id: any; text: string; checked: boolean }[]
    >;
  };
  inputComponents?: {
    [key: string]: InputBaseComponentType<T>;
  };
  fieldOptions?: IFieldOptions;
  modelOptions?: IModelOptions;
}

export type InputOptions<T> = IInputOptions & IInputFromFieldOptions<T>;

export interface IInputOptions {
  treeLevel: number;
  control: UntypedFormControl | UntypedFormArray;
  possibilities?: WritableSignal<{ id: any; text: string; checked: boolean }[]>;
  component?: InputBaseComponentType<any>;
}

export interface IInputFromFieldOptions<T> {
  model: T;
  fieldKey: string;
  mode?: 'create' | 'update' | string;
}

export interface IDetailsComponentFactories<T> {
  top?: ComponentFactory<any>;
  bottom?: ComponentFactory<any>;
}

export interface IDetailsOptions<T extends IEntity<string>> {
  title?: string;
  cellPipe?: ICellPipe<T>;
  type: any;
  item: Signal<T>;
  loading?: Signal<boolean>;
  itemHandler?: ((id: string) => void) | null;
  removeHandler?: ((item: T) => void) | null;
  componentFactories?: IDetailsComponentFactories<T>;
}

export interface IMenuItem {
  mode?: 'divider' | 'default';
  route?: string;
  click?: (arg0: IMenuItem) => void;
  caption?: string;
  component?: any;
  icon?: string;
  infos?: Array<{ text: string }>;
}

export type SmartVariant = 'primary' | 'secondary' | 'soft';
export type SmartSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type SmartColor =
  | 'slate'
  | 'gray'
  | 'zinc'
  | 'neutral'
  | 'stone'
  | 'red'
  | 'orange'
  | 'amber'
  | 'yellow'
  | 'lime'
  | 'green'
  | 'emerald'
  | 'teal'
  | 'cyan'
  | 'sky'
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'purple'
  | 'fuchsia'
  | 'pink'
  | 'rose';

export interface IAccordionOptions {
  open?: boolean;
  disabled?: boolean;
  animated?: boolean;
}

export interface IButtonOptions {
  type?: 'submit' | 'button';
  confirm?: boolean;
  click: () => void;
  loading?: Signal<boolean>;
  variant?: SmartVariant;
  size?: SmartSize;
  color?: SmartColor;
  rounded?: boolean;
  circular?: boolean;
  iconPosition?: 'leading' | 'trailing';
}

export interface IInfoOptions {
  text: string;
}

export interface ISearchbarOptions {
  placeholder?: string;
  label?: string;
  debounceTime?: number;
  showToggleButton?: boolean;
  size?: SmartSize;
  color?: SmartColor;
}

export interface IToggleOptions {
  label?: string;
  description?: string;
  labelPosition?: 'left' | 'right';
  ariaLabel?: string;
}

export type SmartStackedLayoutContainerWidth =
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'full';

export interface IStackedLayoutOptions {
  title?: string;
  navTpl?: TemplateRef<unknown>;
  headerTpl?: TemplateRef<unknown>;
  containerWidth?: SmartStackedLayoutContainerWidth;
}

export interface ICardHeadingOptions {
  title?: string;
  description?: string;
  avatarTpl?: TemplateRef<unknown>;
  actionsTpl?: TemplateRef<unknown>;
  metaTpl?: TemplateRef<unknown>;
}

export interface IPageHeadingOptions {
  title?: string;
  subtitle?: string;
  breadcrumbsTpl?: TemplateRef<unknown>;
  metaTpl?: TemplateRef<unknown>;
  avatarTpl?: TemplateRef<unknown>;
  bannerTpl?: TemplateRef<unknown>;
  actionsTpl?: TemplateRef<unknown>;
  statsTpl?: TemplateRef<unknown>;
  logoTpl?: TemplateRef<unknown>;
  filtersTpl?: TemplateRef<unknown>;
}

export type SmartMultiColumnLayoutWidth = 'full' | 'constrained';
export type SmartMultiColumnLayoutSecondaryWidth = 'sm' | 'md' | 'lg';

export interface IMultiColumnLayoutOptions {
  title?: string;
  navTpl?: TemplateRef<unknown>;
  secondaryTpl?: TemplateRef<unknown>;
  headerTpl?: TemplateRef<unknown>;
  width?: SmartMultiColumnLayoutWidth;
  secondaryWidth?: SmartMultiColumnLayoutSecondaryWidth;
}

export interface ISectionHeadingOptions {
  title?: string;
  description?: string;
  label?: string;
  actionsTpl?: TemplateRef<unknown>;
  tabsTpl?: TemplateRef<unknown>;
  inputGroupTpl?: TemplateRef<unknown>;
  badgeTpl?: TemplateRef<unknown>;
}

export interface IDescriptionListItem {
  label: string;
  value?: string;
  valueTpl?: TemplateRef<unknown>;
  actionTpl?: TemplateRef<unknown>;
}

export interface IDescriptionListOptions {
  title?: string;
  description?: string;
  items?: IDescriptionListItem[];
  attachmentsTpl?: TemplateRef<unknown>;
  footerTpl?: TemplateRef<unknown>;
}

export interface IStatItem {
  label: string;
  value: string | number;
  previousValue?: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  iconTpl?: TemplateRef<unknown>;
  actionTpl?: TemplateRef<unknown>;
  ariaLabel?: string;
}

export interface IStatsOptions {
  title?: string;
  items: IStatItem[];
  columns?: 1 | 2 | 3 | 4;
}

export type SmartCalendarView = 'month' | 'week' | 'day' | 'year';

export interface ICalendarEvent {
  id: string | number;
  start: Date;
  end?: Date;
  title?: string;
  meta?: Record<string, unknown>;
}

export interface ICalendarDayCell {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}

export interface ICalendarOptions {
  view?: SmartCalendarView;
  monthsCount?: 1 | 2 | 12;
  weekStart?: 0 | 1;
  showToolbar?: boolean;
  toolbarActionsTpl?: TemplateRef<unknown>;
  eventListTpl?: TemplateRef<unknown>;
  sidePanelTpl?: TemplateRef<unknown>;
  dayCellTpl?: TemplateRef<unknown>;
  eventTpl?: TemplateRef<unknown>;
}

export type SmartSidebarLayoutMobileBreakpoint = 'sm' | 'md' | 'lg';

export interface ISidebarLayoutOptions {
  title?: string;
  sidebarTpl?: TemplateRef<unknown>;
  headerTpl?: TemplateRef<unknown>;
  sidebarPosition?: 'left' | 'right';
  mobileBreakpoint?: SmartSidebarLayoutMobileBreakpoint;
  condensed?: boolean;
}

export interface IDetailOptions<T> {
  key: string;
  item?: Signal<T>;
  options: IFieldOptions;
  cellPipe?: ICellPipe<T>;
  loading?: Signal<boolean>;
}

export interface ICellPipe<T> extends PipeTransform {
  transform(
    value: T,
    columnName: string,
    translate?: (val: string) => string,
  ): string;
}

export type SmartPageVariant = 'standard' | (string & {});

export interface IPageOptions {
  title: string;
  hideHeader?: boolean;
  hideMenuButton?: boolean;
  showBackButton?: boolean;
  endButtons?: Array<IIconButtonOptions>;
  search?: { text: Signal<string>; set: (txt: string) => void };
  variant?: SmartPageVariant;
  bodyTpl?: TemplateRef<unknown>;
  breadcrumbsTpl?: TemplateRef<unknown>;
  metaTpl?: TemplateRef<unknown>;
  avatarTpl?: TemplateRef<unknown>;
  bannerTpl?: TemplateRef<unknown>;
  filtersTpl?: TemplateRef<unknown>;
  logoTpl?: TemplateRef<unknown>;
  statsTpl?: TemplateRef<unknown>;
  subtitleTpl?: TemplateRef<unknown>;
  navTpl?: TemplateRef<unknown>;
  sidebarTpl?: TemplateRef<unknown>;
}

export interface IListProvider<T> {
  getData: (filter: any) => void;
  onChangeMultiSelected?: (list: Array<T>) => void;
  onCleanMultiSelected$?: Observable<void>;
  list: Signal<T[]>;
  loading: Signal<boolean>;
}

export interface IListPaginationOptions {
  mode?: PaginationMode;
  limit: number;
  loadNextPage: () => Promise<boolean>;
  loadPrevPage: () => Promise<boolean>;
  page: Signal<number>;
  totalPages: Signal<number>;
}

export enum PaginationMode {
  infiniteScroll = 'infiniteScroll',
  singlePage = 'singlePage',
}

export enum ListMode {
  mobile = 'mobile',
  desktop = 'desktop',
  masonryGrid = 'masonryGrid',
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
  item: Signal<T>;
  loading: Signal<boolean>;
}

export interface IListOptions<T> {
  provider: IListProvider<T>;
  type: any;
  mode?: ListMode;

  pagination?: IListPaginationOptions;

  cellPipe?: ICellPipe<T>;
  componentFactories?: IListComponentFactories<T>;
  sort?:
    | boolean
    | {
        default?: string;
        defaultDesc?: boolean;
      };

  details?:
    | boolean
    | {
        provider?: IDetailsProvider<T>;
        componentFactories?: IDetailsComponentFactories<T>;
        component?: Type<any>;
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

  select?: 'multi';
}

export interface IRemoveProvider<T> {
  invoke: (id: string) => void;
  check?: (item: T) => boolean;
}

export interface IListInternalOptions<T> extends IListOptions<T> {
  fields?: Array<{ key: string; options: IFieldOptions }>;
}
