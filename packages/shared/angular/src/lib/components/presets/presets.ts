import { Provider } from '@angular/core';

import {
  ACTION_PANEL_STANDARD_COMPONENT_TOKEN,
  AVATAR_STANDARD_COMPONENT_TOKEN,
  BADGE_STANDARD_COMPONENT_TOKEN,
  BREADCRUMBS_STANDARD_COMPONENT_TOKEN,
  BUTTON_GROUP_STANDARD_COMPONENT_TOKEN,
  BUTTON_STANDARD_COMPONENT_TOKEN,
  CALENDAR_STANDARD_COMPONENT_TOKEN,
  CARD_HEADING_STANDARD_COMPONENT_TOKEN,
  CARD_STANDARD_COMPONENT_TOKEN,
  COMMAND_PALETTE_STANDARD_COMPONENT_TOKEN,
  CONTAINER_STANDARD_COMPONENT_TOKEN,
  DESCRIPTION_LIST_STANDARD_COMPONENT_TOKEN,
  DETAIL_FIELD_COMPONENTS_TOKEN,
  DIVIDER_STANDARD_COMPONENT_TOKEN,
  DRAWER_STANDARD_COMPONENT_TOKEN,
  DROPDOWN_STANDARD_COMPONENT_TOKEN,
  EMPTY_STATE_STANDARD_COMPONENT_TOKEN,
  FEED_STANDARD_COMPONENT_TOKEN,
  FORM_STANDARD_COMPONENT_TOKEN,
  GRID_LIST_STANDARD_COMPONENT_TOKEN,
  INFO_STANDARD_COMPONENT_TOKEN,
  INPUT_FIELD_COMPONENTS_TOKEN,
  LIST_MODE_COMPONENTS_TOKEN,
  LOADER_STANDARD_COMPONENT_TOKEN,
  MEDIA_OBJECT_STANDARD_COMPONENT_TOKEN,
  MODAL_STANDARD_COMPONENT_TOKEN,
  MULTI_COLUMN_LAYOUT_STANDARD_COMPONENT_TOKEN,
  NAVBAR_STANDARD_COMPONENT_TOKEN,
  NOTIFICATION_STANDARD_COMPONENT_TOKEN,
  PAGE_HEADING_STANDARD_COMPONENT_TOKEN,
  PAGE_VARIANT_COMPONENTS_TOKEN,
  PAGING_STANDARD_COMPONENT_TOKEN,
  PROGRESS_BARS_STANDARD_COMPONENT_TOKEN,
  SECTION_HEADING_STANDARD_COMPONENT_TOKEN,
  SIDEBAR_LAYOUT_STANDARD_COMPONENT_TOKEN,
  SIGN_IN_FORM_STANDARD_COMPONENT_TOKEN,
  STACKED_LAYOUT_STANDARD_COMPONENT_TOKEN,
  STACKED_LIST_STANDARD_COMPONENT_TOKEN,
  STATS_STANDARD_COMPONENT_TOKEN,
  TABLE_STANDARD_COMPONENT_TOKEN,
  TABS_STANDARD_COMPONENT_TOKEN,
  TEXTAREA_STANDARD_COMPONENT_TOKEN,
  TOGGLE_STANDARD_COMPONENT_TOKEN,
  VERTICAL_NAVIGATION_STANDARD_COMPONENT_TOKEN,
} from '../../shared.inectors';
import { ActionPanelPresetComponent } from '../action-panel/preset/preset.component';
import { AvatarPresetComponent } from '../avatar/preset/preset.component';
import { BadgePresetComponent } from '../badge/preset/preset.component';
import { BreadcrumbsPresetComponent } from '../breadcrumbs/preset/preset.component';
import { ButtonPresetComponent } from '../button/preset/preset.component';
import { ButtonGroupPresetComponent } from '../button-group/preset/preset.component';
import { CalendarPresetComponent } from '../calendar/preset/preset.component';
import { CardPresetComponent } from '../card/preset/preset.component';
import { CardHeadingPresetComponent } from '../card-heading/preset/preset.component';
import { CommandPalettePresetComponent } from '../command-palette/preset/preset.component';
import { ContainerPresetComponent } from '../container/preset/preset.component';
import { DescriptionListPresetComponent } from '../description-list/preset/preset.component';
import { DETAIL_PRESET_FIELD_COMPONENTS } from '../detail/preset-fields';
import { DividerPresetComponent } from '../divider/preset/preset.component';
import { DrawerPresetComponent } from '../drawer/preset/preset.component';
import { DropdownPresetComponent } from '../dropdown/preset/preset.component';
import { EmptyStatePresetComponent } from '../empty-state/preset/preset.component';
import { FeedPresetComponent } from '../feed/preset/preset.component';
import { FormPresetComponent } from '../form/preset/preset.component';
import { GridListPresetComponent } from '../grid-list/preset/preset.component';
import { InfoPresetComponent } from '../info/preset/preset.component';
import { INPUT_PRESET_FIELD_COMPONENTS } from '../input/preset-fields';
import { LIST_PRESET_MODE_COMPONENTS } from '../list/preset-modes';
import { LoaderPresetComponent } from '../loader/preset/preset.component';
import { MediaObjectPresetComponent } from '../media-object/preset/preset.component';
import { ModalPresetComponent } from '../modal/preset/preset.component';
import { MultiColumnLayoutPresetComponent } from '../multi-column-layout/preset/preset.component';
import { NavbarPresetComponent } from '../navbar/preset/preset.component';
import { NotificationPresetComponent } from '../notification/preset/preset.component';
import { PagePresetComponent } from '../page/preset/preset.component';
import { PAGE_PRESET_VARIANT_COMPONENTS } from '../page/preset-variants';
import { PageHeadingPresetComponent } from '../page-heading/preset/preset.component';
import { PagingPresetComponent } from '../paging/preset/preset.component';
import { ProgressBarsPresetComponent } from '../progress-bars/preset/preset.component';
import { SectionHeadingPresetComponent } from '../section-heading/preset/preset.component';
import { SidebarLayoutPresetComponent } from '../sidebar-layout/preset/preset.component';
import { SignInFormPresetComponent } from '../sign-in-form/preset/preset.component';
import { StackedLayoutPresetComponent } from '../stacked-layout/preset/preset.component';
import { StackedListPresetComponent } from '../stacked-list/preset/preset.component';
import { StatsPresetComponent } from '../stats/preset/preset.component';
import { TablePresetComponent } from '../table/preset/preset.component';
import { TabsPresetComponent } from '../tabs/preset/preset.component';
import { TextareaPresetComponent } from '../textarea/preset/preset.component';
import { TogglePresetComponent } from '../toggle/preset/preset.component';
import { VerticalNavigationPresetComponent } from '../vertical-navigation/preset/preset.component';

