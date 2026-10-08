import { useId } from 'react';

import { SmartToggleProps } from '../toggle.types';
import { useToggle } from '../use-toggle';

/**
 * Barebones native-HTML toggle (checkbox), `<smart-toggle-standard>`.
 *
 * `options.label` renders in a `<label htmlFor>` bound to the checkbox (so it
 * is the accessible name), `options.description` in an element referenced by
 * `aria-describedby`; both sit after the checkbox, or before it when
 * `options.labelPosition === 'left'`. `options.ariaLabel` names the checkbox
 * only when there is no visible label. `className` goes on the checkbox, as
 * in Angular.
 */
export function SmartToggleStandard(props: SmartToggleProps) {
  const { disabled = false, options, className } = props;
  const { value, setValue } = useToggle(props);

  const instanceId = 'smart-toggle-' + useId();
  const inputId = instanceId + '-input';
  const descriptionId = instanceId + '-description';

  const label = options?.label ?? '';
  const description = options?.description ?? '';
  const labelPosition = options?.labelPosition ?? 'right';
  const hasText = Boolean(label || description);

  const text = (
    <span className="smart-toggle-text" data-role="text">
      {label && (
        <label className="smart-toggle-label" htmlFor={inputId}>
          {label}
        </label>
      )}
      {description && (
        <span className="smart-toggle-description" id={descriptionId}>
          {description}
        </span>
      )}
    </span>
  );

  return (
    <span className="smart-toggle" data-label-position={labelPosition}>
      {hasText && labelPosition === 'left' && text}

      <input
        type="checkbox"
        id={inputId}
        checked={value}
        disabled={disabled}
        aria-label={label ? undefined : options?.ariaLabel}
        aria-describedby={description ? descriptionId : undefined}
        className={className}
        onChange={(event) => setValue(event.target.checked)}
      />

      {hasText && labelPosition === 'right' && text}
    </span>
  );
}
