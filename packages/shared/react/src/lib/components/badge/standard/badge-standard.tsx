import { SmartBadgeProps } from '../badge.types';
import { useBadge } from '../use-badge';

/**
 * The default badge rendering: unstyled markup exposing `color`, `size`,
 * `options.variant` and `options.pill` as `data-*` attributes for the
 * application's own CSS.
 */
export function SmartBadgeStandard(props: SmartBadgeProps) {
  const { text, color = 'gray', size = 'md', options, className } = props;
  const { remove } = useBadge(props);

  return (
    <span
      className={className}
      data-color={color}
      data-size={size}
      data-variant={options?.variant ?? 'soft'}
      data-pill={String(options?.pill !== false)}
    >
      {options?.withDot && (
        <span aria-hidden="true" className="smart-badge-dot">
          &bull;
        </span>
      )}
      <span className="smart-badge-text">{text}</span>
      {options?.withRemove && (
        <button type="button" aria-label="Remove" onClick={remove}>
          &times;
        </button>
      )}
    </span>
  );
}
