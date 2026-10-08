import { useEffect } from 'react';

import { NipService } from '@smartsoft001/utils';

import { SmartValidatorFn } from '../../../forms/abstract-control';
import { useInput } from '../base/use-input';
import { SmartInputFieldProps } from '../input.types';

/** Reports `invalidNip` for a non-empty value that is not a valid NIP. */
const nipValidator: SmartValidatorFn = (c) => {
  if (c.value && NipService.isInvalid(c.value)) {
    return {
      invalidNip: true,
    };
  }

  return null;
};

/**
 * {@link useInput} plus what the Angular NIP inputs did once their options
 * were set (`afterSetOptionsHandler`): add the NIP check to the control's
 * validators and validate it again.
 *
 * The validator is one shared function, so adding it again (a second render
 * of the field, Strict Mode) does not stack it. It stays on the control after
 * the field unmounts, as it did in Angular.
 */
export function useInputNip<T>(props: SmartInputFieldProps<T>) {
  const input = useInput(props);
  const { control } = input;

  useEffect(() => {
    if (!control) return;

    control.addValidators(nipValidator);
    control.updateValueAndValidity();
  }, [control]);

  return input;
}
