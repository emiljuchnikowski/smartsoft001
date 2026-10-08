import { cn } from '../../../utils/class-names';
import { SmartBadgeProps } from '../badge.types';
import { useBadge } from '../use-badge';
import {
  getBadgeClasses,
  getDotClasses,
  getRemoveClasses,
} from './preset-classes';

/**
 * Styled badge variation (preset). Register it as `components.badge` on
 * `SmartProvider` to restyle every `<SmartBadge>`, or render it directly.
 *
 * Groups the solid / soft / outline colour presets into one component,
 * selected by `options.variant` (default `soft`), across the
 * `SmartBadgeColor` palette.
 */
export function SmartBadgePreset(props: SmartBadgeProps) {
  const { text, color = 'gray', size = 'md', options, className } = props;
  const { remove } = useBadge(props);

  const variant = options?.variant ?? 'soft';
  const pill = options?.pill !== false;

  return (
    <span
      className={cn(getBadgeClasses(variant, color, pill, size), className)}
    >
      {options?.withDot && (
        <svg
          className={getDotClasses(color)}
          viewBox="0 0 6 6"
          aria-hidden="true"
        >
          <circle cx="3" cy="3" r="3" />
        </svg>
      )}
      {text}
      {options?.withRemove && (
        <button
          type="button"
          aria-label="Remove"
          className={getRemoveClasses()}
          onClick={remove}
        >
          <span className="smart:sr-only">Remove</span>
          <svg
            className="smart:size-3.5 smart:stroke-current smart:opacity-50 smart:group-hover:opacity-75"
            viewBox="0 0 14 14"
            aria-hidden="true"
          >
            <path
              d="M4 4l6 6m0-6l-6 6"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </span>
  );
}
