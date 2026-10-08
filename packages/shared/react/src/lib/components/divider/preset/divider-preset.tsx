import { cn } from '../../../utils/class-names';
import { SmartDividerProps } from '../divider.types';
import {
  getDividerActionClasses,
  getDividerContainerClasses,
  getDividerIconClasses,
  getDividerPlainClasses,
  getDividerToolbarClasses,
  getDividerToolbarLineClasses,
  SmartDividerPresetVariant,
} from './preset-classes';

type ResolvedVariant = SmartDividerPresetVariant | 'plain';

/**
 * Styled divider variation (preset). Register it as `components.divider` on
 * `SmartProvider` to restyle every `<SmartDivider>`, or render it directly.
 *
 * Translates Preline's divider patterns: a plain `<hr>`, an inline
 * label/icon/title with connecting line(s) positioned left/center/right (via
 * `options.position`), a centered action button, and a label + line + action
 * "toolbar" row. The variant is taken from `options.variant`; when omitted it
 * is inferred from the given props (action, title, icon, label, in that order).
 */
export function SmartDividerPreset({
  label,
  iconName,
  title,
  actionLabel,
  options,
  className = '',
  onActionClick,
}: SmartDividerProps) {
  const variant = resolveVariant({
    label,
    iconName,
    title,
    actionLabel,
    options,
  });
  const position = options?.position ?? 'center';
  // Text rendered as the divider content (label/icon/button branches).
  const content =
    variant === 'with-title' ? (title ?? label ?? '') : (label ?? title ?? '');
  const containerClasses = getDividerContainerClasses(
    variant === 'plain' ? 'with-label' : variant,
    position,
  );

  const actionButton = (
    <button
      type="button"
      className={getDividerActionClasses()}
      onClick={() => onActionClick?.()}
    >
      {iconName && <span className={getDividerIconClasses()}>{iconName}</span>}
      {actionLabel}
    </button>
  );

  if (variant === 'plain') {
    return (
      <hr
        role="separator"
        className={cn(getDividerPlainClasses(), className)}
      />
    );
  }

  if (variant === 'with-toolbar') {
    return (
      <div
        role="separator"
        className={cn(getDividerToolbarClasses(), className)}
      >
        {content && <span>{content}</span>}
        <div className={getDividerToolbarLineClasses()}></div>
        {actionLabel && actionButton}
      </div>
    );
  }

  if (variant === 'with-button') {
    return (
      <div role="separator" className={cn(containerClasses, className)}>
        {actionButton}
      </div>
    );
  }

  return (
    <div role="separator" className={cn(containerClasses, className)}>
      {iconName && <span className={getDividerIconClasses()}>{iconName}</span>}
      {content}
    </div>
  );
}

function resolveVariant({
  label,
  iconName,
  title,
  actionLabel,
  options,
}: SmartDividerProps): ResolvedVariant {
  if (options?.variant) return options.variant;
  if (actionLabel) return 'with-button';
  if (title) return 'with-title';
  if (iconName) return 'with-icon';
  if (label) return 'with-label';

  return 'plain';
}
