import moment from 'moment';
import { useEffect, useRef, useState } from 'react';

import {
  CalendarState,
  FilterBtnConstants,
  SmartDateRangeModalProps,
} from './date-range.types';
import { useStyleService } from '../../providers/hooks';
import { CalendarService } from '../../services/calendar/calendar.service';
import { StyleService } from '../../services/style/style.service';

/** The Angular modal's `dateForm`: the shown dates and the picked days. */
export interface DateRangeModalForm {
  dateFrom: string | null;
  dateTo: string | null;
  startDateRef: moment.Moment | null;
  endDateRef: moment.Moment | null;
}

const EMPTY_STATE: CalendarState = {
  dateFrom: null,
  dateTo: null,
  scrollPosition: 0,
  selectedButtonName: FilterBtnConstants.empthyString,
};

const EMPTY_FORM: DateRangeModalForm = {
  dateFrom: null,
  dateTo: null,
  startDateRef: null,
  endDateRef: null,
};

function formatDate(date: moment.Moment): string {
  return date.format('YYYY-MM-DD');
}

function setStartDate(
  form: DateRangeModalForm,
  date: moment.Moment,
): DateRangeModalForm {
  const formattedDate = formatDate(date);

  return {
    ...form,
    dateFrom: formattedDate,
    dateTo: formattedDate,
    startDateRef: date,
  };
}

function setEndDate(
  form: DateRangeModalForm,
  date: moment.Moment,
): DateRangeModalForm {
  return { ...form, dateTo: formatDate(date), endDateRef: date };
}

function resetDates(form: DateRangeModalForm): DateRangeModalForm {
  return { ...form, startDateRef: null, endDateRef: null };
}

/**
 * A click on `date` (the Angular `subject$` subscriber): once both ends are
 * set it starts over; a day after the start ends the range, any other day
 * becomes the new start.
 */
function pickDate(
  form: DateRangeModalForm,
  date: moment.Moment,
): DateRangeModalForm {
  let next = form;

  const areBothDatesSelected = !!next.startDateRef && !!next.endDateRef;
  if (areBothDatesSelected) next = resetDates(next);

  const { startDateRef } = next;
  if (!startDateRef) next = setStartDate(next, date);

  const isFutureDate = date.isAfter(startDateRef);
  next = isFutureDate ? setEndDate(next, date) : setStartDate(next, date);

  return next;
}

function selectRange(
  start: moment.Moment,
  end: moment.Moment,
): DateRangeModalForm {
  return setEndDate(setStartDate(EMPTY_FORM, start), end);
}

interface DateRangeModalSelection {
  form: DateRangeModalForm;
  selectedButtonName: FilterBtnConstants;
}

function getInitialSelection(state: CalendarState): DateRangeModalSelection {
  const { dateFrom, dateTo, selectedButtonName } = state;

  if (dateFrom) {
    return {
      form: {
        dateFrom: formatDate(dateFrom),
        dateTo: dateTo ? formatDate(dateTo) : null,
        startDateRef: dateFrom,
        endDateRef: dateTo,
      },
      selectedButtonName,
    };
  }

  const today = moment().clone();

  return {
    form: selectRange(today, today),
    selectedButtonName: FilterBtnConstants.today,
  };
}

/**
 * The behaviour of the date-range modal (the Angular
 * `DateRangeModalBaseComponent`): the scrollable calendar of the
 * `CalendarService`, the picked range and the quick-pick buttons.
 */
