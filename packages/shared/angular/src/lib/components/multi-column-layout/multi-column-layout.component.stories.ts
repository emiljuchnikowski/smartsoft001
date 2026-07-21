import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { MultiColumnLayoutComponent } from './multi-column-layout.component';
import { MultiColumnLayoutPresetComponent } from './preset/preset.component';
import { MULTI_COLUMN_LAYOUT_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

const meta: Meta<MultiColumnLayoutComponent> = {
  title: 'Components/MultiColumnLayout',
  component: MultiColumnLayoutComponent,
  decorators: [
    moduleMetadata({
      imports: [MultiColumnLayoutComponent],
      // Register the preset variation as the replacement for the standard
      // multi-column layout, so every <smart-multi-column-layout> renders
      // MultiColumnLayoutPresetComponent.
      providers: [
        {
          provide: MULTI_COLUMN_LAYOUT_STANDARD_COMPONENT_TOKEN,
          useValue: MultiColumnLayoutPresetComponent,
        },
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<MultiColumnLayoutComponent>;

export const Preset: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <ng-template #navTpl>
        <nav class="smart:flex smart:flex-col smart:gap-2 smart:p-4 smart:text-sm smart:text-gray-600 smart:dark:text-gray-300">
          <a href="#" class="smart:font-medium smart:text-gray-900 smart:dark:text-white">Inbox</a>
          <a href="#">Sent</a>
          <a href="#">Drafts</a>
          <a href="#">Archive</a>
        </nav>
      </ng-template>

      <ng-template #headerTpl>
        <div class="smart:flex smart:items-center smart:justify-between">
          <h1 class="smart:text-2xl smart:font-semibold smart:text-gray-900 smart:dark:text-white">Inbox</h1>
          <button class="smart:rounded-md smart:bg-teal-600 smart:px-3 smart:py-2 smart:text-sm smart:font-medium smart:text-white">
            Compose
          </button>
        </div>
      </ng-template>

      <ng-template #secondaryTpl>
        <div class="smart:p-4 smart:text-sm smart:text-gray-600 smart:dark:text-gray-300">
          <p class="smart:font-medium smart:text-gray-900 smart:dark:text-white">Filters</p>
          <ul class="smart:mt-2 smart:space-y-1">
            <li>Unread</li>
            <li>Flagged</li>
            <li>Attachments</li>
          </ul>
        </div>
      </ng-template>

      <div style="display: grid; gap: 32px;">
        <smart-multi-column-layout
          [options]="{ headerTpl: headerTpl, navTpl: navTpl, secondaryTpl: secondaryTpl, width: 'full', secondaryWidth: 'sm' }"
        >
          <p class="smart:text-gray-600 smart:dark:text-gray-300">
            Full-width main content with navigation, a custom header, and a small (w-64) secondary column.
          </p>
        </smart-multi-column-layout>

        <smart-multi-column-layout
          [options]="{ title: 'Reports', navTpl: navTpl, secondaryTpl: secondaryTpl, width: 'constrained', secondaryWidth: 'lg' }"
        >
          <p class="smart:text-gray-600 smart:dark:text-gray-300">
            Constrained (max-w-7xl, centered) main content with the title fallback and a large (w-96) secondary column.
          </p>
        </smart-multi-column-layout>
      </div>
    `,
  }),
};
