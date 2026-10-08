import type { Meta, StoryObj } from '@storybook/react-vite';

import { IStatsOptions } from '../../models';
import { SmartStatsPreset } from './preset/stats-preset';
import { SmartStats } from './stats';

interface StatsArgs {
  title: string;
  columns: 1 | 2 | 3 | 4;
}

const meta: Meta<StatsArgs> = {
  title: 'Components/Stats',
  tags: ['autodocs'],
  parameters: {
    // Register the preset variation as the replacement for the standard
    // stats, so every <SmartStats> renders SmartStatsPreset.
    smart: { components: { stats: SmartStatsPreset } },
  },
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

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <SmartStats
      options={
        {
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
        } satisfies IStatsOptions
      }
    />
  ),
};
// #endregion

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

const sectionTitle = { fontSize: 16, fontWeight: 600, marginBottom: 12 };

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <section>
        <h3 style={sectionTitle}>Trend badges</h3>
        <SmartStats options={leadMetric} />
      </section>

      <section>
        <h3 style={sectionTitle}>Two columns</h3>
        <SmartStats options={twoColumn} />
      </section>
    </div>
  ),
};
