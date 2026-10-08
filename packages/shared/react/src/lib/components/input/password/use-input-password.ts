import { useCallback, useEffect, useRef, useState } from 'react';

import { SmartValidatorFn } from '../../../forms/abstract-control';
import { useInput } from '../base/use-input';
import { SmartInputFieldProps } from '../input.types';

/**
 * {@link useInput} plus the strength check both Angular password inputs
 * shared: a validator on the control that reports `passwordStrength` while
 * the last rating was not strong, and `onChangePasswordStrength(valid)`, the
 * handler of that rating, which stores it and updates the control's errors
 * at once.
 *
 * The validator reads this field's last rating, so it is removed again when
 * the field unmounts or gets another control. Until a rating arrives (or
 * without `fieldOptions.possibilities.strength`, when none ever does) the
 * password counts as strong.
 */
export function useInputPassword<T>(props: SmartInputFieldProps<T>) {
  const input = useInput(props);
  const { control } = input;
  const validRef = useRef(true);
  const [strengthValidator] = useState<SmartValidatorFn>(
    () => () =>
      validRef.current
        ? null
        : {
            passwordStrength: true,
          },
  );

  useEffect(() => {
    if (!control) return undefined;

    control.addValidators(strengthValidator);
    control.updateValueAndValidity({ onlySelf: true });

    return () => control.removeValidators(strengthValidator);
  }, [control, strengthValidator]);

  const onChangePasswordStrength = useCallback(
    (valid: boolean) => {
      if (!control) return;

      validRef.current = valid;

      if (valid) {
        if (control.errors?.['passwordStrength']) {
          control.setErrors(
            Object.keys(control.errors).length === 1
              ? null
              : { ...control.errors, passwordStrength: null },
          );
        }
      } else {
        const errors = control.errors
          ? { ...control.errors, passwordStrength: true }
          : { passwordStrength: true };
        control.setErrors(errors);
      }

      control.updateValueAndValidity({ onlySelf: true });
    },
    [control],
  );

  return { ...input, onChangePasswordStrength };
}
