import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { SidebarLayoutPresetComponent } from './preset/preset.component';
import { SidebarLayoutComponent } from './sidebar-layout.component';
import { SIDEBAR_LAYOUT_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

const meta: Meta<SidebarLayoutComponent> = {
  title: 'Components/SidebarLayout',
  component: SidebarLayoutComponent,
  decorators: [
    moduleMetadata({
      imports: [SidebarLayoutComponent],
      // Register the preset variation as the replacement for the standard
      // sidebar layout, so every <smart-sidebar-layout> renders
      // SidebarLayoutPresetComponent.
      providers: [
        {
          provide: SIDEBAR_LAYOUT_STANDARD_COMPONENT_TOKEN,
          useValue: SidebarLayoutPresetComponent,
        },
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<SidebarLayoutComponent>;

export const Preset: Story = {
  name: 'Preset',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <ng-template #headerTpl>
        <div class="smart:flex smart:items-center smart:justify-between">
          <h1 class="smart:text-2xl smart:font-semibold smart:text-gray-900 smart:dark:text-white">Dashboard</h1>
          <button class="smart:rounded-md smart:bg-teal-600 smart:px-3 smart:py-2 smart:text-sm smart:font-medium smart:text-white">
            New item
          </button>
        </div>
      </ng-template>

      <ng-template #sidebarTpl>
        <nav class="smart:flex smart:flex-col smart:gap-2 smart:p-4 smart:text-sm smart:text-gray-600 smart:dark:text-gray-300">
          <a href="#">Overview</a>
          <a href="#">Team</a>
          <a href="#">Projects</a>
          <a href="#">Settings</a>
        </nav>
      </ng-template>

      <ng-template #condensedSidebarTpl>
        <nav class="smart:flex smart:flex-col smart:items-center smart:gap-4 smart:p-3 smart:text-gray-600 smart:dark:text-gray-300">
          <span>1</span>
          <span>2</span>
          <span>3</span>
        </nav>
      </ng-template>

      <div style="display: grid; gap: 32px;">
        <div style="height: 260px;">
          <smart-sidebar-layout [options]="{ title: 'Dashboard', sidebarTpl: sidebarTpl }">
            <p class="smart:text-gray-600 smart:dark:text-gray-300">
              Left sidebar (default) with a title header fallback.
            </p>
          </smart-sidebar-layout>
        </div>

        <div style="height: 260px;">
          <smart-sidebar-layout [options]="{ headerTpl: headerTpl, sidebarTpl: sidebarTpl, sidebarPosition: 'right' }">
            <p class="smart:text-gray-600 smart:dark:text-gray-300">
              Right sidebar with a custom header template (row reversed, start border).
            </p>
          </smart-sidebar-layout>
        </div>

        <div style="height: 260px;">
          <smart-sidebar-layout [options]="{ title: 'Condensed', sidebarTpl: condensedSidebarTpl, condensed: true }">
            <p class="smart:text-gray-600 smart:dark:text-gray-300">
              Condensed sidebar (narrow rail).
            </p>
          </smart-sidebar-layout>
        </div>
      </div>
    `,
  }),
};
