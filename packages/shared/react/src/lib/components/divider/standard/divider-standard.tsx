import { SmartDividerProps } from '../divider.types';

/**
 * The default divider rendering: the title, the label and the action button, or
 * an `<hr />` when there is none of them.
 */
export function SmartDividerStandard({
  label,
  title,
  actionLabel,
  options,
  className,
  onActionClick,
}: SmartDividerProps) {
  return (
    <div
      role="separator"
      className={className || undefined}
      data-position={options?.position ?? 'center'}
    >
      {title && <h3 className="smart-divider-title">{title}</h3>}
      {label && <span className="smart-divider-label">{label}</span>}
      {!title && !label && !actionLabel && <hr />}
      {actionLabel && (
        <button
          type="button"
          className="smart-divider-action"
          onClick={() => onActionClick?.()}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
