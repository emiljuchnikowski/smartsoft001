import { useCallback, useId } from 'react';
import type { ChangeEvent } from 'react';

import { SmartAbstractControl } from '../../../forms/abstract-control';
import { useControlState } from '../../../forms/hooks';

/** The parts of the address group the form factory builds. */
export type SmartInputAddressPart =
  'city' | 'zipCode' | 'street' | 'buildingNumber' | 'flatNumber';

/**
 * Binds the input of one part of an address group to its control, as the
 * Angular `formControlName` did: the input shows the part's value, typing
 * sets it and marks it dirty, leaving the input marks it touched, and the
 * input is disabled with the part. `id` is for the input, so its label can
 * point at it.
 */
export function useInputAddressPart(
  group: SmartAbstractControl | null,
  name: SmartInputAddressPart,
) {
  const id = useId();
  const control = group?.get(name) ?? null;
  const state = useControlState(control);

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (!control) return;

      control.setValue(event.target.value);
      control.markAsDirty();
    },
    [control],
  );

  const onBlur = useCallback(() => control?.markAsTouched(), [control]);

  return {
    id,
    value: state?.value ?? '',
    disabled: state?.disabled ?? false,
    onChange,
    onBlur,
  };
}
