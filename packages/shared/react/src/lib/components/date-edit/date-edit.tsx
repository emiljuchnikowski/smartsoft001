import { useCallback } from 'react';

import { SmartDateEditProps } from './date-edit.types';
import { SmartDateEditPreset } from './preset/date-edit-preset';
import { SmartDateEditStandard } from './standard/date-edit-standard';
import { SmartAbstractControl, useControlBinding } from '../../forms';

type SmartDateEditBoundProps = Omit<SmartDateEditProps, 'control'> & {
  control: SmartAbstractControl;
};

function SmartDateEditVariant({
  variant = 'standard',
  ...props
}: Omit<SmartDateEditProps, 'control'>) {
  switch (variant) {
    case 'standard':
      return <SmartDateEditStandard {...props} />;
    case 'preset':
      return <SmartDateEditPreset {...props} />;
    default:
      return null;
  }
}

/**
 * The control binding of the Angular `ControlValueAccessor`: the control's
 * value is shown; an edit (even an invalid date, as the Angular wrapper
 * forwarded it) sets the value and marks the control dirty and touched.
 */
function SmartDateEditBound({
  control,
  onValueChange,
  ...props
}: SmartDateEditBoundProps) {
  const binding = useControlBinding(control);
  const { onChange, onBlur } = binding;

  const onInnerChange = useCallback(
    (value: string) => {
      onChange(value);
      onBlur();
      onValueChange?.(value);
    },
    [onChange, onBlur, onValueChange],
  );

  return (
    <SmartDateEditVariant
      {...props}
      value={binding.value ?? null}
      onValueChange={onInnerChange}
    />
  );
}

/**
 * `<smart-date-edit>`: the date editor in the `variant` rendering
 * (`standard`, eight digit inputs, by default; or `preset`, a calendar
 * popover). Bind it with `value` + `onValueChange` (the Angular `ngModel`), or
 * pass a form `control` (the Angular `[formControl]`).
 */
export function SmartDateEdit({ control, ...props }: SmartDateEditProps) {
  if (control) return <SmartDateEditBound {...props} control={control} />;

  return <SmartDateEditVariant {...props} />;
}
