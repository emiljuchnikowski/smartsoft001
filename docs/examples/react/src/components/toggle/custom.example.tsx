// #region usage
import { useState } from 'react';

import {
  IToggleOptions,
  SmartProvider,
  SmartToggle,
  SmartToggleProps,
  useToggle,
} from '@smartsoft001/react';

export function CustomToggle(props: SmartToggleProps) {
  const { disabled = false, options, className } = props;
  // useToggle keeps the value (controlled or internal) and reports it through
  // onValueChange; its toggle() would also respect `disabled`.
  const { value, setValue } = useToggle(props);
  const labelPosition = options?.labelPosition ?? 'right';
  const containerClasses = [
    'docs-toggle',
    `docs-toggle--label-${labelPosition}`,
    disabled && 'docs-toggle--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  const label = options?.label && (
    <span className="docs-toggle__label">{options.label}</span>
  );

  return (
    <label className={containerClasses}>
      {labelPosition === 'left' && label}

      <input
        type="checkbox"
        className="docs-toggle__input"
        checked={value}
        disabled={disabled}
        aria-label={options?.ariaLabel}
        onChange={(event) => setValue(event.target.checked)}
      />

      {labelPosition !== 'left' && label}
      {options?.description && (
        <span className="docs-toggle__description">{options.description}</span>
      )}
    </label>
  );
}

// A module constant: a new object on every render would change the context.
const components = { toggle: CustomToggle };

const options: IToggleOptions = {
  label: 'Allow notifications',
  description: 'Send me an email when someone comments on my work.',
  ariaLabel: 'Allow notifications',
};

// Every <SmartToggle> below the provider renders CustomToggle. Without value
// the state lives in the implementation and starts at defaultValue;
// onValueChange still reports every change.
export function ToggleCustomExample() {
  const [enabled, setEnabled] = useState(false);

  return (
    <SmartProvider components={components}>
      <SmartToggle
        defaultValue={false}
        options={options}
        onValueChange={setEnabled}
      />
      <p>Notifications are {enabled ? 'on' : 'off'}.</p>
    </SmartProvider>
  );
}
// #endregion
