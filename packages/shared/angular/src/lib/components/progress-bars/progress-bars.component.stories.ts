import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { ProgressBarsPresetComponent } from './preset/preset.component';
import { ProgressBarsComponent } from './progress-bars.component';
import { SmartProgressBarsLayout } from '../../models';
import { PROGRESS_BARS_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

const STEP_LAYOUTS: SmartProgressBarsLayout[] = [
  'simple',
  'panels',
  'panels-with-border',
  'bullets',
  'bullets-and-text',
  'circles',
  'circles-with-text',
];

const SAMPLE_STEPS = [
  { id: 'account', name: 'Account', index: '1', status: 'complete' },
  { id: 'profile', name: 'Profile', index: '2', status: 'current' },
  { id: 'review', name: 'Review', index: '3', status: 'upcoming' },
];

const SAMPLE_STEPS_WITH_TEXT = [
  {
    id: 'account',
    name: 'Account',
    description: 'Create your account',
    index: '1',
    status: 'complete',
  },
  {
    id: 'profile',
    name: 'Profile',
    description: 'Add your details',
    index: '2',
    status: 'current',
  },
  {
    id: 'review',
    name: 'Review',
    description: 'Confirm and finish',
    index: '3',
    status: 'upcoming',
  },
];

interface ProgressBarsArgs {
  layout: SmartProgressBarsLayout;
  value: number;
  title: string;
}

const meta: Meta<ProgressBarsArgs> = {
  title: 'Components/ProgressBars',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [ProgressBarsComponent],
      // Register the preset variation as the replacement for the standard
      // progress-bars, so every <smart-progress-bars> renders the preset.
      providers: [
        {
          provide: PROGRESS_BARS_STANDARD_COMPONENT_TOKEN,
          useValue: ProgressBarsPresetComponent,
        },
      ],
    }),
  ],
  argTypes: {
    layout: {
      control: 'select',
      options: ['progress-bar', ...STEP_LAYOUTS],
    },
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    title: { control: 'text' },
  },
  args: {
    layout: 'progress-bar',
    value: 50,
    title: 'Uploading files',
  },
};

export default meta;
type Story = StoryObj<ProgressBarsArgs>;

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      options: {
        layout: args.layout,
        value: args.value,
        title: args.title,
        steps: args.layout?.startsWith('circles')
          ? SAMPLE_STEPS_WITH_TEXT
          : SAMPLE_STEPS,
      },
    },
    template: `
      <div style="padding: 40px; max-width: 640px;">
        <smart-progress-bars [options]="options"></smart-progress-bars>
      </div>
    `,
  }),
};

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      bar25: { layout: 'progress-bar', value: 25 },
      bar60Title: {
        layout: 'progress-bar',
        value: 60,
        title: 'Uploading files',
      },
      barColumns: {
        layout: 'progress-bar',
        value: 50,
        columns: [
          { label: 'Cart' },
          { label: 'Shipping', active: true },
          { label: 'Payment' },
        ],
      },
      simple: { layout: 'simple', steps: SAMPLE_STEPS },
      panels: { layout: 'panels', steps: SAMPLE_STEPS },
      panelsBorder: { layout: 'panels-with-border', steps: SAMPLE_STEPS },
      bullets: { layout: 'bullets', steps: SAMPLE_STEPS },
      bulletsText: {
        layout: 'bullets-and-text',
        steps: SAMPLE_STEPS_WITH_TEXT,
      },
      circles: { layout: 'circles', steps: SAMPLE_STEPS },
      circlesText: {
        layout: 'circles-with-text',
        steps: SAMPLE_STEPS_WITH_TEXT,
      },
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px; max-width: 720px;">

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Progress bar</h3>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <smart-progress-bars [options]="bar25"></smart-progress-bars>
            <smart-progress-bars [options]="bar60Title"></smart-progress-bars>
            <smart-progress-bars [options]="barColumns"></smart-progress-bars>
          </div>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Simple</h3>
          <smart-progress-bars [options]="simple"></smart-progress-bars>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Panels</h3>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <smart-progress-bars [options]="panels"></smart-progress-bars>
            <smart-progress-bars [options]="panelsBorder"></smart-progress-bars>
          </div>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Bullets</h3>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <smart-progress-bars [options]="bullets"></smart-progress-bars>
            <smart-progress-bars [options]="bulletsText"></smart-progress-bars>
          </div>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Circles</h3>
          <div style="display: flex; flex-direction: column; gap: 24px;">
            <smart-progress-bars [options]="circles"></smart-progress-bars>
            <smart-progress-bars [options]="circlesText"></smart-progress-bars>
          </div>
        </section>

      </div>
    `,
  }),
};
