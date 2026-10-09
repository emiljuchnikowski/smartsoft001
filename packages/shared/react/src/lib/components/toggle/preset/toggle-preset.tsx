import { useId } from 'react';

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
 * default): the label is a `<label htmlFor>` of the checkbox (its accessible
 * name) and the description is referenced by `aria-describedby`.
 * `options.ariaLabel` names the checkbox only when there is no `label`.
 * `className` goes on the root.
 */
export function SmartTogglePreset(props: SmartToggleProps) {
  const { disabled = false, options, className } = props;
  const { value, setValue } = useToggle(props);

  const instanceId = 'smart-toggle-preset-' + useId();
  const inputId = instanceId + '-input';
  const descriptionId = instanceId + '-description';

  const label = options?.label ?? '';
  const description = options?.description ?? '';
  const labelPosition = options?.labelPosition ?? 'right';
  const hasText = Boolean(label || description);

  const text = (
    <span className={getToggleTextWrapClasses()}>
      {label && (
        <label className={getToggleLabelClasses()} htmlFor={inputId}>
          {label}
        </label>
      )}
      {description && (
        <span className={getToggleDescriptionClasses()} id={descriptionId}>
          {description}
        </span>
      )}
    </span>
  );

  return (
    <div className={cn(getToggleContainerClasses(hasText), className)}>
      {hasText && labelPosition === 'left' && text}

      <label className={getToggleSwitchClasses()}>
        <input
          type="checkbox"
          id={inputId}
          className={TOGGLE_INPUT_CLASSES}
          checked={value}
          disabled={disabled}
          aria-label={label ? undefined : options?.ariaLabel}
          aria-describedby={description ? descriptionId : undefined}
          onChange={(event) => setValue(event.target.checked)}
        />
        <span className={getToggleTrackClasses()}></span>
        <span className={getToggleThumbClasses()}></span>
      </label>

      {hasText && labelPosition === 'right' && text}
    </div>
  );
}
