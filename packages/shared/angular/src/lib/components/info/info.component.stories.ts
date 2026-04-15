import { importProvidersFrom } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata, applicationConfig } from '@storybook/angular';

import { InfoDefaultComponent } from './default/default.component';

const meta: Meta = {
  title: 'Components/Info',
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [importProvidersFrom(TranslateModule.forRoot())],
    }),
    moduleMetadata({
      imports: [InfoDefaultComponent],
    }),
  ],
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  name: 'Playground',
  render: () => ({
    template: `
      <div style="padding: 40px;">
        <p style="margin-bottom: 16px; font-size: 14px; color: #6b7280;">Click the info icon to toggle the popover:</p>
        <smart-info text="This is an info tooltip with helpful information about the field."></smart-info>
      </div>
    `,
  }),
};

export const WithLongText: Story = {
  name: 'With Long Text',
  render: () => ({
    template: `
      <div style="padding: 40px;">
        <smart-info text="This is a longer description that provides detailed information about a specific field or feature. It can contain multiple sentences and will wrap nicely in the popover container."></smart-info>
      </div>
    `,
  }),
};

export const InlineWithLabel: Story = {
  name: 'Inline With Label',
  render: () => ({
    template: `
      <div style="padding: 40px; display: flex; align-items: center; gap: 8px;">
        <label style="font-size: 14px; font-weight: 500;">Email address</label>
        <smart-info text="Enter your primary email address. This will be used for notifications."></smart-info>
      </div>
    `,
  }),
};

export const MultipleInstances: Story = {
  name: 'Multiple Instances',
  render: () => ({
    template: `
      <div style="padding: 40px; display: flex; flex-direction: column; gap: 24px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <label style="font-size: 14px; font-weight: 500;">First name</label>
          <smart-info text="Your legal first name as it appears on official documents."></smart-info>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <label style="font-size: 14px; font-weight: 500;">Last name</label>
          <smart-info text="Your legal last name / family name."></smart-info>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <label style="font-size: 14px; font-weight: 500;">Phone</label>
          <smart-info text="Enter your phone number with country code."></smart-info>
        </div>
      </div>
    `,
  }),
};
