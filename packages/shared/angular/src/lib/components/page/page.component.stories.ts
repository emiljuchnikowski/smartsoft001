import {
  Component,
  input,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';

import { PageComponent } from './page.component';
import { PAGE_PRESET_VARIANT_COMPONENTS } from './preset-variants';
import { provideStorybookTranslations } from '../../../../.storybook/storybook-translations';
import { IPageOptions } from '../../models';
import { PAGE_VARIANT_COMPONENTS_TOKEN } from '../../shared.inectors';
import { COMPONENTS, IMPORTS } from '../components.module';

// Story host that wires TemplateRef slots into IPageOptions and renders the
// preset variant through <smart-page>. A host component is required because
// IPageOptions takes TemplateRefs, which a plain story template string cannot
// produce, and because `search` needs a live signal.
@Component({
  selector: 'smart-page-story',
  imports: [PageComponent],
  template: `
    <smart-page [options]="buildOptions()">
      <div style="display: grid; gap: 12px;">
        <p style="margin: 0;">Main page content rendered inside the card.</p>
        <p style="margin: 0;">
          The preset variant wraps the body in a bordered content card and adds
          a styled header, filters bar and optional sidebar.
        </p>
      </div>
    </smart-page>

    <ng-template #breadcrumbs><span>Home / Users / Alice</span></ng-template>
    <ng-template #subtitle>
      <span>Account settings and permissions</span>
    </ng-template>
    <ng-template #meta>
      <span style="margin-right: 16px;">Last updated 2 hours ago</span>
      <span>Status: Active</span>
    </ng-template>
    <ng-template #filters>
      <div style="display: flex; gap: 12px;">
        <span>All</span><span>Active</span><span>Archived</span>
      </div>
    </ng-template>
    <ng-template #sidebar>
      <nav style="display: grid; gap: 8px;">
        <span>Profile</span><span>Security</span><span>Billing</span>
      </nav>
    </ng-template>
  `,
})
class PageStoryComponent {
  title = input('Alice Johnson');
  showBackButton = input(false);
  hideHeader = input(false);
  hideMenuButton = input(false);
  withBreadcrumbs = input(false);
  withSubtitle = input(false);
  withMeta = input(false);
  withFilters = input(false);
  withSidebar = input(false);
  withSearch = input(false);
  withEndButtons = input(false);

  breadcrumbs = viewChild<TemplateRef<unknown>>('breadcrumbs');
  subtitle = viewChild<TemplateRef<unknown>>('subtitle');
  meta = viewChild<TemplateRef<unknown>>('meta');
  filters = viewChild<TemplateRef<unknown>>('filters');
  sidebar = viewChild<TemplateRef<unknown>>('sidebar');

  private readonly searchText = signal('');

  buildOptions(): IPageOptions {
    return {
      title: this.title(),
      variant: 'preset',
      showBackButton: this.showBackButton(),
      hideHeader: this.hideHeader(),
      hideMenuButton: this.hideMenuButton(),
      search: this.withSearch()
        ? { text: this.searchText, set: (txt) => this.searchText.set(txt) }
        : undefined,
      endButtons: this.withEndButtons()
        ? [{ icon: 'add', text: 'Invite' }]
        : undefined,
      breadcrumbsTpl: this.withBreadcrumbs() ? this.breadcrumbs() : undefined,
      subtitleTpl: this.withSubtitle() ? this.subtitle() : undefined,
      metaTpl: this.withMeta() ? this.meta() : undefined,
      filtersTpl: this.withFilters() ? this.filters() : undefined,
      sidebarTpl: this.withSidebar() ? this.sidebar() : undefined,
    };
  }
}

interface PageArgs {
  title: string;
  showBackButton: boolean;
  hideHeader: boolean;
  hideMenuButton: boolean;
  withBreadcrumbs: boolean;
  withSubtitle: boolean;
  withMeta: boolean;
  withFilters: boolean;
  withSidebar: boolean;
  withSearch: boolean;
  withEndButtons: boolean;
}

const meta: Meta<PageArgs> = {
  title: 'Smart-Page/Page',
  tags: ['autodocs'],
  decorators: [
    // The story host is a standalone component, so ModuleWithProviders in
    // moduleMetadata.imports would not register TranslateStore — root
    // providers must come through applicationConfig instead.
    applicationConfig({
      providers: [...provideStorybookTranslations()],
    }),
    moduleMetadata({
      imports: [PageStoryComponent, ...IMPORTS, ...COMPONENTS, TranslateModule],
      providers: [
        {
          provide: PAGE_VARIANT_COMPONENTS_TOKEN,
          useValue: PAGE_PRESET_VARIANT_COMPONENTS,
        },
      ],
    }),
  ],
  argTypes: {
    title: { control: 'text' },
    showBackButton: { control: 'boolean' },
    hideHeader: { control: 'boolean' },
    hideMenuButton: { control: 'boolean' },
    withBreadcrumbs: { control: 'boolean' },
    withSubtitle: { control: 'boolean' },
    withMeta: { control: 'boolean' },
    withFilters: { control: 'boolean' },
    withSidebar: { control: 'boolean' },
    withSearch: { control: 'boolean' },
    withEndButtons: { control: 'boolean' },
  },
  args: {
    title: 'Alice Johnson',
    showBackButton: true,
    hideHeader: false,
    hideMenuButton: false,
    withBreadcrumbs: true,
    withSubtitle: true,
    withMeta: true,
    withFilters: true,
    withSidebar: true,
    withSearch: true,
    withEndButtons: true,
  },
};

export default meta;
type Story = StoryObj<PageArgs>;

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: { ...args },
    template: `
      <smart-page-story
        [title]="title"
        [showBackButton]="showBackButton"
        [hideHeader]="hideHeader"
        [hideMenuButton]="hideMenuButton"
        [withBreadcrumbs]="withBreadcrumbs"
        [withSubtitle]="withSubtitle"
        [withMeta]="withMeta"
        [withFilters]="withFilters"
        [withSidebar]="withSidebar"
        [withSearch]="withSearch"
        [withEndButtons]="withEndButtons"
      ></smart-page-story>
    `,
  }),
};

