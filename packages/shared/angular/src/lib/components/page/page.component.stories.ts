import { Component, signal, TemplateRef, viewChild } from '@angular/core';
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
// preset variant through <smart-page>.
@Component({
  selector: 'smart-page-preset-story',
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
class PresetStoryComponent {
  breadcrumbs = viewChild<TemplateRef<unknown>>('breadcrumbs');
  subtitle = viewChild<TemplateRef<unknown>>('subtitle');
  meta = viewChild<TemplateRef<unknown>>('meta');
  filters = viewChild<TemplateRef<unknown>>('filters');
  sidebar = viewChild<TemplateRef<unknown>>('sidebar');

  buildOptions(): IPageOptions {
    return {
      title: 'Alice Johnson',
      variant: 'preset',
      showBackButton: true,
      search: { text: signal(''), set: () => undefined },
      endButtons: [{ icon: 'add', text: 'Invite' }],
      breadcrumbsTpl: this.breadcrumbs(),
      subtitleTpl: this.subtitle(),
      metaTpl: this.meta(),
      filtersTpl: this.filters(),
      sidebarTpl: this.sidebar(),
    };
  }
}

const meta: Meta<PresetStoryComponent> = {
  title: 'Smart-Page/Page',
  component: PresetStoryComponent,
  decorators: [
    // The meta component is a standalone wrapper, so ModuleWithProviders in
    // moduleMetadata.imports would not register TranslateStore — root
    // providers must come through applicationConfig instead.
    applicationConfig({
      providers: [...provideStorybookTranslations()],
    }),
    moduleMetadata({
      imports: [
        PresetStoryComponent,
        ...IMPORTS,
        ...COMPONENTS,
        TranslateModule,
      ],
      providers: [
        {
          provide: PAGE_VARIANT_COMPONENTS_TOKEN,
          useValue: PAGE_PRESET_VARIANT_COMPONENTS,
        },
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<PresetStoryComponent>;

// ─── Preset ───────────────────────────────────────────────────────────────────

export const Preset: Story = {
  name: 'Preset',
  render: () => ({
    template: `<smart-page-preset-story></smart-page-preset-story>`,
  }),
};
