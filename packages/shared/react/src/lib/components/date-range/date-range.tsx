import { useCallback } from 'react';

import { IDateRange } from '@smartsoft001/domain-core';

import { SmartDateRangeProps } from './date-range.types';
import { SmartDateRangePreset } from './preset/date-range-preset';
import { SmartDateRangeStandard } from './standard/date-range-standard';
import { SmartAbstractControl, useControlBinding } from '../../forms';

type SmartDateRangeBoundProps = Omit<SmartDateRangeProps, 'control'> & {
  control: SmartAbstractControl;
};

function SmartDateRangeVariant({
  variant = 'standard',
  ...props
}: Omit<SmartDateRangeProps, 'control'>) {
  switch (variant) {
    case 'standard':
      return <SmartDateRangeStandard {...props} />;
    case 'preset':
      return <SmartDateRangePreset {...props} />;
    default:
      return null;
  }
}

/**
 * The control binding of the Angular `ControlValueAccessor`: the control's
 * value is shown; a change sets the value and marks the control dirty and
 * touched.
 */
function SmartDateRangeBound({
  control,
  onValueChange,
  ...props
}: SmartDateRangeBoundProps) {
  const binding = useControlBinding(control);
  const { onChange, onBlur } = binding;

  const onInnerChange = useCallback(
    (value: IDateRange | undefined) => {
      onChange(value);
      onBlur();
      onValueChange?.(value);
    },
    [onChange, onBlur, onValueChange],
  );

  return (
    <SmartDateRangeVariant
      {...props}
      value={binding.value ?? null}
      onValueChange={onInnerChange}
    />
  );
}

/**
 * `<smart-date-range>`: the date-range picker in the `variant` rendering
 * (`standard`, a trigger opening a scrollable calendar modal, by default; or
 * `preset`, a calendar popover). Bind it with `value` + `onValueChange` (the
 * Angular `ngModel`), or pass a form `control` (the Angular `[formControl]`).
 */
export function SmartDateRange({ control, ...props }: SmartDateRangeProps) {
  if (control) return <SmartDateRangeBound {...props} control={control} />;

  return <SmartDateRangeVariant {...props} />;
}
