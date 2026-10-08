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
 * The Angular `ngModel` model: controlled while `value` is defined, otherwise
 * kept here. A new `value` from the parent always wins, as a `model()` input
 * does, so resetting the parent's state to `undefined` also clears the range.
 */
function useNgModel(
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

  const ngModel = value === undefined ? innerValue : value;

  const setNgModel = useCallback(
    (next: IDateRange | undefined) => {
      if (next === ngModel) return;

      setInnerValue(next);
      onValueChange?.(next);
    },
    [ngModel, onValueChange],
  );

  return [ngModel ?? undefined, setNgModel] as const;
}

/**
 * The behaviour every date-range variant shares (the Angular
 * `DateRangeBaseComponent`): the range model, the open state of the picker
 * and the calendar state the picker is reopened with.
 */
export function useDateRange({
  value,
  defaultValue,
  onValueChange,
}: SmartDateRangeVariantProps) {
  const [ngModel, setNgModel] = useNgModel(value, defaultValue, onValueChange);
  const [isOpen, setIsOpen] = useState(false);
  const [calendarData, setCalendarData] =
    useState<CalendarState>(EMPTY_CALENDAR_DATA);

  const onClick = useCallback(() => {
    setCalendarData((data) => ({
      ...data,
      ...(ngModel?.start ? { dateFrom: moment(ngModel.start) } : {}),
      ...(ngModel?.end ? { dateTo: moment(ngModel.end) } : {}),
    }));
    setIsOpen(true);
  }, [ngModel]);

  const onModalApply = useCallback(
    (data: CalendarState) => {
      setCalendarData(data);

      if (data.dateFrom) {
        setNgModel({
          start: toDateString(data.dateFrom),
          end: toDateString(data.dateTo ?? data.dateFrom),
        });
      }

      setIsOpen(false);
    },
    [setNgModel],
  );

  const onModalDismiss = useCallback(() => setIsOpen(false), []);

  const onClear = useCallback(() => {
    setCalendarData((data) => ({ ...data, dateFrom: null, dateTo: null }));
    setNgModel(undefined);
  }, [setNgModel]);

  return {
    value: ngModel,
    isOpen,
    calendarData,
    onClick,
    onModalApply,
    onModalDismiss,
    onClear,
  };
}
