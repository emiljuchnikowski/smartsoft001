import { useState } from 'react';

import { useInput } from '../base/use-input';
import { SmartInputFieldProps } from '../input.types';

/**
 * The colour logic shared by `SmartInputColor` and `SmartInputColorPreset`: the
 * shown colour is read from the control when the control is set, then follows
 * the picker. Picking or clearing marks the control dirty and touched; clearing
 * sets `null`.
 */
export function useInputColor<T>(props: SmartInputFieldProps<T>) {
  const input = useInput(props);
  const { control } = input;
  const [color, setColor] = useState<string | null>(control?.value ?? null);
  const [colorControl, setColorControl] = useState(control);

  // A new control resets the colour.
  if (colorControl !== control) {
    setColorControl(control);
    setColor(control?.value ?? null);
  }

  const selectColor = (value: string) => {
    if (!control) return;

    control.markAsDirty();
    control.markAllAsTouched();
    control.setValue(value);
    setColor(value);
  };

  const clear = () => {
    if (!control) return;

    setColor('');
    control.markAsDirty();
    control.markAllAsTouched();
    control.setValue(null);
  };

  return { ...input, color, selectColor, clear };
}
