import moment from 'moment';
import { useCallback, useState } from 'react';
import type { KeyboardEvent } from 'react';

import { SmartDateEditVariantProps } from './date-edit.types';

export const DATE_EDIT_DEFAULT_DATE = '2001-01-01';

type DateEditValue = string | null | undefined;

function setCharAt(str: string, index: number, chr: string | number): string {
  if (index > str.length - 1) return str;

  return str.substring(0, index) + chr + str.substring(index + 1);
}

/**
 * The date value: controlled while `value` is defined, otherwise kept here.
 * A new `value` from the parent always wins, so resetting the parent's state
 * to `undefined` also clears the date.
 */
function useControllableValue(
  value: DateEditValue,
  defaultValue: DateEditValue,
  onValueChange?: (value: string) => void,
) {
  const [innerValue, setInnerValue] = useState<DateEditValue>(
    value === undefined ? defaultValue : value,
  );
  const [prevValue, setPrevValue] = useState<DateEditValue>(value);

  if (prevValue !== value) {
    setPrevValue(value);
    setInnerValue(value);
  }

  const currentValue = value === undefined ? innerValue : value;

  const setValue = useCallback(
    (next: string) => {
      if (next === currentValue) return;

      setInnerValue(next);
      onValueChange?.(next);
    },
    [currentValue, onValueChange],
  );

  return [currentValue ?? null, setValue] as const;
}

const DIGIT_KEYS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

/**
 * Trims `el` to one character and selects it, after the current event, so
 * the next key replaces the digit. Number inputs do not support a selection
 * range in every browser; the error they throw is swallowed.
 */
function select(el: HTMLInputElement | null): void {
  setTimeout(() => {
    if (!el) return;

    el.value = el.value.substring(0, 1);

    try {
      el.setSelectionRange(0, el.value.length);
    } catch {
      // `type="number"` inputs throw InvalidStateError here.
    }
  });
}

/**
 * The keyup of a digit input: a digit trims the input and moves to `el`;
 * Backspace and Enter are left alone; any other key writes `0`.
 */
function moveTo(
  event: KeyboardEvent<HTMLInputElement>,
  el: HTMLInputElement | null,
): void {
  if (event.key === 'Backspace' || event.key === 'Enter') return;

  const target = event.currentTarget;

  if (!DIGIT_KEYS.some((key) => key === event.key)) {
    target.value = '0';
    return;
  }

  target.value = target.value.substring(0, 1);

  el?.focus();
  select(el);
}

/**
 * The behaviour every date-edit variant shares: the `YYYY-MM-DD` value, its
 * single digits and the validity of the edited date.
 */
export function useDateEdit({
  value,
  defaultValue = DATE_EDIT_DEFAULT_DATE,
  onValueChange,
  onValidChange,
}: SmartDateEditVariantProps) {
  const [currentValue, setValue] = useControllableValue(
    value,
    defaultValue,
    onValueChange,
  );
  const [validDate, setValidDate] = useState(true);

  const digitAt = (index: number): string | null =>
    currentValue ? currentValue[index] : null;

  /**
   * Replaces the digit at `index` with the first digit of `val` (`null`, an
   * emptied input, is ignored). An empty model starts from 2001-01-01.
   */
  const setValueAt = useCallback(
    (val: string | number | null, index: number) => {
      if (val === null) return;

      const digit = Number(val.toString().substring(0, 1));
      let next = currentValue;

      if (!next || digit > 9 || digit < 0) next = DATE_EDIT_DEFAULT_DATE;
      next = setCharAt(next, index, digit);

      const valid = moment(next).isValid();

      setValidDate(valid);
      setValue(next);
      onValidChange?.(valid);
    },
    [currentValue, setValue, onValidChange],
  );

  return {
    value: currentValue,
    setValue,
    validDate,
    setValidDate,
    setValueAt,
    moveTo,
    select,
    d1: digitAt(8),
    d2: digitAt(9),
    m1: digitAt(5),
    m2: digitAt(6),
    y1: digitAt(0),
    y2: digitAt(1),
    y3: digitAt(2),
    y4: digitAt(3),
  };
}
