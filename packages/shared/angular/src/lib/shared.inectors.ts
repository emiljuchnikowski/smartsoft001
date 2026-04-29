import { InjectionToken, Type } from '@angular/core';

import { FieldTypeDef } from '@smartsoft001/models';

import {
  ButtonBaseComponent,
  CalendarBaseComponent,
  CardBaseComponent,
  CardHeadingBaseComponent,
  DescriptionListBaseComponent,
  DetailBaseComponent,
  DetailsBaseComponent,
  FeedBaseComponent,
  FormBaseComponent,
  GridListBaseComponent,
  InfoBaseComponent,
  LoaderBaseComponent,
  InputBaseComponent,
  ListBaseComponent,
  MultiColumnLayoutBaseComponent,
  PageBaseComponent,
  PageHeadingBaseComponent,
  PagingBaseComponent,
  PasswordStrengthBaseComponent,
  SearchbarBaseComponent,
  SectionHeadingBaseComponent,
  SelectMenuBaseComponent,
  SidebarLayoutBaseComponent,
  SignInFormBaseComponent,
  StackedLayoutBaseComponent,
  StackedListBaseComponent,
  StatsBaseComponent,
  TableBaseComponent,
  TextareaBaseComponent,
  ToggleBaseComponent,
} from './components';
import { ListMode, SmartPageVariant } from './models';

export const FORM_COMPONENT_TOKEN = new InjectionToken<any>('FORM_COMPONENT');
export const DETAILS_COMPONENT_TOKEN = new InjectionToken<any>(
  'DETAILS_COMPONENT_TOKEN',
);
export const BUTTON_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<ButtonBaseComponent>
>('BUTTON_STANDARD_COMPONENT');
export const CALENDAR_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<CalendarBaseComponent>
>('CALENDAR_STANDARD_COMPONENT');
export const CARD_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<CardBaseComponent>
>('CARD_STANDARD_COMPONENT');
export const CARD_HEADING_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<CardHeadingBaseComponent>
>('CARD_HEADING_STANDARD_COMPONENT');
export const DETAILS_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<DetailsBaseComponent<any>>
>('DETAILS_STANDARD_COMPONENT');
export const DETAIL_FIELD_COMPONENTS_TOKEN = new InjectionToken<
  Partial<Record<FieldTypeDef, Type<DetailBaseComponent<any>>>>
>('DETAIL_FIELD_COMPONENTS_TOKEN');
export const FEED_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<FeedBaseComponent>
>('FEED_STANDARD_COMPONENT');
export const DESCRIPTION_LIST_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<DescriptionListBaseComponent>
>('DESCRIPTION_LIST_STANDARD_COMPONENT');
export const FORM_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<FormBaseComponent<any>>
>('FORM_STANDARD_COMPONENT');
export const GRID_LIST_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<GridListBaseComponent>
>('GRID_LIST_STANDARD_COMPONENT');
export const INFO_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<InfoBaseComponent>
>('INFO_STANDARD_COMPONENT');
export const INPUT_FIELD_COMPONENTS_TOKEN = new InjectionToken<
  Partial<Record<FieldTypeDef, Type<InputBaseComponent<any>>>>
>('INPUT_FIELD_COMPONENTS_TOKEN');
export const LIST_MODE_COMPONENTS_TOKEN = new InjectionToken<
  Partial<Record<ListMode, Type<ListBaseComponent<any>>>>
>('LIST_MODE_COMPONENTS');
export const LOADER_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<LoaderBaseComponent>
>('LOADER_STANDARD_COMPONENT');
export const MULTI_COLUMN_LAYOUT_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<MultiColumnLayoutBaseComponent>
>('MULTI_COLUMN_LAYOUT_STANDARD_COMPONENT');
export const PAGE_VARIANT_COMPONENTS_TOKEN = new InjectionToken<
  Partial<Record<SmartPageVariant, Type<PageBaseComponent>>>
>('PAGE_VARIANT_COMPONENTS');
export const PAGE_HEADING_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<PageHeadingBaseComponent>
>('PAGE_HEADING_STANDARD_COMPONENT');
export const PAGING_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<PagingBaseComponent>
>('PAGING_STANDARD_COMPONENT');
export const PASSWORD_STRENGTH_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<PasswordStrengthBaseComponent>
>('PASSWORD_STRENGTH_STANDARD_COMPONENT');
export const SEARCHBAR_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<SearchbarBaseComponent>
>('SEARCHBAR_STANDARD_COMPONENT');
export const SECTION_HEADING_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<SectionHeadingBaseComponent>
>('SECTION_HEADING_STANDARD_COMPONENT');
export const SELECT_MENU_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<SelectMenuBaseComponent>
>('SELECT_MENU_STANDARD_COMPONENT');
export const SIDEBAR_LAYOUT_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<SidebarLayoutBaseComponent>
>('SIDEBAR_LAYOUT_STANDARD_COMPONENT');
export const SIGN_IN_FORM_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<SignInFormBaseComponent>
>('SIGN_IN_FORM_STANDARD_COMPONENT');
export const STACKED_LAYOUT_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<StackedLayoutBaseComponent>
>('STACKED_LAYOUT_STANDARD_COMPONENT');
export const STACKED_LIST_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<StackedListBaseComponent>
>('STACKED_LIST_STANDARD_COMPONENT');
export const STATS_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<StatsBaseComponent>
>('STATS_STANDARD_COMPONENT');
export const TABLE_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<TableBaseComponent>
>('TABLE_STANDARD_COMPONENT');
export const TEXTAREA_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<TextareaBaseComponent>
>('TEXTAREA_STANDARD_COMPONENT');
export const TOGGLE_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<ToggleBaseComponent>
>('TOGGLE_STANDARD_COMPONENT');