/**
 * Every preset (Preline-styled) implementation the library ships, one provider
 * per token: the component tokens, the input and detail field maps, the list
 * modes and the page variants. `<smart-page>` renders the preset for both the
 * `'standard'` and the `'preset'` variant.
 *
 * Spread it to combine it with providers of your own, or pick single entries
 * to register only some presets. A provider listed after it wins.
 */
export const SMART_PRESET_PROVIDERS: Provider[] = [
  {
    provide: ACTION_PANEL_STANDARD_COMPONENT_TOKEN,
    useValue: ActionPanelPresetComponent,
  },
  { provide: AVATAR_STANDARD_COMPONENT_TOKEN, useValue: AvatarPresetComponent },
  { provide: BADGE_STANDARD_COMPONENT_TOKEN, useValue: BadgePresetComponent },
  {
    provide: BREADCRUMBS_STANDARD_COMPONENT_TOKEN,
    useValue: BreadcrumbsPresetComponent,
  },
  { provide: BUTTON_STANDARD_COMPONENT_TOKEN, useValue: ButtonPresetComponent },
  {
    provide: BUTTON_GROUP_STANDARD_COMPONENT_TOKEN,
    useValue: ButtonGroupPresetComponent,
  },
  {
    provide: CALENDAR_STANDARD_COMPONENT_TOKEN,
    useValue: CalendarPresetComponent,
  },
  { provide: CARD_STANDARD_COMPONENT_TOKEN, useValue: CardPresetComponent },
  {
    provide: CARD_HEADING_STANDARD_COMPONENT_TOKEN,
    useValue: CardHeadingPresetComponent,
  },
  {
    provide: COMMAND_PALETTE_STANDARD_COMPONENT_TOKEN,
    useValue: CommandPalettePresetComponent,
  },
  {
    provide: CONTAINER_STANDARD_COMPONENT_TOKEN,
    useValue: ContainerPresetComponent,
  },
  {
    provide: DESCRIPTION_LIST_STANDARD_COMPONENT_TOKEN,
    useValue: DescriptionListPresetComponent,
  },
  {
    provide: DIVIDER_STANDARD_COMPONENT_TOKEN,
    useValue: DividerPresetComponent,
  },
  { provide: DRAWER_STANDARD_COMPONENT_TOKEN, useValue: DrawerPresetComponent },
  {
    provide: DROPDOWN_STANDARD_COMPONENT_TOKEN,
    useValue: DropdownPresetComponent,
  },
  {
    provide: EMPTY_STATE_STANDARD_COMPONENT_TOKEN,
    useValue: EmptyStatePresetComponent,
  },
  { provide: FEED_STANDARD_COMPONENT_TOKEN, useValue: FeedPresetComponent },
  { provide: FORM_STANDARD_COMPONENT_TOKEN, useValue: FormPresetComponent },
  {
    provide: GRID_LIST_STANDARD_COMPONENT_TOKEN,
    useValue: GridListPresetComponent,
  },
  { provide: INFO_STANDARD_COMPONENT_TOKEN, useValue: InfoPresetComponent },
  { provide: LOADER_STANDARD_COMPONENT_TOKEN, useValue: LoaderPresetComponent },
  {
    provide: MEDIA_OBJECT_STANDARD_COMPONENT_TOKEN,
    useValue: MediaObjectPresetComponent,
  },
  { provide: MODAL_STANDARD_COMPONENT_TOKEN, useValue: ModalPresetComponent },
  {
    provide: MULTI_COLUMN_LAYOUT_STANDARD_COMPONENT_TOKEN,
    useValue: MultiColumnLayoutPresetComponent,
  },
  { provide: NAVBAR_STANDARD_COMPONENT_TOKEN, useValue: NavbarPresetComponent },
  {
    provide: NOTIFICATION_STANDARD_COMPONENT_TOKEN,
    useValue: NotificationPresetComponent,
  },
  {
    provide: PAGE_HEADING_STANDARD_COMPONENT_TOKEN,
    useValue: PageHeadingPresetComponent,
  },
  { provide: PAGING_STANDARD_COMPONENT_TOKEN, useValue: PagingPresetComponent },
  {
    provide: PROGRESS_BARS_STANDARD_COMPONENT_TOKEN,
    useValue: ProgressBarsPresetComponent,
  },
  {
    provide: SECTION_HEADING_STANDARD_COMPONENT_TOKEN,
    useValue: SectionHeadingPresetComponent,
  },
  {
    provide: SIDEBAR_LAYOUT_STANDARD_COMPONENT_TOKEN,
    useValue: SidebarLayoutPresetComponent,
  },
  {
    provide: SIGN_IN_FORM_STANDARD_COMPONENT_TOKEN,
    useValue: SignInFormPresetComponent,
  },
  {
    provide: STACKED_LAYOUT_STANDARD_COMPONENT_TOKEN,
    useValue: StackedLayoutPresetComponent,
  },
  {
    provide: STACKED_LIST_STANDARD_COMPONENT_TOKEN,
    useValue: StackedListPresetComponent,
  },
  { provide: STATS_STANDARD_COMPONENT_TOKEN, useValue: StatsPresetComponent },
  { provide: TABLE_STANDARD_COMPONENT_TOKEN, useValue: TablePresetComponent },
  { provide: TABS_STANDARD_COMPONENT_TOKEN, useValue: TabsPresetComponent },
  {
    provide: TEXTAREA_STANDARD_COMPONENT_TOKEN,
    useValue: TextareaPresetComponent,
  },
  { provide: TOGGLE_STANDARD_COMPONENT_TOKEN, useValue: TogglePresetComponent },
  {
    provide: VERTICAL_NAVIGATION_STANDARD_COMPONENT_TOKEN,
    useValue: VerticalNavigationPresetComponent,
  },
  {
    provide: INPUT_FIELD_COMPONENTS_TOKEN,
    useValue: INPUT_PRESET_FIELD_COMPONENTS,
  },
  {
    provide: DETAIL_FIELD_COMPONENTS_TOKEN,
    useValue: DETAIL_PRESET_FIELD_COMPONENTS,
  },
  {
    provide: LIST_MODE_COMPONENTS_TOKEN,
    useValue: LIST_PRESET_MODE_COMPONENTS,
  },
  {
    provide: PAGE_VARIANT_COMPONENTS_TOKEN,
    useValue: {
      ...PAGE_PRESET_VARIANT_COMPONENTS,
      standard: PagePresetComponent,
    },
  },
];

/**
 * Restyles the whole application with the presets: add it to the providers of
 * `bootstrapApplication` (or of a route or a component, to restyle only that
 * part). Without it every wrapper renders its standard implementation, which
 * for most components is deliberately unstyled markup.
 *
 * ```ts
 * bootstrapApplication(AppComponent, { providers: [provideSmartPresets()] });
 * ```
 */
export function provideSmartPresets(): Provider[] {
  return SMART_PRESET_PROVIDERS;
}
