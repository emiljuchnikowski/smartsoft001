import { importProvidersFrom } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';

import { ImportComponent } from './import.component';

const meta: Meta = {
  title: 'Components/Import',
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [importProvidersFrom(TranslateModule.forRoot())],
    }),
    moduleMetadata({
      imports: [ImportComponent],
    }),
  ],
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  name: 'Playground',
  render: () => ({
    props: {
      onFileSelected: (file: File) =>
        console.log('Imported file:', file.name, file.size),
    },
    template: `
      <div style="padding: 24px;">
        <p style="margin-bottom: 16px; font-size: 14px; color: #6b7280;">Click the import button to select a file:</p>
        <smart-import (set)="onFileSelected($event)"></smart-import>
      </div>
    `,
  }),
};

export const AcceptJSON: Story = {
  name: 'Accept JSON Only',
  render: () => ({
    props: {
      onFileSelected: (file: File) => console.log('Imported JSON:', file.name),
    },
    template: `
      <div style="padding: 24px;">
        <smart-import accept="application/json" (set)="onFileSelected($event)"></smart-import>
      </div>
    `,
  }),
};

export const AcceptCSV: Story = {
  name: 'Accept CSV',
  render: () => ({
    props: {
      onFileSelected: (file: File) => console.log('Imported CSV:', file.name),
    },
    template: `
      <div style="padding: 24px;">
        <smart-import accept=".csv" (set)="onFileSelected($event)"></smart-import>
      </div>
    `,
  }),
};
