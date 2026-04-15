import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { IconDefaultComponent } from './default/default.component';

const meta: Meta = {
  title: 'Components/Icon',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [IconDefaultComponent],
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