export function useDateRangeModal({
  restrictSelectionTo = 0,
  previousState = EMPTY_STATE,
  onApply,
  onDismiss,
}: SmartDateRangeModalProps) {
  const styleService = useStyleService();
  const elementRef = useRef<HTMLDivElement>(null);
  const [calendar] = useState(() => new CalendarService().getCalendar());
  const [initial] = useState(() => getInitialSelection(previousState));
  const [scrollPositionValue] = useState(() =>
    previousState.dateFrom ? previousState.scrollPosition : 0,
  );
  const [dateForm, setDateForm] = useState(initial.form);
  const [selectedButtonName, setSelectedButtonName] = useState(
    initial.selectedButtonName,
  );
  // The last picked day: a second click on it is ignored
  // (`distinctUntilChanged` in Angular).
  const lastPickedRef = useRef<moment.Moment | null>(null);

  // Angular called `styleService.init(this.elementRef)`, writing the
  // application's style variables on the modal. A local service does the same
  // without redirecting the shared one to this short-lived element.
  useEffect(() => {
    new StyleService().init(elementRef.current, styleService.get());
  }, [styleService]);

  const onDayClick = (date: moment.Moment | null) => {
    if (!date) return;
    if (lastPickedRef.current?.isSame(date, 'day')) return;

    lastPickedRef.current = date;
    setSelectedButtonName(FilterBtnConstants.empthyString);
    setDateForm((form) => pickDate(form, date));
    // Angular then asked `UIService.showAlertWithDismissCallback` to warn
    // about a range breaking `restrictSelectionTo`; that method is a no-op
    // (its body is commented out), so the picked range simply stays and the
    // select button stays disabled.
  };

  const selectFilter = (
    name: FilterBtnConstants,
    start: moment.Moment,
    end: moment.Moment,
  ) => {
    setSelectedButtonName(name);
    setDateForm(selectRange(start, end));
  };

  const filterSelectionByDaysAgo = (
    name: FilterBtnConstants,
    daysAgo: number,
  ) => {
    const endDate = moment().clone();
    const startDate = endDate.clone().subtract(daysAgo, 'days');
    selectFilter(name, startDate, endDate);
  };

  const selectToday = () => {
    const today = moment().clone();
    selectFilter(FilterBtnConstants.today, today, today);
  };

  const selectYesterday = () => {
    const yesterday = moment().clone().subtract(1, 'days');
    selectFilter(FilterBtnConstants.yesterday, yesterday, yesterday);
  };

  const selectLastSevenDays = () =>
    filterSelectionByDaysAgo(FilterBtnConstants.lastSevenDays, 6);

  const selectLastThirtyDays = () =>
    filterSelectionByDaysAgo(FilterBtnConstants.lastThirtyDays, 29);

  const selectThisMonth = () => {
    const firstDay = moment().clone().startOf('month');
    const lastDay = moment().clone();
    selectFilter(FilterBtnConstants.thisMonth, firstDay, lastDay);
  };

  const selectLastMonth = () => {
    const lastMonth = moment().clone().subtract(1, 'month');
    const firstDay = lastMonth.clone().startOf('month');
    const lastDay = lastMonth.clone().endOf('month');
    selectFilter(FilterBtnConstants.lastMonth, firstDay, lastDay);
  };

  const isSelectionInRestrictedRange = (): boolean => {
    const { startDateRef, endDateRef } = dateForm;
    const diff = endDateRef && endDateRef.diff(startDateRef, 'days') + 1;

    return !!diff && diff === restrictSelectionTo;
  };

  const isInRange = (day: moment.Moment | null): boolean => {
    if (!day) return false;

    const { startDateRef, endDateRef } = dateForm;

    return day.isBetween(startDateRef, endDateRef, 'day');
  };

  const isSelectionStart = (day: moment.Moment | null): boolean => {
    if (!day) return false;

    return day.isSame(dateForm.startDateRef, 'day');
  };

  const isSelectionEnd = (day: moment.Moment | null): boolean => {
    if (!day) return false;

    const { startDateRef, endDateRef } = dateForm;

    return (
      day.isSame(endDateRef, 'day') &&
      !!endDateRef?.isAfter(startDateRef, 'day')
    );
  };

  const isStartAndEndDateSame = (): boolean =>
    dateForm.dateFrom === dateForm.dateTo;

  const dismissPage = () => onDismiss?.();

  const applyDates = () => {
    const { startDateRef, endDateRef } = dateForm;

    onApply?.({
      dateFrom: startDateRef,
      dateTo: endDateRef ? endDateRef : startDateRef,
      scrollPosition: scrollPositionValue,
      selectedButtonName,
    });
  };

  return {
    elementRef,
    calendar,
    dateForm,
    selectedButtonName,
    onDayClick,
    isInRange,
    isSelectionStart,
    isSelectionEnd,
    isStartAndEndDateSame,
    isSelectionInRestrictedRange,
    selectToday,
    selectYesterday,
    selectLastSevenDays,
    selectLastThirtyDays,
    selectThisMonth,
    selectLastMonth,
    dismissPage,
    applyDates,
  };
}
