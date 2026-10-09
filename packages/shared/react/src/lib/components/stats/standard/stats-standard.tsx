import { SmartStatsProps } from '../stats.types';

/**
 * The default stats rendering: an unstyled title and a `<dl>` with one item per
 * stat (icon, label, value, previous value, change tagged with `data-trend`,
 * action).
 */
export function SmartStatsStandard({ options, className }: SmartStatsProps) {
  return (
    <div className={className}>
      <div className="stats">
        {options?.title ? <h3 className="title">{options.title}</h3> : null}
        <dl>
          {(options?.items ?? []).map((item, index) => (
            <div className="item" aria-label={item.ariaLabel} key={index}>
              {item.iconTpl ? <div className="icon">{item.iconTpl}</div> : null}
              <dt className="label">{item.label}</dt>
              <dd className="value">{item.value}</dd>
              {item.previousValue !== undefined &&
              item.previousValue !== null ? (
                <dd className="previous">{item.previousValue}</dd>
              ) : null}
              {item.change ? (
                <dd className="change" data-trend={item.trend}>
                  {item.change}
                </dd>
              ) : null}
              {item.actionTpl ? (
                <div className="action">{item.actionTpl}</div>
              ) : null}
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
