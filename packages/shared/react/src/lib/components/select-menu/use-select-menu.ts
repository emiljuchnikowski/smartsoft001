import { useCallback, useState } from 'react';

import { SelectMenuValue, SmartSelectMenuProps } from './select-menu.types';

/**
 * The behaviour every select menu variant shares: the `value`, controlled
 * through `value` / `onValueChange` or kept internally from `defaultValue`, and
 * `select()`, which ignores the choice while `disabled`.
 */
export function useSelectMenu({
  value: valueProp,
  defaultValue = null,
  onValueChange,
  disabled = false,
}: SmartSelectMenuProps) {
  const [innerValue, setInnerValue] = useState<SelectMenuValue>(defaultValue);
  const controlled = valueProp !== undefined;
  const value = controlled ? valueProp : innerValue;

  const select = useCallback(
    (next: SelectMenuValue) => {
      if (disabled) return;
      if (!controlled) setInnerValue(next);
      onValueChange?.(next);
    },
    [disabled, controlled, onValueChange],
  );

  return { value, select };
}
