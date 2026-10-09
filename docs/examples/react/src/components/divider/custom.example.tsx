// #region usage
import {
  SmartDivider,
  SmartDividerProps,
  SmartProvider,
} from '@smartsoft001/react';

/**
 * A custom divider taking `SmartDividerProps`.
 *
 * `SmartDivider` passes every prop on: `label`, `iconName`, `title`,
 * `actionLabel`, `options`, `className` and the `onActionClick` callback.
 * Which of them an implementation honours is up to its markup.
 */
export function CustomDivider({
  label,
  title,
  actionLabel,
  className,
  onActionClick,
}: SmartDividerProps) {
  return (
    <div
      role="separator"
      className={['docs-divider', className].filter(Boolean).join(' ')}
    >
      {title ? (
        <h3 className="docs-divider__title">{title}</h3>
      ) : (
        label && <span className="docs-divider__label">{label}</span>
      )}
      {actionLabel && (
        <button type="button" onClick={() => onActionClick?.()}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

// A module constant: a new object on every render would change the context.
const components = { divider: CustomDivider };

// Every <SmartDivider> below the provider renders CustomDivider.
export function DividerCustomExample() {
  return (
    <SmartProvider components={components}>
      <SmartDivider title="Team members" actionLabel="Add member" />
    </SmartProvider>
  );
}
// #endregion
