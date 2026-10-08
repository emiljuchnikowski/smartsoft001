import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  IProgressBarsOptions,
  IProgressStep,
  SmartProgressBarsLayout,
} from '../../models';
import { SmartProgressBarsPreset } from './preset/progress-bars-preset';
import { SmartProgressBars } from './progress-bars';

const STEP_LAYOUTS: SmartProgressBarsLayout[] = [
  'simple',
  'panels',
  'panels-with-border',
  'bullets',
  'bullets-and-text',
  'circles',
  'circles-with-text',
];

const SAMPLE_STEPS: IProgressStep[] = [
  { id: 'account', name: 'Account', index: '1', status: 'complete' },
  { id: 'profile', name: 'Profile', index: '2', status: 'current' },
  { id: 'review', name: 'Review', index: '3', status: 'upcoming' },
];

const SAMPLE_STEPS_WITH_TEXT: IProgressStep[] = [
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
  parameters: {
    // Register the preset variation as the replacement for the standard
    // progress-bars, so every <SmartProgressBars> renders the preset.
    smart: { components: { 'progress-bars': SmartProgressBarsPreset } },
  },
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

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <div style={{ padding: 40, maxWidth: 640 }}>
      <SmartProgressBars
        options={{
          layout: args.layout,
          value: args.value,
          title: args.title,
          steps: args.layout?.startsWith('circles')
            ? SAMPLE_STEPS_WITH_TEXT
            : SAMPLE_STEPS,
        }}
      />
    </div>
  ),
};
// #endregion

const sectionTitle = { fontSize: 16, fontWeight: 600, marginBottom: 12 };

const bar25: IProgressBarsOptions = { layout: 'progress-bar', value: 25 };
const bar60Title: IProgressBarsOptions = {
  layout: 'progress-bar',
  value: 60,
  title: 'Uploading files',
};
const barColumns: IProgressBarsOptions = {
  layout: 'progress-bar',
  value: 50,
  columns: [
    { label: 'Cart' },
    { label: 'Shipping', active: true },
    { label: 'Payment' },
  ],
};
const simple: IProgressBarsOptions = { layout: 'simple', steps: SAMPLE_STEPS };
const panels: IProgressBarsOptions = { layout: 'panels', steps: SAMPLE_STEPS };
const panelsBorder: IProgressBarsOptions = {
  layout: 'panels-with-border',
  steps: SAMPLE_STEPS,
};
const bullets: IProgressBarsOptions = {
  layout: 'bullets',
  steps: SAMPLE_STEPS,
};
const bulletsText: IProgressBarsOptions = {
  layout: 'bullets-and-text',
  steps: SAMPLE_STEPS_WITH_TEXT,
};
const circles: IProgressBarsOptions = {
  layout: 'circles',
  steps: SAMPLE_STEPS,
};
const circlesText: IProgressBarsOptions = {
  layout: 'circles-with-text',
  steps: SAMPLE_STEPS_WITH_TEXT,
};

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        padding: 24,
        maxWidth: 720,
      }}
    >
      <section>
        <h3 style={sectionTitle}>Progress bar</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SmartProgressBars options={bar25} />
          <SmartProgressBars options={bar60Title} />
          <SmartProgressBars options={barColumns} />
        </div>
      </section>

      <section>
        <h3 style={sectionTitle}>Simple</h3>
        <SmartProgressBars options={simple} />
      </section>

      <section>
        <h3 style={sectionTitle}>Panels</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SmartProgressBars options={panels} />
          <SmartProgressBars options={panelsBorder} />
        </div>
      </section>

      <section>
        <h3 style={sectionTitle}>Bullets</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SmartProgressBars options={bullets} />
          <SmartProgressBars options={bulletsText} />
        </div>
      </section>

      <section>
        <h3 style={sectionTitle}>Circles</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <SmartProgressBars options={circles} />
          <SmartProgressBars options={circlesText} />
        </div>
      </section>
    </div>
  ),
};