const section = (title: string, host: string) => `
  <section>
    <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">${title}</h3>
    <div style="height: 320px; border: 1px solid rgba(127,127,127,.3); border-radius: 8px; overflow: hidden;">
      ${host}
    </div>
  </section>
`;

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">

        ${section(
          'Title only',
          `<smart-page-story title="Alice Johnson"></smart-page-story>`,
        )}

        ${section(
          'Back button, subtitle and meta',
          `<smart-page-story
             title="Alice Johnson"
             [showBackButton]="true"
             [withSubtitle]="true"
             [withMeta]="true"
           ></smart-page-story>`,
        )}

        ${section(
          'Breadcrumbs and filters',
          `<smart-page-story
             title="Users"
             [withBreadcrumbs]="true"
             [withFilters]="true"
           ></smart-page-story>`,
        )}

        ${section(
          'Sidebar',
          `<smart-page-story title="Settings" [withSidebar]="true"></smart-page-story>`,
        )}

        ${section(
          'Search and end buttons',
          `<smart-page-story
             title="Users"
             [withSearch]="true"
             [withEndButtons]="true"
           ></smart-page-story>`,
        )}

        ${section(
          'Header hidden',
          `<smart-page-story title="Alice Johnson" [hideHeader]="true"></smart-page-story>`,
        )}

        ${section(
          'Menu button hidden',
          `<smart-page-story title="Alice Johnson" [hideMenuButton]="true"></smart-page-story>`,
        )}

        ${section(
          'All slots combined',
          `<smart-page-story
             title="Alice Johnson"
             [showBackButton]="true"
             [withBreadcrumbs]="true"
             [withSubtitle]="true"
             [withMeta]="true"
             [withFilters]="true"
             [withSidebar]="true"
             [withSearch]="true"
             [withEndButtons]="true"
           ></smart-page-story>`,
        )}

      </div>
    `,
  }),
};
