import type { Meta, StoryObj } from '@storybook/react-vite';

import { SMART_PRESET_COMPONENTS } from '@smartsoft001/react';

import { AccordionUsageExample } from './accordion/usage.example';
import { ActionPanelUsageExample } from './action-panel/usage.example';
import { AlertUsageExample } from './alert/usage.example';
import { AvatarUsageExample } from './avatar/usage.example';
import { BadgeUsageExample } from './badge/usage.example';
import { BreadcrumbsUsageExample } from './breadcrumbs/usage.example';
import { ButtonUsageExample } from './button/usage.example';
import { ButtonGroupUsageExample } from './button-group/usage.example';
import { CalendarUsageExample } from './calendar/usage.example';
import { CardUsageExample } from './card/usage.example';
import { CardHeadingUsageExample } from './card-heading/usage.example';
import { CommandPaletteUsageExample } from './command-palette/usage.example';
import { ContainerUsageExample } from './container/usage.example';
import { DateEditUsageExample } from './date-edit/usage.example';
import { DateRangeUsageExample } from './date-range/usage.example';
import { DescriptionListUsageExample } from './description-list/usage.example';
import { DetailUsageExample } from './detail/usage.example';
import { DetailsUsageExample } from './details/usage.example';
import { DividerUsageExample } from './divider/usage.example';
import { DrawerUsageExample } from './drawer/usage.example';
import { DropdownUsageExample } from './dropdown/usage.example';
import { EmptyStateUsageExample } from './empty-state/usage.example';
import { ExportUsageExample } from './export/usage.example';
import { FeedUsageExample } from './feed/usage.example';
import { FormUsageExample } from './form/usage.example';
import { GridListUsageExample } from './grid-list/usage.example';
import { IconUsageExample } from './icon/usage.example';
import { ImportUsageExample } from './import/usage.example';
import { InfoUsageExample } from './info/usage.example';
import { InputUsageExample } from './input/usage.example';
import { ListUsageExample } from './list/usage.example';
import { ListContainerUsageExample } from './list-container/usage.example';
import { LoaderUsageExample } from './loader/usage.example';
import { MediaObjectUsageExample } from './media-object/usage.example';
import { ModalUsageExample } from './modal/usage.example';
import { MultiColumnLayoutUsageExample } from './multi-column-layout/usage.example';
import { NavbarUsageExample } from './navbar/usage.example';
import { NotificationUsageExample } from './notification/usage.example';
import { PageUsageExample } from './page/usage.example';
import { PageHeadingUsageExample } from './page-heading/usage.example';
import { PagingUsageExample } from './paging/usage.example';
import { PasswordStrengthUsageExample } from './password-strength/usage.example';
import { ProgressBarsUsageExample } from './progress-bars/usage.example';
import { SearchbarUsageExample } from './searchbar/usage.example';
import { SectionHeadingUsageExample } from './section-heading/usage.example';
import { SelectMenuUsageExample } from './select-menu/usage.example';
import { SidebarLayoutUsageExample } from './sidebar-layout/usage.example';
import { SidebarNavigationUsageExample } from './sidebar-navigation/usage.example';
import { SignInFormUsageExample } from './sign-in-form/usage.example';
import { StackedLayoutUsageExample } from './stacked-layout/usage.example';
import { StackedListUsageExample } from './stacked-list/usage.example';
import { StatsUsageExample } from './stats/usage.example';
import { TableUsageExample } from './table/usage.example';
import { TabsUsageExample } from './tabs/usage.example';
import { TextareaUsageExample } from './textarea/usage.example';
import { ToggleUsageExample } from './toggle/usage.example';
import { VerticalNavigationUsageExample } from './vertical-navigation/usage.example';

/**
 * The usage examples of the component pages, rendered as they are: each story
 * is the `usage.example` component the page shows in its TSX tab, so the live
 * preview below the tab is exactly that code. The docs generator embeds
 * `docs-usage-examples--<component>`.
 *
 * The stories render the way a styled application would: English, and every
 * preset registered with `SMART_PRESET_COMPONENTS` on the `SmartProvider` the
 * Storybook preview wraps each story in.
 */
const meta: Meta = {
  title: 'Docs/Usage examples',
  parameters: {
    layout: 'padded',
    smart: { ...SMART_PRESET_COMPONENTS, language: 'eng' },
  },
};

export default meta;

type Story = StoryObj;

export const Accordion: Story = {
  render: () => <AccordionUsageExample />,
};

export const ActionPanel: Story = {
  render: () => <ActionPanelUsageExample />,
};

