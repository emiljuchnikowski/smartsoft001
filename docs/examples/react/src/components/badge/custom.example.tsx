// #region usage
import {
  IBadgeOptions,
  SmartBadge,
  SmartBadgeProps,
  SmartProvider,
  useBadge,
} from '@smartsoft001/react';

export function CustomBadge({
  text,
  color = 'gray',
  size = 'md',
  options,
  className,
  onRemoved,
}: SmartBadgeProps) {
  const { remove } = useBadge({ onRemoved });

  const containerClasses = [
    'docs-badge',
    `docs-badge--${size}`,
    options?.pill === false ? '' : 'docs-badge--pill',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={containerClasses} data-color={color}>
      {options?.withDot && (
        <span className="docs-badge__dot" aria-hidden="true">
          &bull;
        </span>
      )}

      <span className="docs-badge__text">{text}</span>

      {options?.withRemove && (
        <button
          type="button"
          className="docs-badge__remove"
          aria-label="Remove"
          onClick={remove}
        >
          &times;
        </button>
      )}
    </span>
  );
}

// A module constant: a new object on every render would change the context.
const components = { badge: CustomBadge };

const options: IBadgeOptions = {
  variant: 'soft',
  withDot: true,
  withRemove: true,
};

export function BadgeCustomExample() {
  return (
    <SmartProvider components={components}>
      <SmartBadge text="In review" color="yellow" size="md" options={options} />
    </SmartProvider>
  );
}
// #endregion
