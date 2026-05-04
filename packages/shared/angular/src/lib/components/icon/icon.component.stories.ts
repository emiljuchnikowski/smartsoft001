import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { IconComponent } from './icon.component';

const meta: Meta = {
  title: 'Components/Icon',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [IconComponent],
    }),
  ],
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  name: 'Playground',
  render: () => ({
    template: `
      <div style="display: flex; gap: 24px; align-items: center;">
        <div style="text-align: center;">
          <smart-icon name="spinner"></smart-icon>
          <p style="margin-top: 8px; font-size: 12px; color: #6b7280;">spinner</p>
        </div>
        <div style="text-align: center;">
          <smart-icon name="chevron-down"></smart-icon>
          <p style="margin-top: 8px; font-size: 12px; color: #6b7280;">chevron-down</p>
        </div>
        <div style="text-align: center;">
          <smart-icon name="chevron-up"></smart-icon>
          <p style="margin-top: 8px; font-size: 12px; color: #6b7280;">chevron-up</p>
        </div>
      </div>
    `,
  }),
};

export const Spinner: Story = {
  name: 'Spinner',
  render: () => ({
    template: `<smart-icon name="spinner"></smart-icon>`,
  }),
};

export const ChevronDown: Story = {
  name: 'Chevron Down',
  render: () => ({
    template: `<smart-icon name="chevron-down"></smart-icon>`,
  }),
};

export const ChevronUp: Story = {
  name: 'Chevron Up',
  render: () => ({
    template: `<smart-icon name="chevron-up"></smart-icon>`,
  }),
};

export const WithCustomClass: Story = {
  name: 'With Custom CSS Class',
  render: () => ({
    template: `
      <div style="display: flex; gap: 24px; align-items: center;">
        <smart-icon name="spinner" class="smart:size-8 smart:text-indigo-600"></smart-icon>
        <smart-icon name="chevron-down" class="smart:size-8 smart:text-red-500"></smart-icon>
        <smart-icon name="chevron-up" class="smart:size-8 smart:text-green-500"></smart-icon>
      </div>
    `,
  }),
};

export const CustomTemplate: Story = {
  name: 'Custom SVG Template',
  render: () => ({
    template: `
      <ng-template #heart>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="smart:size-8 smart:text-pink-500"
        >
          <path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 3 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6.5 4.5 4.5 8.5C19 16.65 12 21 12 21z"/>
        </svg>
      </ng-template>
      <smart-icon [template]="heart"></smart-icon>
    `,
  }),
};
