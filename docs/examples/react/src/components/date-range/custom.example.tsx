// #region usage
import { useState } from 'react';

import { IDateRange } from '@smartsoft001/domain-core';
import { SmartDateRangeVariantProps, useDateRange } from '@smartsoft001/react';

/**
 * A custom range picker built on `useDateRange`.
 *
 * The hook owns the range (controlled or not), the open state (`isOpen`,
 * `onClick`, `onModalDismiss`) and the reset (`onClear`). Here the calendar
 * modal is replaced with a short list of preset ranges.
 */
export function CustomDateRange(props: SmartDateRangeVariantProps) {
  const { value, isOpen, onClick, onModalDismiss, onClear } =
    useDateRange(props);

  // The hook's onModalApply() takes the CalendarState (moment objects) of the
  // built-in calendar. A picker without that calendar reports the range
  // through onValueChange and closes; the parent's `value` brings it back in.
  const apply = (range: IDateRange) => {
    props.onValueChange?.(range);
    onModalDismiss();
  };

  return (
    <div
      className={['docs-date-range', props.className].filter(Boolean).join(' ')}
    >
      <button
        type="button"
        className="docs-date-range__trigger"
        onClick={onClick}
      >
        {value ? `${value.start} - ${value.end}` : 'Pick a range'}
      </button>

      {value && (
        <button
          type="button"
          className="docs-date-range__clear"
          onClick={onClear}
        >
          Clear
        </button>
      )}

      {isOpen && (
        <ul className="docs-date-range__panel">
          <li>
            <button
              type="button"
              onClick={() => apply({ start: '2026-04-01', end: '2026-04-07' })}
            >
              First week of April
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => apply({ start: '2026-04-01', end: '2026-04-30' })}
            >
              Whole of April
            </button>
          </li>
          <li>
            <button type="button" onClick={onModalDismiss}>
              Cancel
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}

// SmartDateRange has no SmartProvider registry key: its `variant` prop picks
// the standard or preset rendering, so a custom implementation is rendered
// directly in place of <SmartDateRange>.
export function DateRangeCustomExample() {
  const [range, setRange] = useState<IDateRange | null>({
    start: '2026-04-01',
    end: '2026-04-07',
  });

  return (
    <CustomDateRange
      value={range}
      onValueChange={(next) => setRange(next ?? null)}
    />
  );
}
// #endregion
