import { useId } from 'react';

import {
  getInputPhoneNumberPresetClasses,
  getInputPhoneNumberPresetLabelClasses,
} from './preset-classes';
import { useInput } from '../../base/use-input';
import { SmartInputFieldProps } from '../../input.types';

/**
 * Styled `phoneNumber` field (preset, the Angular
 * `InputPhoneNumberPresetComponent`): the Preline look of
 * {@link SmartInputPhoneNumber}. Register it as
 * `inputFieldComponents[FieldType.phoneNumber]` on `SmartProvider`.
 */
export function SmartInputPhoneNumberPreset<T>(props: SmartInputFieldProps<T>) {
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
      <label htmlFor={id} className={getInputPhoneNumberPresetLabelClasses()}>
        {label}{' '}
        {required && <span className="smart:text-red-500 smart:ml-0.5">*</span>}
      </label>
      <input
        id={id}
        type="tel"
        className={getInputPhoneNumberPresetClasses(className)}
        value={value ?? ''}
        disabled={disabled}
        autoFocus={autoFocus}
        onChange={(e) => setValue(e.target.value)}
        onBlur={markAsTouched}
      />
    </>
  );
}
