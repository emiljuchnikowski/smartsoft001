import { useId } from 'react';

import {
  getInputPhoneNumberPlPresetClasses,
  getInputPhoneNumberPlPresetLabelClasses,
  getInputPhoneNumberPlPresetPrefixClasses,
  getInputPhoneNumberPlPresetWrapperClasses,
} from './preset-classes';
import { SmartInputFieldProps } from '../../input.types';
import { useInputPhoneNumberPl } from '../use-input-phone-number-pl';

/**
 * Styled `phoneNumberPl` field (preset): the Preline look of
 * {@link SmartInputPhoneNumberPl}, with a `+48` addon inside the input and the
 * same 9-character check. Register it as
 * `inputFieldComponents[FieldType.phoneNumberPl]` on `SmartProvider`.
 */
export function SmartInputPhoneNumberPlPreset<T>(
  props: SmartInputFieldProps<T>,
) {
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
  } = useInputPhoneNumberPl(props);
  const id = useId();

  if (!control) return null;

  return (
    <>
      <label htmlFor={id} className={getInputPhoneNumberPlPresetLabelClasses()}>
        {label}{' '}
        {required && <span className="smart:text-red-500 smart:ml-0.5">*</span>}
      </label>
      <div className={getInputPhoneNumberPlPresetWrapperClasses()}>
        <div
          className={getInputPhoneNumberPlPresetPrefixClasses()}
          data-role="phone-prefix"
        >
          +48
        </div>
        <input
          id={id}
          type="tel"
          className={getInputPhoneNumberPlPresetClasses(className)}
          value={value ?? ''}
          disabled={disabled}
          autoFocus={autoFocus}
          onChange={(e) => setValue(e.target.value)}
          onBlur={markAsTouched}
        />
      </div>
    </>
  );
}
