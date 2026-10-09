// #region usage
import {
  IStatsOptions,
  SmartProvider,
  SmartStats,
  SmartStatsProps,
} from '@smartsoft001/react';

// The stats block has no behaviour hook: an implementation only renders its
// props.
export function CustomStats({ options, className }: SmartStatsProps) {
  const containerClasses = ['docs-stats', className].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} data-columns={options?.columns ?? 3}>
      {options?.title && <h3 className="docs-stats__title">{options.title}</h3>}

      <dl className="docs-stats__grid">
        {(options?.items ?? []).map((item) => (
          <div
            key={item.label}
            className="docs-stats__item"
            aria-label={item.ariaLabel}
          >
            <dt className="docs-stats__label">{item.label}</dt>
            <dd className="docs-stats__value">{item.value}</dd>
            {item.previousValue !== undefined &&
              item.previousValue !== null && (
                <dd className="docs-stats__previous">{item.previousValue}</dd>
              )}
            {item.change && (
              <dd className="docs-stats__change" data-trend={item.trend}>
                {item.change}
              </dd>
            )}
          </div>
        ))}
      </dl>
    </div>
  );
}

// A module constant: a new object on every render would change the context.
const components = { stats: CustomStats };

const options: IStatsOptions = {
  title: 'By the numbers',
  columns: 3,
  items: [
    {
      label: 'Accuracy rate',
      value: '99.95%',
      previousValue: 'in fulfilling orders',
      change: '+0.4% this quarter',
      trend: 'up',
    },
    {
      label: 'Startup businesses',
      value: '2,000+',
      previousValue: 'partner with us',
    },
    {
      label: 'Happy customers',
      value: '85%',
      previousValue: 'this year alone',
    },
  ],
};

// Every <SmartStats> below the provider renders CustomStats.
export function StatsCustomExample() {
  return (
    <SmartProvider components={components}>
      <SmartStats options={options} />
    </SmartProvider>
  );
}
// #endregion
