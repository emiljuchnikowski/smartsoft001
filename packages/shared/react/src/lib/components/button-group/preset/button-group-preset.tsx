import { SmartButtonGroupVariant } from '../../../models';
import { cn } from '../../../utils/class-names';
import { SmartButtonGroupProps } from '../button-group.types';
import { useButtonGroup } from '../use-button-group';
import {
  getButtonGroupButtonClasses,
  getButtonGroupClasses,
  getButtonGroupCountClasses,
  getButtonGroupIconClasses,
} from './preset-classes';

/**
 * Styled button group variation (preset). Register it as
 * `components['button-group']` on `SmartProvider` to restyle every
 * `<SmartButtonGroup>`, or render it directly.
 *
 * Renders a horizontal segmented control following the Preline button-group
 * look (shared borders collapsed via `-ms-px`, rounded ends). The active
 * segment (matching `selected`) is emphasised. `options.variant` tweaks the
 * per-button content: `icon-only` hides labels (moving them to `aria-label`),
 * `with-stat` styles the count pill.
 */
export function SmartButtonGroupPreset(props: SmartButtonGroupProps) {
  const { buttons = [], options, className = '' } = props;
  const { selected, select } = useButtonGroup(props);

  const variant: SmartButtonGroupVariant = options?.variant ?? 'basic';
  const iconOnly = variant === 'icon-only';

  return (
    <div role="group" className={cn(getButtonGroupClasses(), className)}>
      {buttons.map((btn) => {
        const active = selected === btn.id;

        return (
          <button
            key={btn.id}
            type="button"
            disabled={btn.disabled}
            // No size field exists on IButtonGroupOptions, so the medium
            // Preline size is used for every segment.
            className={getButtonGroupButtonClasses('md', active)}
            aria-pressed={active}
            aria-label={iconOnly ? btn.label : undefined}
            onClick={() => select(btn.id)}
          >
            {btn.icon && (
              <span className={getButtonGroupIconClasses()} aria-hidden="true">
                {btn.icon}
              </span>
            )}
            {!iconOnly && btn.label && <span>{btn.label}</span>}
            {!iconOnly && btn.count != null && (
              <span
                data-role="count"
                className={getButtonGroupCountClasses(variant)}
              >
                {btn.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
