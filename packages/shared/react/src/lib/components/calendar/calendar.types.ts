import type { ReactNode } from 'react';

import {
  ICalendarDayCell,
  ICalendarEvent,
  ICalendarOptions,
} from '../../models';

/**
 * The context `dayCellTpl` renders with: the Angular template context
 * `{ $implicit: cell, events }`, `$implicit` named `cell`.
 */
export interface SmartCalendarDayCellContext {
  cell: ICalendarDayCell;
  /** The events starting on `cell.date` (`eventsForDay(cell.date)`). */
  events: ICalendarEvent[];
}

/**
 * `ICalendarOptions` with `dayCellTpl` as a render function: in Angular it was
 * a `TemplateRef` instantiated per day with {@link SmartCalendarDayCellContext}.
 * `toolbarActionsTpl` has no context, so it stays a `ReactNode`.
 * `eventListTpl`, `sidePanelTpl`, `eventTpl` and `monthsCount` are kept for
 * parity but, as in Angular, no variant renders them.
 */
export interface SmartCalendarOptions extends Omit<
  ICalendarOptions,
  'dayCellTpl'
> {
  dayCellTpl?: (context: SmartCalendarDayCellContext) => ReactNode;
}

export interface SmartCalendarProps {
  options?: SmartCalendarOptions;
  className?: string;
  /**
   * The selected day (the Angular `value` model). Controlled when defined
   * (`null` = nothing selected); leave it `undefined` to let the calendar
   * keep the selection itself, starting from `defaultValue`.
   */
  value?: Date | null;
  /** The initial selection of an uncontrolled calendar. */
  defaultValue?: Date | null;
  /** Called with the day the user selects (the `valueChange` of `[(value)]`). */
  onValueChange?: (value: Date | null) => void;
  /**
   * The day whose month is shown first; the calendar navigates from there and
   * jumps back to it whenever it changes. Today when omitted.
   */
  referenceDate?: Date;
  events?: ICalendarEvent[];
}
