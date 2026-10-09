import {
  importProvidersFrom,
  inject,
  provideAppInitializer,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import {
  applicationConfig,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';

import {
  IModelValidatorsOptions,
  MODEL_VALIDATORS_PROVIDER,
  provideSmartPresets,
  SharedModule,
} from '@smartsoft001/angular';

import { AccordionUsageExampleComponent } from './accordion/usage.example';
import { ActionPanelUsageExampleComponent } from './action-panel/usage.example';
import { AlertUsageExampleComponent } from './alert/usage.example';
import { AvatarUsageExampleComponent } from './avatar/usage.example';
import { BadgeUsageExampleComponent } from './badge/usage.example';
import { BreadcrumbsUsageExampleComponent } from './breadcrumbs/usage.example';
import { ButtonUsageExampleComponent } from './button/usage.example';
import { ButtonGroupUsageExampleComponent } from './button-group/usage.example';
import { CalendarUsageExampleComponent } from './calendar/usage.example';
import { CardUsageExampleComponent } from './card/usage.example';
import { CardHeadingUsageExampleComponent } from './card-heading/usage.example';
import { CommandPaletteUsageExampleComponent } from './command-palette/usage.example';
import { ContainerUsageExampleComponent } from './container/usage.example';
import { DateEditUsageExampleComponent } from './date-edit/usage.example';
import { DateRangeUsageExampleComponent } from './date-range/usage.example';
import { DescriptionListUsageExampleComponent } from './description-list/usage.example';
import { DetailUsageExampleComponent } from './detail/usage.example';
import { DetailsUsageExampleComponent } from './details/usage.example';
import { DividerUsageExampleComponent } from './divider/usage.example';
import { DrawerUsageExampleComponent } from './drawer/usage.example';
import { DropdownUsageExampleComponent } from './dropdown/usage.example';
import { EmptyStateUsageExampleComponent } from './empty-state/usage.example';
import { ExportUsageExampleComponent } from './export/usage.example';
import { FeedUsageExampleComponent } from './feed/usage.example';
import { FormUsageExampleComponent } from './form/usage.example';
import { GridListUsageExampleComponent } from './grid-list/usage.example';
import { IconUsageExampleComponent } from './icon/usage.example';
import { ImportUsageExampleComponent } from './import/usage.example';
import { InfoUsageExampleComponent } from './info/usage.example';
import { InputUsageExampleComponent } from './input/usage.example';
import { ListUsageExampleComponent } from './list/usage.example';
import { ListContainerUsageExampleComponent } from './list-container/usage.example';
import { LoaderUsageExampleComponent } from './loader/usage.example';
import { MediaObjectUsageExampleComponent } from './media-object/usage.example';
import { ModalUsageExampleComponent } from './modal/usage.example';
import { MultiColumnLayoutUsageExampleComponent } from './multi-column-layout/usage.example';
import { NavbarUsageExampleComponent } from './navbar/usage.example';
import { NotificationUsageExampleComponent } from './notification/usage.example';
import { PageUsageExampleComponent } from './page/usage.example';
import { PageHeadingUsageExampleComponent } from './page-heading/usage.example';
import { PagingUsageExampleComponent } from './paging/usage.example';
import { PasswordStrengthUsageExampleComponent } from './password-strength/usage.example';
import { ProgressBarsUsageExampleComponent } from './progress-bars/usage.example';
import { SearchbarUsageExampleComponent } from './searchbar/usage.example';
import { SectionHeadingUsageExampleComponent } from './section-heading/usage.example';
import { SelectMenuUsageExampleComponent } from './select-menu/usage.example';
import { SidebarLayoutUsageExampleComponent } from './sidebar-layout/usage.example';
import { SidebarNavigationUsageExampleComponent } from './sidebar-navigation/usage.example';
import { SignInFormUsageExampleComponent } from './sign-in-form/usage.example';
import { StackedLayoutUsageExampleComponent } from './stacked-layout/usage.example';
import { StackedListUsageExampleComponent } from './stacked-list/usage.example';
import { StatsUsageExampleComponent } from './stats/usage.example';
import { TableUsageExampleComponent } from './table/usage.example';
import { TabsUsageExampleComponent } from './tabs/usage.example';
import { TextareaUsageExampleComponent } from './textarea/usage.example';
import { ToggleUsageExampleComponent } from './toggle/usage.example';
import { VerticalNavigationUsageExampleComponent } from './vertical-navigation/usage.example';

/**
 * The usage examples of the component pages, rendered as they are: each story
 * is the `usage.example` component whose template and class the page shows in
 * its HTML and TypeScript tabs, so the live preview below the tabs is exactly
 * that code. The docs generator embeds `docs-usage-examples--<component>`.
 *
 * The stories render the way a styled application would: the framework's
 * English translations (`SharedModule`, `eng`), the router and the model
 * validators an application root provides, and every preset registered with
 * `provideSmartPresets()`.
 */
const meta: Meta = {
  title: 'Docs/Usage examples',
  decorators: [
    applicationConfig({
      providers: [
        // One catch-all route: the story iframe's own URL has to match one,
        // or the router's initial navigation fails.
        provideRouter([{ path: '**', children: [] }]),
        provideTranslateService(),
        importProvidersFrom(SharedModule),
        provideAppInitializer(() => {
          inject(TranslateService).use('eng');
        }),
        // The form factory asks for extra validators per field; the
        // examples add none beyond what their `@Field` metadata implies.
        {
          provide: MODEL_VALIDATORS_PROVIDER,
          useValue: {
            get: (options: IModelValidatorsOptions) =>
              Promise.resolve(options.base ?? {}),
          },
        },
        provideSmartPresets(),
      ],
    }),
  ],
  parameters: { layout: 'padded' },
};

export default meta;

type Story = StoryObj;

export const Accordion: Story = {
  decorators: [moduleMetadata({ imports: [AccordionUsageExampleComponent] })],
  render: () => ({ template: '<docs-accordion-usage-example />' }),
};

export const ActionPanel: Story = {
  decorators: [moduleMetadata({ imports: [ActionPanelUsageExampleComponent] })],
  render: () => ({ template: '<docs-action-panel-usage-example />' }),
};

export const Alert: Story = {
  decorators: [moduleMetadata({ imports: [AlertUsageExampleComponent] })],
  render: () => ({ template: '<docs-alert-usage-example />' }),
};

export const Avatar: Story = {
  decorators: [moduleMetadata({ imports: [AvatarUsageExampleComponent] })],
  render: () => ({ template: '<docs-avatar-usage-example />' }),
};

export const Badge: Story = {
  decorators: [moduleMetadata({ imports: [BadgeUsageExampleComponent] })],
  render: () => ({ template: '<docs-badge-usage-example />' }),
};

export const Breadcrumbs: Story = {
  decorators: [moduleMetadata({ imports: [BreadcrumbsUsageExampleComponent] })],
  render: () => ({ template: '<docs-breadcrumbs-usage-example />' }),
};

export const Button: Story = {
  decorators: [moduleMetadata({ imports: [ButtonUsageExampleComponent] })],
  render: () => ({ template: '<docs-button-usage-example />' }),
};

export const ButtonGroup: Story = {
  decorators: [moduleMetadata({ imports: [ButtonGroupUsageExampleComponent] })],
  render: () => ({ template: '<docs-button-group-usage-example />' }),
};

export const Calendar: Story = {
  decorators: [moduleMetadata({ imports: [CalendarUsageExampleComponent] })],
  render: () => ({ template: '<docs-calendar-usage-example />' }),
};

export const Card: Story = {
  decorators: [moduleMetadata({ imports: [CardUsageExampleComponent] })],
  render: () => ({ template: '<docs-card-usage-example />' }),
};

export const CardHeading: Story = {
  decorators: [moduleMetadata({ imports: [CardHeadingUsageExampleComponent] })],
  render: () => ({ template: '<docs-card-heading-usage-example />' }),
};

export const CommandPalette: Story = {
  decorators: [
    moduleMetadata({ imports: [CommandPaletteUsageExampleComponent] }),
  ],
  render: () => ({ template: '<docs-command-palette-usage-example />' }),
};

export const Container: Story = {
  decorators: [moduleMetadata({ imports: [ContainerUsageExampleComponent] })],
  render: () => ({ template: '<docs-container-usage-example />' }),
};

export const DateEdit: Story = {
  decorators: [moduleMetadata({ imports: [DateEditUsageExampleComponent] })],
  render: () => ({ template: '<docs-date-edit-usage-example />' }),
};

export const DateRange: Story = {
  decorators: [moduleMetadata({ imports: [DateRangeUsageExampleComponent] })],
  render: () => ({ template: '<docs-date-range-usage-example />' }),
};

export const DescriptionList: Story = {
  decorators: [
    moduleMetadata({ imports: [DescriptionListUsageExampleComponent] }),
  ],
  render: () => ({ template: '<docs-description-list-usage-example />' }),
};

export const Detail: Story = {
  decorators: [moduleMetadata({ imports: [DetailUsageExampleComponent] })],
  render: () => ({ template: '<docs-detail-usage-example />' }),
};

export const Details: Story = {
  decorators: [moduleMetadata({ imports: [DetailsUsageExampleComponent] })],
  render: () => ({ template: '<docs-details-usage-example />' }),
};

export const Divider: Story = {
  decorators: [moduleMetadata({ imports: [DividerUsageExampleComponent] })],
  render: () => ({ template: '<docs-divider-usage-example />' }),
};

export const Drawer: Story = {
  decorators: [moduleMetadata({ imports: [DrawerUsageExampleComponent] })],
  render: () => ({ template: '<docs-drawer-usage-example />' }),
};

export const Dropdown: Story = {
  decorators: [moduleMetadata({ imports: [DropdownUsageExampleComponent] })],
  render: () => ({ template: '<docs-dropdown-usage-example />' }),
};

export const EmptyState: Story = {
  decorators: [moduleMetadata({ imports: [EmptyStateUsageExampleComponent] })],
  render: () => ({ template: '<docs-empty-state-usage-example />' }),
};

export const Export: Story = {
  decorators: [moduleMetadata({ imports: [ExportUsageExampleComponent] })],
  render: () => ({ template: '<docs-export-usage-example />' }),
};

export const Feed: Story = {
  decorators: [moduleMetadata({ imports: [FeedUsageExampleComponent] })],
  render: () => ({ template: '<docs-feed-usage-example />' }),
};

export const Form: Story = {
  decorators: [moduleMetadata({ imports: [FormUsageExampleComponent] })],
  render: () => ({ template: '<docs-form-usage-example />' }),
};

export const GridList: Story = {
  decorators: [moduleMetadata({ imports: [GridListUsageExampleComponent] })],
  render: () => ({ template: '<docs-grid-list-usage-example />' }),
};

export const Icon: Story = {
  decorators: [moduleMetadata({ imports: [IconUsageExampleComponent] })],
  render: () => ({ template: '<docs-icon-usage-example />' }),
};

export const Import: Story = {
  decorators: [moduleMetadata({ imports: [ImportUsageExampleComponent] })],
  render: () => ({ template: '<docs-import-usage-example />' }),
};

export const Info: Story = {
  decorators: [moduleMetadata({ imports: [InfoUsageExampleComponent] })],
  render: () => ({ template: '<docs-info-usage-example />' }),
};

export const Input: Story = {
  decorators: [moduleMetadata({ imports: [InputUsageExampleComponent] })],
  render: () => ({ template: '<docs-input-usage-example />' }),
};

export const List: Story = {
  decorators: [moduleMetadata({ imports: [ListUsageExampleComponent] })],
  render: () => ({ template: '<docs-list-usage-example />' }),
};

export const ListContainer: Story = {
  decorators: [
    moduleMetadata({ imports: [ListContainerUsageExampleComponent] }),
  ],
  render: () => ({ template: '<docs-list-container-usage-example />' }),
};

export const Loader: Story = {
  decorators: [moduleMetadata({ imports: [LoaderUsageExampleComponent] })],
  render: () => ({ template: '<docs-loader-usage-example />' }),
};

export const MediaObject: Story = {
  decorators: [moduleMetadata({ imports: [MediaObjectUsageExampleComponent] })],
  render: () => ({ template: '<docs-media-object-usage-example />' }),
};

export const Modal: Story = {
  decorators: [moduleMetadata({ imports: [ModalUsageExampleComponent] })],
  render: () => ({ template: '<docs-modal-usage-example />' }),
};

export const MultiColumnLayout: Story = {
  decorators: [
    moduleMetadata({ imports: [MultiColumnLayoutUsageExampleComponent] }),
  ],
  render: () => ({ template: '<docs-multi-column-layout-usage-example />' }),
};

export const Navbar: Story = {
  decorators: [moduleMetadata({ imports: [NavbarUsageExampleComponent] })],
  render: () => ({ template: '<docs-navbar-usage-example />' }),
};

export const Notification: Story = {
  decorators: [
    moduleMetadata({ imports: [NotificationUsageExampleComponent] }),
  ],
  render: () => ({ template: '<docs-notification-usage-example />' }),
};

export const Page: Story = {
  decorators: [moduleMetadata({ imports: [PageUsageExampleComponent] })],
  render: () => ({ template: '<docs-page-usage-example />' }),
};

export const PageHeading: Story = {
  decorators: [moduleMetadata({ imports: [PageHeadingUsageExampleComponent] })],
  render: () => ({ template: '<docs-page-heading-usage-example />' }),
};

export const Paging: Story = {
  decorators: [moduleMetadata({ imports: [PagingUsageExampleComponent] })],
  render: () => ({ template: '<docs-paging-usage-example />' }),
};

export const PasswordStrength: Story = {
  decorators: [
    moduleMetadata({ imports: [PasswordStrengthUsageExampleComponent] }),
  ],
  render: () => ({ template: '<docs-password-strength-usage-example />' }),
};

export const ProgressBars: Story = {
  decorators: [
    moduleMetadata({ imports: [ProgressBarsUsageExampleComponent] }),
  ],
  render: () => ({ template: '<docs-progress-bars-usage-example />' }),
};

export const Searchbar: Story = {
  decorators: [moduleMetadata({ imports: [SearchbarUsageExampleComponent] })],
  render: () => ({ template: '<docs-searchbar-usage-example />' }),
};

export const SectionHeading: Story = {
  decorators: [
    moduleMetadata({ imports: [SectionHeadingUsageExampleComponent] }),
  ],
  render: () => ({ template: '<docs-section-heading-usage-example />' }),
};

export const SelectMenu: Story = {
  decorators: [moduleMetadata({ imports: [SelectMenuUsageExampleComponent] })],
  render: () => ({ template: '<docs-select-menu-usage-example />' }),
};

export const SidebarLayout: Story = {
  decorators: [
    moduleMetadata({ imports: [SidebarLayoutUsageExampleComponent] }),
  ],
  render: () => ({ template: '<docs-sidebar-layout-usage-example />' }),
};

export const SidebarNavigation: Story = {
  decorators: [
    moduleMetadata({ imports: [SidebarNavigationUsageExampleComponent] }),
  ],
  render: () => ({ template: '<docs-sidebar-navigation-usage-example />' }),
};

export const SignInForm: Story = {
  decorators: [moduleMetadata({ imports: [SignInFormUsageExampleComponent] })],
  render: () => ({ template: '<docs-sign-in-form-usage-example />' }),
};

export const StackedLayout: Story = {
  decorators: [
    moduleMetadata({ imports: [StackedLayoutUsageExampleComponent] }),
  ],
  render: () => ({ template: '<docs-stacked-layout-usage-example />' }),
};

export const StackedList: Story = {
  decorators: [moduleMetadata({ imports: [StackedListUsageExampleComponent] })],
  render: () => ({ template: '<docs-stacked-list-usage-example />' }),
};

export const Stats: Story = {
  decorators: [moduleMetadata({ imports: [StatsUsageExampleComponent] })],
  render: () => ({ template: '<docs-stats-usage-example />' }),
};

export const Table: Story = {
  decorators: [moduleMetadata({ imports: [TableUsageExampleComponent] })],
  render: () => ({ template: '<docs-table-usage-example />' }),
};

export const Tabs: Story = {
  decorators: [moduleMetadata({ imports: [TabsUsageExampleComponent] })],
  render: () => ({ template: '<docs-tabs-usage-example />' }),
};

export const Textarea: Story = {
  decorators: [moduleMetadata({ imports: [TextareaUsageExampleComponent] })],
  render: () => ({ template: '<docs-textarea-usage-example />' }),
};

export const Toggle: Story = {
  decorators: [moduleMetadata({ imports: [ToggleUsageExampleComponent] })],
  render: () => ({ template: '<docs-toggle-usage-example />' }),
};

export const VerticalNavigation: Story = {
  decorators: [
    moduleMetadata({ imports: [VerticalNavigationUsageExampleComponent] }),
  ],
  render: () => ({ template: '<docs-vertical-navigation-usage-example />' }),
};
