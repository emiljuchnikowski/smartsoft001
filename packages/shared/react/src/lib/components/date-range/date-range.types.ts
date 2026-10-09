import type moment from 'moment';

import { IDateRange } from '@smartsoft001/domain-core';

import { SmartAbstractControl } from '../../forms';

export type DateRangeVariantName = 'standard' | 'preset';

/** The quick-pick buttons of the date-range modal. */
export enum FilterBtnConstants {
  empthyString = '',
  today = 'Today',
  yesterday = 'Yesterday',
  lastSevenDays = 'LastSevenDays',
  lastThirtyDays = 'LastThirtyDays',
  thisMonth = 'ThisMonth',
  lastMonth = 'LastMonth',
}

/** What the date-range modal applies, and is reopened with. */
export interface CalendarState {
  dateFrom: moment.Moment | null;
  dateTo: moment.Moment | null;
  scrollPosition: number;
  selectedButtonName: FilterBtnConstants;
}

/**
 * Props of the date-range variants: the range as a controlled `value` +
 * `onValueChange` pair, or kept internally from `defaultValue`.
 */
export interface SmartDateRangeVariantProps {
  /**
   * The range. `undefined` leaves the component uncontrolled, starting from
   * `defaultValue`; `null` is an empty controlled value.
   */
  value?: IDateRange | null;
  /** The initial range when uncontrolled. */
  defaultValue?: IDateRange | null;
  /**
   * Emits the applied range, or `undefined` once cleared.
   */
  onValueChange?: (value: IDateRange | undefined) => void;
  className?: string;
}

/** Props of `<SmartDateRange>`. */
export interface SmartDateRangeProps extends SmartDateRangeVariantProps {
  variant?: DateRangeVariantName;
  /**
   * Binds the range to a form control: the control's value is shown, a change
   * sets it and marks the control dirty and touched.
   */
  control?: SmartAbstractControl;
}

/** Props of the date-range modal (`SmartDateRangeModalStandard`). */
export interface SmartDateRangeModalProps {
  /** Shows the quick-pick buttons (today, last 7 days, ...). */
  showFilterBtns?: boolean;
  /** When set, only a range of exactly this many days can be applied. */
  restrictSelectionTo?: number;
  /** The state the modal opens with; without `dateFrom` it selects today. */
  previousState?: CalendarState;
  onApply?: (state: CalendarState) => void;
  onDismiss?: () => void;
}
