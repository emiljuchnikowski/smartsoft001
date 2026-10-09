// #region usage
import { IStatsOptions, SmartStats } from '@smartsoft001/react';

const options: IStatsOptions = {
  title: 'Last 30 days',
  columns: 3,
  items: [
    {
      label: 'Total subscribers',
      value: '71,897',
      previousValue: '70,946',
      change: '12%',
      trend: 'up',
    },
    { label: 'Avg. open rate', value: '58.16%', previousValue: '56.14%' },
    { label: 'Avg. click rate', value: '24.57%', previousValue: '28.62%' },
  ],
};

export function StatsUsageExample() {
  return <SmartStats options={options} />;
}
// #endregion
