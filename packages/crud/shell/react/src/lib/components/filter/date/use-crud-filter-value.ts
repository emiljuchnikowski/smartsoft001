import { useCallback, useState } from 'react';

/**
 * The value a date filter's editor shows: what the user entered (the filter
 * is read 500 ms later) until `value` changes, and then `value`. Every entry
 * is passed on to `onValueChange`.
 */
export function useCrudFilterValue<T>(
  value: T,
  onValueChange: (value: T) => void,
): [T, (value: T) => void] {
  const [view, setView] = useState(value);
  const [prevValue, setPrevValue] = useState(value);
  let current = view;

  if (!Object.is(prevValue, value)) {
    setPrevValue(value);
    setView(value);
    current = value;
  }

  const onViewChange = useCallback(
    (next: T) => {
      setView(next);
      onValueChange(next);
    },
    [onValueChange],
  );

  return [current, onViewChange];
}
