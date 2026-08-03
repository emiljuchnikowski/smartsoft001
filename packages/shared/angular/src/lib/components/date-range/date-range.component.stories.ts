import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';

import { DateRangeComponent } from './date-range.component';
import { StyleService, UIService } from '../../services';
import { DateRangePresetComponent } from './preset/preset.component';
import { DateRangeModalStandardComponent } from './standard/standard-modal.component';
import { provideStorybookTranslations } from '../../../../.storybook/storybook-translations';

const meta: Meta = {
  title: 'Components/DateRange',
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [...provideStorybookTranslations()],
    }),
    moduleMetadata({
      imports: [
        DateRangeComponent,
        DateRangeModalStandardComponent,
        DateRangePresetComponent,
      ],
      providers: [UIService, StyleService],
    }),
  ],
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  name: 'Playground',
  render: () => ({
    props: { value: undefined },
    template: `
      <smart-date-range [(ngModel)]="value"></smart-date-range>
      <p style="margin-top: 12px; font-size: 14px; color: #6b7280;">
        Value: {{ value ? value.start + ' - ' + value.end : 'none' }}
      </p>
    `,
  }),
};

export const DefaultEmpty: Story = {
  name: 'Default (no value)',
  render: () => ({
    template: `<smart-date-range></smart-date-range>`,
  }),
};

export const WithPresetRange: Story = {
  name: 'With Preset Range',
  render: () => ({
    props: { value: { start: '2026-04-01', end: '2026-04-07' } },
    template: `
      <smart-date-range [(ngModel)]="value"></smart-date-range>
      <p style="margin-top: 12px; font-size: 14px; color: #6b7280;">
        {{ value.start }} - {{ value.end }}
      </p>
    `,
  }),
};

export const MultipleInstances: Story = {
  name: 'Multiple Instances',
  render: () => ({
    props: {
      startRange: { start: '2026-01-01', end: '2026-01-31' },
      endRange: { start: '2026-04-01', end: '2026-04-30' },
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div>
          <label style="display: block; font-size: 14px; font-weight: 500; margin-bottom: 4px;">Start Range</label>
          <smart-date-range [(ngModel)]="startRange"></smart-date-range>
        </div>
        <div>
          <label style="display: block; font-size: 14px; font-weight: 500; margin-bottom: 4px;">End Range</label>
          <smart-date-range [(ngModel)]="endRange"></smart-date-range>
        </div>
      </div>
    `,
  }),
};

export const ModalCalendar: Story = {
  name: 'Modal Calendar (inline)',
  render: () => ({
    template: `
      <div style="position: relative; height: 600px;">
        <smart-date-range-modal-standard
          [showFilterBtns]="true"
          (apply)="onApply($event)"
          (dismiss)="onDismiss()"
        />
      </div>
    `,
    props: {
      onApply: (data: any) => console.log('Applied:', data),
      onDismiss: () => console.log('Dismissed'),
    },
  }),
};

export const ModalWithoutFilters: Story = {
  name: 'Modal Calendar (no filters)',
  render: () => ({
    template: `
      <div style="position: relative; height: 600px;">
        <smart-date-range-modal-standard
          [showFilterBtns]="false"
          (apply)="onApply($event)"
          (dismiss)="onDismiss()"
        />
      </div>
    `,
    props: {
      onApply: (data: any) => console.log('Applied:', data),
      onDismiss: () => console.log('Dismissed'),
    },
  }),
};

// Preline "single calendar range" styling (FRA-219). Click the trigger to open
// the signal-driven range calendar; pick a start and end day to highlight the
// range, then Apply.
export const Preset: Story = {
  name: 'Preset (Preline range calendar)',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { value: undefined },
    template: `
      <div style="padding: 40px; min-height: 520px;">
        <smart-date-range variant="preset" [(ngModel)]="value"></smart-date-range>
        <p style="margin-top: 12px; font-size: 14px; color: #6b7280;">
          Value: {{ value ? value.start + ' - ' + value.end : 'none' }}
        </p>
      </div>
    `,
  }),
};

export const PresetWithValue: Story = {
  name: 'Preset (with preset range)',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { value: { start: '2026-04-01', end: '2026-04-07' } },
    template: `
      <div style="padding: 40px; min-height: 520px;">
        <smart-date-range variant="preset" [(ngModel)]="value"></smart-date-range>
        <p style="margin-top: 12px; font-size: 14px; color: #6b7280;">
          {{ value.start }} - {{ value.end }}
        </p>
      </div>
    `,
  }),
};
