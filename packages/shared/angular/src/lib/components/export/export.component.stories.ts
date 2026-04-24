import { importProvidersFrom } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';

import { ExportComponent } from './export.component';

const meta: Meta = {
  title: 'Components/Export',
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [importProvidersFrom(TranslateModule.forRoot())],
    }),
    moduleMetadata({
      imports: [ExportComponent],
    }),
  ],
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  name: 'Playground',
  render: () => ({
    props: {
      handler: (value: any) => console.log('Exported:', value),
      data: { name: 'John', email: 'john@example.com' },
    },
    template: `
      <div style="padding: 24px;">
        <p style="margin-bottom: 16px; font-size: 14px; color: #6b7280;">Click the export button to trigger the handler:</p>
        <smart-export [value]="data" [handler]="handler"></smart-export>
      </div>
    `,
  }),
};

export const WithFileName: Story = {
  name: 'With File Name',
  render: () => ({
    props: {
      handler: (value: any) => console.log('Exported:', value),
      data: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ],
    },
    template: `
      <div style="padding: 24px;">
        <smart-export [value]="data" [handler]="handler" fileName="items.csv"></smart-export>
      </div>
    `,
  }),
};

export const Disabled: Story = {
  name: 'Disabled (no value)',
  render: () => ({
    props: {
      handler: (value: any) => console.log('Exported:', value),
    },
    template: `
      <div style="padding: 24px;">
        <p style="margin-bottom: 16px; font-size: 14px; color: #6b7280;">Button is disabled when no value is provided:</p>
        <smart-export [handler]="handler"></smart-export>
      </div>
    `,
  }),
};
