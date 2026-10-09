import { useCallback, useState } from 'react';

import { SmartButtonGroupProps } from './button-group.types';

/**
 * The behaviour every button group variant shares: the selected button id,
 * controlled through `selected` / `onSelectedChange` or kept internally, and
 * `select(id)`, which selects a button and emits `onButtonClick`.
 */
export function useButtonGroup({
  selected: controlledSelected,
  defaultSelected,
  onSelectedChange,
  onButtonClick,
}: SmartButtonGroupProps) {
  const [internalSelected, setInternalSelected] = useState(defaultSelected);
  const isControlled = controlledSelected !== undefined;
  const selected = isControlled ? controlledSelected : internalSelected;

  const select = useCallback(
    (id: string) => {
      if (!isControlled) setInternalSelected(id);

      onSelectedChange?.(id);
      onButtonClick?.({ buttonId: id });
    },
    [isControlled, onSelectedChange, onButtonClick],
  );

  return { selected, select };
}
