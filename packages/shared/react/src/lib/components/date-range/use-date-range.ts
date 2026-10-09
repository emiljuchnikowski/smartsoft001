import moment from 'moment';
import { useCallback, useState } from 'react';

import { IDateRange } from '@smartsoft001/domain-core';

import {
  CalendarState,
  FilterBtnConstants,
  SmartDateRangeVariantProps,
} from './date-range.types';

type DateRangeValue = IDateRange | null | undefined;

const EMPTY_CALENDAR_DATA: CalendarState = {
  dateFrom: null,
  dateTo: null,
  scrollPosition: 0,
  selectedButtonName: FilterBtnConstants.empthyString,
};

function toDateString(date: moment.Moment): IDateRange['start'] {
  return date.format('YYYY-MM-DD') as IDateRange['start'];
}

/**
 * The range value: controlled while `value` is defined, otherwise kept here.
 * A new `value` from the parent always wins, so resetting the parent's state
 * to `undefined` also clears the range.
 */
function useControllableValue(
  value: DateRangeValue,
  defaultValue: DateRangeValue,
  onValueChange?: (value: IDateRange | undefined) => void,
) {
  const [innerValue, setInnerValue] = useState<DateRangeValue>(
    value === undefined ? defaultValue : value,
  );
  const [prevValue, setPrevValue] = useState<DateRangeValue>(value);

  if (prevValue !== value) {
    setPrevValue(value);
    setInnerValue(value);
  }

  const currentValue = value === undefined ? innerValue : value;

  const setValue = useCallback(
    (next: IDateRange | undefined) => {
      if (next === currentValue) return;

      setInnerValue(next);
      onValueChange?.(next);
    },
    [currentValue, onValueChange],
  );

  return [currentValue ?? undefined, setValue] as const;
}

/**
 * The behaviour every date-range variant shares: the range value, the open
 * state of the picker and the calendar state the picker is reopened with.
 */
export function useDateRange({
  value,
  defaultValue,
  onValueChange,
}: SmartDateRangeVariantProps) {
  const [currentValue, setValue] = useControllableValue(
    value,
    defaultValue,
    onValueChange,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [calendarData, setCalendarData] =
    useState<CalendarState>(EMPTY_CALENDAR_DATA);

  const onClick = useCallback(() => {
    setCalendarData((data) => ({
      ...data,
      ...(currentValue?.start ? { dateFrom: moment(currentValue.start) } : {}),
      ...(currentValue?.end ? { dateTo: moment(currentValue.end) } : {}),
    }));
    setIsOpen(true);
  }, [currentValue]);

  const onModalApply = useCallback(
    (data: CalendarState) => {
      setCalendarData(data);

      if (data.dateFrom) {
        setValue({
          start: toDateString(data.dateFrom),
          end: toDateString(data.dateTo ?? data.dateFrom),
        });
      }

      setIsOpen(false);
    },
    [setValue],
  );

  const onModalDismiss = useCallback(() => setIsOpen(false), []);

  const onClear = useCallback(() => {
    setCalendarData((data) => ({ ...data, dateFrom: null, dateTo: null }));
    setValue(undefined);
  }, [setValue]);

  return {
    value: currentValue,
    isOpen,
    calendarData,
    onClick,
    onModalApply,
    onModalDismiss,
    onClear,
  };
}
