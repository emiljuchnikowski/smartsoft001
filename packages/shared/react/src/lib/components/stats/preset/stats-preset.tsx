import { cn } from '../../../utils/class-names';
import { SmartStatsProps } from '../stats.types';
import {
  getStatsActionClasses,
  getStatsChangeClasses,
  getStatsContainerClasses,
  getStatsGridClasses,
  getStatsIconWrapClasses,
  getStatsLabelClasses,
  getStatsSubClasses,
  getStatsTitleClasses,
  getStatsValueClasses,
} from './preset-classes';

/**
 * Styled stats variation (preset, the Angular `StatsPresetComponent`).
 * Register it as `components.stats` on `SmartProvider` to restyle every
 * `<SmartStats>`, or render it directly.
 *
 * Renders a responsive grid of stat blocks (Preline "Three-Column Stats with
 * Primary Accent" look): an optional leading icon, a `label` heading, the big
 * primary `value` with an optional inline `change` badge coloured by `trend`,
 * and an optional muted `previousValue` sub-line. Column count comes from
 * `options.columns` (default 3).
 */
export function SmartStatsPreset({ options, className }: SmartStatsProps) {
  const title = options?.title;
  const items = options?.items ?? [];
  const columns = options?.columns ?? 3;

  return (
    <div className={cn(getStatsContainerClasses(), className)}>
      {title ? <h2 className={getStatsTitleClasses()}>{title}</h2> : null}
      <div className={getStatsGridClasses(columns)}>
        {items.map((item, index) => (
          <div aria-label={item.ariaLabel} key={index}>
            {item.iconTpl ? (
              <div className={getStatsIconWrapClasses()}>{item.iconTpl}</div>
            ) : null}
            <h4 className={getStatsLabelClasses()}>{item.label}</h4>
            <p className={getStatsValueClasses()}>
              {item.value}
              {item.change ? (
                <>
                  {' '}
                  <span className={getStatsChangeClasses(item.trend)}>
                    {item.change}
                  </span>
                </>
              ) : null}
            </p>
            {item.previousValue !== undefined && item.previousValue !== null ? (
              <p className={getStatsSubClasses()}>{item.previousValue}</p>
            ) : null}
            {item.actionTpl ? (
              <div className={getStatsActionClasses()}>{item.actionTpl}</div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
