import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { StackedLayoutPresetComponent } from './preset/preset.component';
import { StackedLayoutComponent } from './stacked-layout.component';
import { STACKED_LAYOUT_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

const meta: Meta<StackedLayoutComponent> = {
  title: 'Components/StackedLayout',
  component: StackedLayoutComponent,
  decorators: [
    moduleMetadata({
      imports: [StackedLayoutComponent],
      // Register the preset variation as the replacement for the standard
      // stacked layout, so every <smart-stacked-layout> renders
      // StackedLayoutPresetComponent.
      providers: [
        {
          provide: STACKED_LAYOUT_STANDARD_COMPONENT_TOKEN,
          useValue: StackedLayoutPresetComponent,
        },
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<StackedLayoutComponent>;

export const Preset: Story = {
  name: 'Preset (HyperUI)',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <ng-template #navTpl>
        <div class="smart:flex smart:items-center smart:justify-between">
          <span class="smart:text-lg smart:font-bold smart:text-gray-900 smart:dark:text-white">Acme Inc.</span>
          <nav class="smart:flex smart:gap-4 smart:text-sm smart:text-gray-600 smart:dark:text-gray-300">
            <a href="#">Dashboard</a>
            <a href="#">Team</a>
            <a href="#">Projects</a>
          </nav>
        </div>
      </ng-template>

      <ng-template #headerTpl>
        <div class="smart:flex smart:items-center smart:justify-between">
          <h1 class="smart:text-2xl smart:font-semibold smart:text-gray-900 smart:dark:text-white">Projects</h1>
          <button class="smart:rounded-md smart:bg-teal-600 smart:px-3 smart:py-2 smart:text-sm smart:font-medium smart:text-white">
            New project
          </button>
        </div>
      </ng-template>

      <div style="display: grid; gap: 32px;">
        <smart-stacked-layout [options]="{ navTpl: navTpl, headerTpl: headerTpl, containerWidth: 'xl' }">
          <p class="smart:text-gray-600 smart:dark:text-gray-300">
            Extra-wide scaffold (default) with a navigation bar and a custom header template.
          </p>
        </smart-stacked-layout>

        <smart-stacked-layout [options]="{ title: 'Dashboard', navTpl: navTpl, containerWidth: 'md' }">
          <p class="smart:text-gray-600 smart:dark:text-gray-300">
            Medium container with the title fallback (no header template provided).
          </p>
        </smart-stacked-layout>
      </div>
    `,
  }),
};
