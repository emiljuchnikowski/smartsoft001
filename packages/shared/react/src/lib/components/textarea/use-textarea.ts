import { useCallback, useState } from 'react';

import { SmartTextareaProps } from './textarea.types';

/**
 * The behaviour every textarea variant shares (the Angular
 * `TextareaBaseComponent` and the handlers its variants repeat): the `value`,
 * controlled through `value` / `onValueChange` or kept internally from
 * `defaultValue`, and `actionClick()`, which reports an action with the
 * current text unless `disabled`.
 */
export function useTextarea({
  value: valueProp,
  defaultValue = '',
  onValueChange,
  disabled = false,
  onActionClick,
}: SmartTextareaProps) {
  const [innerValue, setInnerValue] = useState(defaultValue);
  const controlled = valueProp !== undefined;
  const value = controlled ? valueProp : innerValue;

  const setValue = useCallback(
    (next: string) => {
      if (!controlled) setInnerValue(next);
      onValueChange?.(next);
    },
    [controlled, onValueChange],
  );

  const actionClick = useCallback(
    (actionId: string) => {
      if (disabled) return;
      onActionClick?.({ actionId, value });
    },
    [disabled, onActionClick, value],
  );

  return { value, setValue, actionClick };
}
