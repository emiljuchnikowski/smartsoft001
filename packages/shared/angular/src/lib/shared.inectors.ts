import { InjectionToken, Type } from '@angular/core';

import { FieldTypeDef } from '@smartsoft001/models';

import {
  ActionPanelBaseComponent,
  AvatarBaseComponent,
  BadgeBaseComponent,
  BreadcrumbsBaseComponent,
  ButtonBaseComponent,
  ButtonGroupBaseComponent,
  CalendarBaseComponent,
  CardBaseComponent,
  CardHeadingBaseComponent,
  CommandPaletteBaseComponent,
  ContainerBaseComponent,
  DescriptionListBaseComponent,
  DetailBaseComponent,
  DetailsBaseComponent,
  DividerBaseComponent,
  DrawerBaseComponent,
  DropdownBaseComponent,
  EmptyStateBaseComponent,
  FeedBaseComponent,
  FormBaseComponent,
  GridListBaseComponent,
  InfoBaseComponent,
  ListContainerBaseComponent,
  LoaderBaseComponent,
  MediaObjectBaseComponent,
  ModalBaseComponent,
  NotificationBaseComponent,
  InputBaseComponent,
  ListBaseComponent,
  MultiColumnLayoutBaseComponent,
  NavbarBaseComponent,
  PageBaseComponent,
  PageHeadingBaseComponent,
  PagingBaseComponent,
  PasswordStrengthBaseComponent,
  ProgressBarsBaseComponent,
  SearchbarBaseComponent,
  SectionHeadingBaseComponent,
  SelectMenuBaseComponent,
  SidebarLayoutBaseComponent,
  SidebarNavigationBaseComponent,
  SignInFormBaseComponent,
  StackedLayoutBaseComponent,
  StackedListBaseComponent,
  StatsBaseComponent,
  TableBaseComponent,
  TabsBaseComponent,
  TextareaBaseComponent,
  ToggleBaseComponent,
  VerticalNavigationBaseComponent,
} from './components';
import { ListMode, SmartPageVariant } from './models';

export const FORM_COMPONENT_TOKEN = new InjectionToken<any>('FORM_COMPONENT');
export const DETAILS_COMPONENT_TOKEN = new InjectionToken<any>(
  'DETAILS_COMPONENT_TOKEN',
);
export const ACTION_PANEL_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<ActionPanelBaseComponent>
>('ACTION_PANEL_STANDARD_COMPONENT');
export const BREADCRUMBS_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<BreadcrumbsBaseComponent>
>('BREADCRUMBS_STANDARD_COMPONENT');
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
export const COMMAND_PALETTE_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<CommandPaletteBaseComponent>
>('COMMAND_PALETTE_STANDARD_COMPONENT');
export const DETAILS_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<DetailsBaseComponent<any>>
>('DETAILS_STANDARD_COMPONENT');
export const DETAIL_FIELD_COMPONENTS_TOKEN = new InjectionToken<
  Partial<Record<FieldTypeDef, Type<DetailBaseComponent<any>>>>
>('DETAIL_FIELD_COMPONENTS_TOKEN');
export const EMPTY_STATE_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<EmptyStateBaseComponent>
>('EMPTY_STATE_STANDARD_COMPONENT');
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
export const MODAL_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<ModalBaseComponent>
>('MODAL_STANDARD_COMPONENT');
export const AVATAR_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<AvatarBaseComponent>
>('AVATAR_STANDARD_COMPONENT');
export const BADGE_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<BadgeBaseComponent>
>('BADGE_STANDARD_COMPONENT');
export const BUTTON_GROUP_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<ButtonGroupBaseComponent>
>('BUTTON_GROUP_STANDARD_COMPONENT');
export const CONTAINER_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<ContainerBaseComponent>
>('CONTAINER_STANDARD_COMPONENT');
export const DIVIDER_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<DividerBaseComponent>
>('DIVIDER_STANDARD_COMPONENT');
export const DRAWER_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<DrawerBaseComponent>
>('DRAWER_STANDARD_COMPONENT');
export const DROPDOWN_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<DropdownBaseComponent>
>('DROPDOWN_STANDARD_COMPONENT');
export const LIST_CONTAINER_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<ListContainerBaseComponent>
>('LIST_CONTAINER_STANDARD_COMPONENT');
export const MEDIA_OBJECT_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<MediaObjectBaseComponent>
>('MEDIA_OBJECT_STANDARD_COMPONENT');
export const NOTIFICATION_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<NotificationBaseComponent>
>('NOTIFICATION_STANDARD_COMPONENT');
export const MULTI_COLUMN_LAYOUT_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<MultiColumnLayoutBaseComponent>
>('MULTI_COLUMN_LAYOUT_STANDARD_COMPONENT');
export const NAVBAR_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<NavbarBaseComponent>
>('NAVBAR_STANDARD_COMPONENT');
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
export const PROGRESS_BARS_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<ProgressBarsBaseComponent>
>('PROGRESS_BARS_STANDARD_COMPONENT');
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
export const SIDEBAR_NAVIGATION_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<SidebarNavigationBaseComponent>
>('SIDEBAR_NAVIGATION_STANDARD_COMPONENT');
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
export const TABS_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<TabsBaseComponent>
>('TABS_STANDARD_COMPONENT');
export const TEXTAREA_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<TextareaBaseComponent>
>('TEXTAREA_STANDARD_COMPONENT');
export const TOGGLE_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<ToggleBaseComponent>
>('TOGGLE_STANDARD_COMPONENT');
export const VERTICAL_NAVIGATION_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<VerticalNavigationBaseComponent>
>('VERTICAL_NAVIGATION_STANDARD_COMPONENT');
