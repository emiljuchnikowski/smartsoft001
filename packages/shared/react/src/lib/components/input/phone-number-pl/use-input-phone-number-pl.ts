import { useEffect } from 'react';

import { SmartValidators } from '../../../forms/validators';
import { useInput } from '../base/use-input';
import { SmartInputFieldProps } from '../input.types';

const minLength9 = SmartValidators.minLength(9);
const maxLength9 = SmartValidators.maxLength(9);

/**
 * {@link useInput} plus the length check of a Polish phone number: once the
 * field has its control, `minLength(9)` and `maxLength(9)` are added to the
 * control's validators (exactly 9 characters) and the control is validated
 * again.
 *
 * The validators are shared functions, so adding them again (a second render of
 * the field, Strict Mode) does not stack them. They stay on the control after
 * the field unmounts.
 */
export function useInputPhoneNumberPl<T>(props: SmartInputFieldProps<T>) {
  const input = useInput(props);
  const { control } = input;

  useEffect(() => {
    if (!control) return;

    control.addValidators([minLength9, maxLength9]);
    control.updateValueAndValidity();
  }, [control]);

  return input;
}
