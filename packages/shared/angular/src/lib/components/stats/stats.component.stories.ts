import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { StatsPresetComponent } from './preset/preset.component';
import { StatsComponent } from './stats.component';
import { IStatsOptions } from '../../models';
import { STATS_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

interface StatsArgs {
  title: string;
  columns: 1 | 2 | 3 | 4;
}

const meta: Meta<StatsArgs> = {
  title: 'Components/Stats',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [StatsComponent],
      // Register the preset variation as the replacement for the standard
      // stats, so every <smart-stats> renders StatsPresetComponent.
      providers: [
        {
          provide: STATS_STANDARD_COMPONENT_TOKEN,
          useValue: StatsPresetComponent,
        },
      ],
    }),
  ],
  argTypes: {
    title: { control: 'text' },
    columns: { control: 'radio', options: [1, 2, 3, 4] },
  },
  args: {
    title: 'By the numbers',
    columns: 3,
  },
};

export default meta;
type Story = StoryObj<StatsArgs>;

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      options: {
        title: args.title,
        columns: args.columns,
        items: [
          {
            label: 'Accuracy rate',
            value: '99.95%',
            previousValue: 'in fulfilling orders',
          },
          {
            label: 'Startup businesses',
            value: '2,000+',
            previousValue: 'partner with us',
          },
          {
            label: 'Happy customer',
            value: '85%',
            previousValue: 'this year alone',
          },
        ],
      } satisfies IStatsOptions,
    },
    template: `<smart-stats [options]="options"></smart-stats>`,
  }),
};

const leadMetric: IStatsOptions = {
  columns: 3,
  items: [
    {
      label: 'Conversion',
      value: '92%',
      change: '+7% this month',
      trend: 'up',
      previousValue: 'of users converted',
    },
    {
      label: 'Churn',
      value: '3.2%',
      change: '-1.1% this month',
      trend: 'down',
      previousValue: 'down from last quarter',
    },
    {
      label: 'Stable',
      value: '120k',
      change: '0% change',
      trend: 'neutral',
      previousValue: 'active sessions',
    },
  ],
};

const twoColumn: IStatsOptions = {
  columns: 2,
  items: [
    { label: 'Revenue', value: '$55M+', previousValue: 'managed yearly' },
    { label: 'Partners', value: '2,000+', previousValue: 'across the globe' },
  ],
};

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { lead: leadMetric, two: twoColumn },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px;">
        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Trend badges</h3>
          <smart-stats [options]="lead"></smart-stats>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Two columns</h3>
          <smart-stats [options]="two"></smart-stats>
        </section>
      </div>
    `,
  }),
};
