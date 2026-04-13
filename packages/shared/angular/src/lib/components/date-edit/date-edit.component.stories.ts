import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { DateEditDefaultComponent } from './default/default.component';

const meta: Meta = {
  title: 'Components/DateEdit',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [DateEditDefaultComponent],
    }),
  ],
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  name: 'Playground',
  render: () => ({
    props: { value: '2023-06-15' },
    template: `<smart-date-edit [(ngModel)]="value"></smart-date-edit>
    <p style="margin-top: 12px; font-size: 14px; color: #6b7280;">Value: {{ value }}</p>`,
  }),
};

export const DefaultEmpty: Story = {
  name: 'Default (2001-01-01)',
  render: () => ({
    template: `<smart-date-edit></smart-date-edit>`,
  }),
};

export const WithPresetValue: Story = {
  name: 'With Preset Value',
  render: () => ({
    props: { value: '2026-04-07' },
    template: `<smart-date-edit [(ngModel)]="value"></smart-date-edit>
    <p style="margin-top: 12px; font-size: 14px; color: #6b7280;">Current value: {{ value }}</p>`,
  }),
};

export const MultipleInstances: Story = {
  name: 'Multiple Instances',
  render: () => ({
    props: { startDate: '2026-01-01', endDate: '2026-12-31' },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div>
          <label style="display: block; font-size: 14px; font-weight: 500; margin-bottom: 4px;">Start Date</label>
          <smart-date-edit [(ngModel)]="startDate"></smart-date-edit>
        </div>
        <div>
          <label style="display: block; font-size: 14px; font-weight: 500; margin-bottom: 4px;">End Date</label>
          <smart-date-edit [(ngModel)]="endDate"></smart-date-edit>
        </div>
      </div>
    `,
  }),
};
