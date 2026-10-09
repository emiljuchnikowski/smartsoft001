// #region usage
import { useState } from 'react';

import { SmartDateEditVariantProps, useDateEdit } from '@smartsoft001/react';

/**
 * A custom date editor built on `useDateEdit`.
 *
 * The hook owns the `YYYY-MM-DD` value (controlled or not), the per-digit
 * accessors (`d1`, `m1`, `y1`, ...) and the `validDate` flag, so a custom
 * implementation only renders the editor and decides how a new value reaches
 * the hook. This one swaps the eight digit boxes of the standard rendering for
 * one native picker.
 */
export function CustomDateEdit(props: SmartDateEditVariantProps) {
  const { value, setValue, validDate, setValidDate } = useDateEdit(props);

  const onPicked = (next: string) => {
    const valid = next !== '';

    setValidDate(valid);
    // setValue also reports the new value through onValueChange.
    setValue(next);
    props.onValidChange?.(valid);
  };

  return (
    <label
      className={['docs-date-edit', props.className].filter(Boolean).join(' ')}
    >
      <span className="docs-date-edit__label">Start date</span>
      <input
        className="docs-date-edit__input"
        type="date"
        value={value ?? ''}
        aria-invalid={!validDate}
        onChange={(event) => onPicked(event.target.value)}
      />
    </label>
  );
}

// SmartDateEdit has no SmartProvider registry key: its `variant` prop picks
// the standard or preset rendering, so a custom implementation is rendered
// directly in place of <SmartDateEdit>.
export function DateEditCustomExample() {
  const [date, setDate] = useState('2026-04-07');

  return (
    <>
      <CustomDateEdit value={date} onValueChange={setDate} />
      <p className="docs-date-edit__value">Selected: {date}</p>
    </>
  );
}
// #endregion
