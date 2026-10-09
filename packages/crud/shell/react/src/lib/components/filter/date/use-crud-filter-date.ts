import moment from 'moment';
import { useCallback } from 'react';

import { UseCrudFilterResult, useCrudFilter } from '../base/use-crud-filter';
import { SmartCrudFilterProps } from '../filter.types';

/**
 * A date the user entered as the filter stores it: a valid date of at least
 * ten characters (e.g. a `datetime-local` value) as `YYYY-MM-DD`, anything
 * else as it is.
 */
function toFilterDate(val: any): any {
  return val?.length >= 10 && moment(val).isValid()
    ? moment(val).format('YYYY-MM-DD')
    : val;
}

/** What `useCrudFilterDate` returns. */
export interface UseCrudFilterDateResult extends UseCrudFilterResult {
  /** The advanced from / to range is offered for an `=` item. */
  allowAdvanced: boolean;
  customValue: any;
  customMinValue: any;
  customMaxValue: any;
  /** Sets the value as a `YYYY-MM-DD` date (debounced). */
  setCustomValue: (val: any) => void;
  /** Sets the `>=` value as a `YYYY-MM-DD` date (debounced). */
  setCustomMinValue: (val: any) => void;
  /** Sets the `<=` value as a `YYYY-MM-DD` date (debounced). */
  setCustomMaxValue: (val: any) => void;
}

/**
 * What the date, date-time and date-with-edit filters share: `useCrudFilter`
 * with the `customValue` / `customMinValue` / `customMaxValue` accessors,
 * whose setters store a valid date as `YYYY-MM-DD`.
 */
export function useCrudFilterDate(
  props: SmartCrudFilterProps,
): UseCrudFilterDateResult {
  const filter = useCrudFilter(props);
  const { setValue, setMinValue, setMaxValue } = filter;

  const setCustomValue = useCallback(
    (val: any) => setValue(toFilterDate(val)),
    [setValue],
  );
  const setCustomMinValue = useCallback(
    (val: any) => setMinValue(toFilterDate(val)),
    [setMinValue],
  );
  const setCustomMaxValue = useCallback(
    (val: any) => setMaxValue(toFilterDate(val)),
    [setMaxValue],
  );

  return {
    ...filter,
    allowAdvanced: props.item?.type === '=',
    customValue: filter.value,
    customMinValue: filter.minValue,
    customMaxValue: filter.maxValue,
    setCustomValue,
    setCustomMinValue,
    setCustomMaxValue,
  };
}
