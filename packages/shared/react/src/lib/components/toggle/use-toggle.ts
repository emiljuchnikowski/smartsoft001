import { useCallback, useState } from 'react';

import { SmartToggleProps } from './toggle.types';

/**
 * The behaviour every toggle variant shares: the `value`, controlled through
 * `value` / `onValueChange` or kept internally from `defaultValue`, and
 * `toggle()`, which flips it unless `disabled`.
 */
export function useToggle({
  value: valueProp,
  defaultValue = false,
  onValueChange,
  disabled = false,
}: SmartToggleProps) {
  const [innerValue, setInnerValue] = useState(defaultValue);
  const controlled = valueProp !== undefined;
  const value = controlled ? valueProp : innerValue;

  const setValue = useCallback(
    (next: boolean) => {
      if (!controlled) setInnerValue(next);
      onValueChange?.(next);
    },
    [controlled, onValueChange],
  );

  const toggle = useCallback(() => {
    if (disabled) return;
    setValue(!value);
  }, [disabled, value, setValue]);

  return { value, setValue, toggle };
}
