import { useId } from 'react';

import {
  getInputEmailPresetClasses,
  getInputEmailPresetLabelClasses,
} from './preset-classes';
import { useInput } from '../../base/use-input';
import { SmartInputFieldProps } from '../../input.types';

/**
 * Styled `email` field (preset): the Preline look of {@link SmartInputEmail}.
 * Register it as `inputFieldComponents[FieldType.email]` on `SmartProvider`.
 */
export function SmartInputEmailPreset<T>(props: SmartInputFieldProps<T>) {
  const { className = '' } = props;
  const {
    control,
    value,
    required,
    disabled,
    label,
    setValue,
    markAsTouched,
    autoFocus,
  } = useInput(props);
  const id = useId();

  if (!control) return null;

  return (
    <>
      <label htmlFor={id} className={getInputEmailPresetLabelClasses()}>
        {label}{' '}
        {required && <span className="smart:text-red-500 smart:ml-0.5">*</span>}
      </label>
      <input
        id={id}
        type="email"
        className={getInputEmailPresetClasses(className)}
        value={value ?? ''}
        disabled={disabled}
        autoFocus={autoFocus}
        onChange={(e) => setValue(e.target.value)}
        onBlur={markAsTouched}
      />
    </>
  );
}
