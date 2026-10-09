import { SmartConfig } from '../../providers/smart-context';
import { SmartActionPanelPreset } from '../action-panel/preset/action-panel-preset';
import { SmartAvatarPreset } from '../avatar/preset/avatar-preset';
import { SmartBadgePreset } from '../badge/preset/badge-preset';
import { SmartBreadcrumbsPreset } from '../breadcrumbs/preset/breadcrumbs-preset';
import { SmartButtonPreset } from '../button/preset/button-preset';
import { SmartButtonGroupPreset } from '../button-group/preset/button-group-preset';
import { SmartCalendarPreset } from '../calendar/preset/calendar-preset';
import { SmartCardPreset } from '../card/preset/card-preset';
import { SmartCardHeadingPreset } from '../card-heading/preset/card-heading-preset';
import { SmartCommandPalettePreset } from '../command-palette/preset/command-palette-preset';
import { SmartContainerPreset } from '../container/preset/container-preset';
import { SmartDescriptionListPreset } from '../description-list/preset/description-list-preset';
import { DETAIL_PRESET_FIELD_COMPONENTS } from '../detail/preset-fields';
import { SmartDividerPreset } from '../divider/preset/divider-preset';
import { SmartDrawerPreset } from '../drawer/preset/drawer-preset';
import { SmartDropdownPreset } from '../dropdown/preset/dropdown-preset';
import { SmartEmptyStatePreset } from '../empty-state/preset/empty-state-preset';
import { SmartFeedPreset } from '../feed/preset/feed-preset';
import { SmartFormPreset } from '../form/preset/form-preset';
import { SmartGridListPreset } from '../grid-list/preset/grid-list-preset';
import { SmartInfoPreset } from '../info/preset/info-preset';
import { SmartInputErrorPreset } from '../input/error/preset/input-error-preset';
import { INPUT_PRESET_FIELD_COMPONENTS } from '../input/preset-fields';
import { LIST_PRESET_MODE_COMPONENTS } from '../list/preset-modes';
import { SmartLoaderPreset } from '../loader/preset/loader-preset';
import { SmartMediaObjectPreset } from '../media-object/preset/media-object-preset';
import { SmartModalPreset } from '../modal/preset/modal-preset';
import { SmartMultiColumnLayoutPreset } from '../multi-column-layout/preset/multi-column-layout-preset';
import { SmartNavbarPreset } from '../navbar/preset/navbar-preset';
import { SmartNotificationPreset } from '../notification/preset/notification-preset';
import { SmartPagePreset } from '../page/preset/page-preset';
import { PAGE_PRESET_VARIANT_COMPONENTS } from '../page/preset-variants';
import { SmartPageHeadingPreset } from '../page-heading/preset/page-heading-preset';
import { SmartPagingPreset } from '../paging/preset/paging-preset';
import { SmartProgressBarsPreset } from '../progress-bars/preset/progress-bars-preset';
import { SmartSectionHeadingPreset } from '../section-heading/preset/section-heading-preset';
import { SmartSidebarLayoutPreset } from '../sidebar-layout/preset/sidebar-layout-preset';
import { SmartSignInFormPreset } from '../sign-in-form/preset/sign-in-form-preset';
import { SmartStackedLayoutPreset } from '../stacked-layout/preset/stacked-layout-preset';
import { SmartStackedListPreset } from '../stacked-list/preset/stacked-list-preset';
import { SmartStatsPreset } from '../stats/preset/stats-preset';
import { SmartTablePreset } from '../table/preset/table-preset';
import { SmartTabsPreset } from '../tabs/preset/tabs-preset';
import { SmartTextareaPreset } from '../textarea/preset/textarea-preset';
import { SmartTogglePreset } from '../toggle/preset/toggle-preset';
import { SmartVerticalNavigationPreset } from '../vertical-navigation/preset/vertical-navigation-preset';

/**
 * Every preset (Preline-styled) implementation the library ships, in the shape
 * of `SmartProvider`'s configuration, so one spread restyles a whole
 * application: `<SmartProvider {...SMART_PRESET_COMPONENTS}>`.
 *
 * Pick single entries from here to register only some of the presets.
 */
export const SMART_PRESET_COMPONENTS = {
  components: {
    'action-panel': SmartActionPanelPreset,
    avatar: SmartAvatarPreset,
    badge: SmartBadgePreset,
    breadcrumbs: SmartBreadcrumbsPreset,
    button: SmartButtonPreset,
    'button-group': SmartButtonGroupPreset,
    calendar: SmartCalendarPreset,
    card: SmartCardPreset,
    'card-heading': SmartCardHeadingPreset,
    'command-palette': SmartCommandPalettePreset,
    container: SmartContainerPreset,
    'description-list': SmartDescriptionListPreset,
    divider: SmartDividerPreset,
    drawer: SmartDrawerPreset,
    dropdown: SmartDropdownPreset,
    'empty-state': SmartEmptyStatePreset,
    feed: SmartFeedPreset,
    form: SmartFormPreset,
    'grid-list': SmartGridListPreset,
    info: SmartInfoPreset,
    'input-error': SmartInputErrorPreset,
    loader: SmartLoaderPreset,
    'media-object': SmartMediaObjectPreset,
    modal: SmartModalPreset,
    'multi-column-layout': SmartMultiColumnLayoutPreset,
    navbar: SmartNavbarPreset,
    notification: SmartNotificationPreset,
    page: SmartPagePreset,
    'page-heading': SmartPageHeadingPreset,
    paging: SmartPagingPreset,
    'progress-bars': SmartProgressBarsPreset,
    'section-heading': SmartSectionHeadingPreset,
    'sidebar-layout': SmartSidebarLayoutPreset,
    'sign-in-form': SmartSignInFormPreset,
    'stacked-layout': SmartStackedLayoutPreset,
    'stacked-list': SmartStackedListPreset,
    stats: SmartStatsPreset,
    table: SmartTablePreset,
    tabs: SmartTabsPreset,
    textarea: SmartTextareaPreset,
    toggle: SmartTogglePreset,
    'vertical-navigation': SmartVerticalNavigationPreset,
    ...PAGE_PRESET_VARIANT_COMPONENTS,
  },
  inputFieldComponents: INPUT_PRESET_FIELD_COMPONENTS,
  detailFieldComponents: DETAIL_PRESET_FIELD_COMPONENTS,
  listModeComponents: LIST_PRESET_MODE_COMPONENTS,
} satisfies Pick<
  SmartConfig,
  | 'components'
  | 'inputFieldComponents'
  | 'detailFieldComponents'
  | 'listModeComponents'
>;
