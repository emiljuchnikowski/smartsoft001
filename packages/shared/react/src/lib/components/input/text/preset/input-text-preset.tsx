import { useId } from 'react';

import {
  getInputTextPresetClasses,
  getInputTextPresetLabelClasses,
} from './preset-classes';
import { useInput } from '../../base/use-input';
import { SmartInputFieldProps } from '../../input.types';

/**
 * Styled `text` field (preset, the Angular `InputTextPresetComponent`):
 * the Preline look of {@link SmartInputText}. Register it as
 * `inputFieldComponents[FieldType.text]` on `SmartProvider`.
 */
export function SmartInputTextPreset<T>(props: SmartInputFieldProps<T>) {
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
      <label htmlFor={id} className={getInputTextPresetLabelClasses()}>
        {label}
        {required && <span className="smart:text-red-500 smart:ml-0.5">*</span>}
      </label>
      <input
        id={id}
        type="text"
        className={getInputTextPresetClasses(className)}
        value={value ?? ''}
        disabled={disabled}
        autoFocus={autoFocus}
        onChange={(e) => setValue(e.target.value)}
        onBlur={markAsTouched}
      />
    </>
  );
}