export const Alert: Story = {
  render: () => <AlertUsageExample />,
};

export const Avatar: Story = {
  render: () => <AvatarUsageExample />,
};

export const Badge: Story = {
  render: () => <BadgeUsageExample />,
};

export const Breadcrumbs: Story = {
  render: () => <BreadcrumbsUsageExample />,
};

export const Button: Story = {
  render: () => <ButtonUsageExample />,
};

export const ButtonGroup: Story = {
  render: () => <ButtonGroupUsageExample />,
};

export const Calendar: Story = {
  render: () => <CalendarUsageExample />,
};

export const Card: Story = {
  render: () => <CardUsageExample />,
};

export const CardHeading: Story = {
  render: () => <CardHeadingUsageExample />,
};

export const CommandPalette: Story = {
  render: () => <CommandPaletteUsageExample />,
};

export const Container: Story = {
  render: () => <ContainerUsageExample />,
};

export const DateEdit: Story = {
  render: () => <DateEditUsageExample />,
};

export const DateRange: Story = {
  render: () => <DateRangeUsageExample />,
};

export const DescriptionList: Story = {
  render: () => <DescriptionListUsageExample />,
};

export const Detail: Story = {
  render: () => <DetailUsageExample />,
};

export const Details: Story = {
  render: () => <DetailsUsageExample />,
};

export const Divider: Story = {
  render: () => <DividerUsageExample />,
};

export const Drawer: Story = {
  render: () => <DrawerUsageExample />,
};

export const Dropdown: Story = {
  render: () => <DropdownUsageExample />,
};

export const EmptyState: Story = {
  render: () => <EmptyStateUsageExample />,
};

export const Export: Story = {
  render: () => <ExportUsageExample />,
};

export const Feed: Story = {
  render: () => <FeedUsageExample />,
};

export const Form: Story = {
  render: () => <FormUsageExample />,
};

export const GridList: Story = {
  render: () => <GridListUsageExample />,
};

export const Icon: Story = {
  render: () => <IconUsageExample />,
};

export const Import: Story = {
  render: () => <ImportUsageExample />,
};

export const Info: Story = {
  render: () => <InfoUsageExample />,
};

export const Input: Story = {
  render: () => <InputUsageExample />,
};

export const List: Story = {
  render: () => <ListUsageExample />,
};

export const ListContainer: Story = {
  render: () => <ListContainerUsageExample />,
};

export const Loader: Story = {
  render: () => <LoaderUsageExample />,
};

export const MediaObject: Story = {
  render: () => <MediaObjectUsageExample />,
};

export const Modal: Story = {
  render: () => <ModalUsageExample />,
};

export const MultiColumnLayout: Story = {
  render: () => <MultiColumnLayoutUsageExample />,
};

export const Navbar: Story = {
  render: () => <NavbarUsageExample />,
};

export const Notification: Story = {
  render: () => <NotificationUsageExample />,
};

export const Page: Story = {
  render: () => <PageUsageExample />,
};

export const PageHeading: Story = {
  render: () => <PageHeadingUsageExample />,
};

export const Paging: Story = {
  render: () => <PagingUsageExample />,
};

export const PasswordStrength: Story = {
  render: () => <PasswordStrengthUsageExample />,
};

export const ProgressBars: Story = {
  render: () => <ProgressBarsUsageExample />,
};

export const Searchbar: Story = {
  render: () => <SearchbarUsageExample />,
};

export const SectionHeading: Story = {
  render: () => <SectionHeadingUsageExample />,
};

export const SelectMenu: Story = {
  render: () => <SelectMenuUsageExample />,
};

export const SidebarLayout: Story = {
  render: () => <SidebarLayoutUsageExample />,
};

export const SidebarNavigation: Story = {
  render: () => <SidebarNavigationUsageExample />,
};

export const SignInForm: Story = {
  render: () => <SignInFormUsageExample />,
};

export const StackedLayout: Story = {
  render: () => <StackedLayoutUsageExample />,
};

export const StackedList: Story = {
  render: () => <StackedListUsageExample />,
};

export const Stats: Story = {
  render: () => <StatsUsageExample />,
};

export const Table: Story = {
  render: () => <TableUsageExample />,
};

export const Tabs: Story = {
  render: () => <TabsUsageExample />,
};

export const Textarea: Story = {
  render: () => <TextareaUsageExample />,
};

export const Toggle: Story = {
  render: () => <ToggleUsageExample />,
};

export const VerticalNavigation: Story = {
  render: () => <VerticalNavigationUsageExample />,
};
