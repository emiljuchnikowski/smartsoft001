import { cn } from '../../../utils/class-names';
import { SmartToggleProps } from '../toggle.types';
import { useToggle } from '../use-toggle';
import {
  getToggleContainerClasses,
  getToggleDescriptionClasses,
  getToggleLabelClasses,
  getToggleSwitchClasses,
  getToggleTextWrapClasses,
  getToggleThumbClasses,
  getToggleTrackClasses,
  TOGGLE_INPUT_CLASSES,
} from './preset-classes';

/**
 * Styled toggle (switch) variation (preset). Register it as
 * `components.toggle` on `SmartProvider` to restyle every `<SmartToggle>`, or
 * render it directly.
 *
 * Renders the Preline default switch: a visually hidden, accessible checkbox
 * drives the track / thumb visuals via `peer-*` states, while `value` holds the
 * checked state. Optional `options.label` / `options.description` render
 * beside the switch on the side given by `options.labelPosition` (right by
 * default). `className` goes on the root.
 */
export function SmartTogglePreset(props: SmartToggleProps) {
  const { disabled = false, options, className } = props;
  const { value, setValue } = useToggle(props);

  const label = options?.label ?? '';
  const description = options?.description ?? '';
  const labelPosition = options?.labelPosition ?? 'right';
  const hasText = Boolean(label || description);

  const text = (
    <span className={getToggleTextWrapClasses()}>
      {label && <span className={getToggleLabelClasses()}>{label}</span>}
      {description && (
        <span className={getToggleDescriptionClasses()}>{description}</span>
      )}
    </span>
  );

  return (
    <div className={cn(getToggleContainerClasses(hasText), className)}>
      {hasText && labelPosition === 'left' && text}

      <label className={getToggleSwitchClasses()}>
        <input
          type="checkbox"
          className={TOGGLE_INPUT_CLASSES}
          checked={value}
          disabled={disabled}
          aria-label={options?.ariaLabel}
          onChange={(event) => setValue(event.target.checked)}
        />
        <span className={getToggleTrackClasses()}></span>
        <span className={getToggleThumbClasses()}></span>
      </label>

      {hasText && labelPosition === 'right' && text}
    </div>
  );
}
