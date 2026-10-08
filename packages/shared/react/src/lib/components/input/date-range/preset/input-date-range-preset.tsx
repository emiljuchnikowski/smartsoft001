import { useId } from 'react';

import { cn } from '../../../../utils/class-names';
import { useInput } from '../../base/use-input';
import { SmartInputFieldProps } from '../../input.types';

interface DateRangeValue {
  start?: string;
  end?: string;
}

const LABEL_CLASSES = [
  'smart:block',
  'smart:mb-2',
  'smart:text-sm',
  'smart:font-medium',
  'smart:text-gray-900',
  'smart:dark:text-white',
].join(' ');

const WRAPPER_CLASSES = ['smart:flex', 'smart:items-center', 'smart:gap-x-2'];

const SEPARATOR_CLASSES = [
  'smart:text-gray-500',
  'smart:dark:text-gray-400',
].join(' ');

const INPUT_CLASSES = [
  // Preline: py-3 px-4 block w-full
  'smart:py-3',
  'smart:px-4',
  'smart:block',
  'smart:w-full',
  // Preline: bg-layer
  'smart:bg-white',
  'smart:dark:bg-gray-800',
  // Preline: border-layer-line
  'smart:border',
  'smart:border-gray-200',
  'smart:dark:border-gray-700',
  // Preline: rounded-lg sm:text-sm
  'smart:rounded-lg',
  'smart:sm:text-sm',
  // Preline: text-foreground
  'smart:text-gray-900',
  'smart:dark:text-white',
  // Preline: placeholder:text-muted-foreground-1
  'smart:placeholder:text-gray-500',
  'smart:dark:placeholder:text-gray-400',
  // Preline: focus:border-primary-focus focus:ring-primary-focus
  'smart:focus:border-blue-700',
  'smart:dark:focus:border-blue-600',
  'smart:focus:ring-1',
  'smart:focus:ring-blue-700',
  'smart:dark:focus:ring-blue-600',
  // Preline: disabled:opacity-50 disabled:pointer-events-none
  'smart:disabled:opacity-50',
  'smart:disabled:pointer-events-none',
].join(' ');

/** The `{ start, end }` the inputs show; anything else is an empty range. */
function normalize(value: unknown): DateRangeValue {
  if (value && typeof value === 'object') {
    const { start, end } = value as DateRangeValue;
    return { start: start ?? '', end: end ?? '' };
  }

  return { start: '', end: '' };
}

/** A range with neither end is no value at all. */
function toControlValue(value: DateRangeValue): DateRangeValue | null {
  if (!value.start && !value.end) return null;

  return value;
}

/**
 * Styled `dateRange` field (preset): the Preline label and two native
 * `type="date"` inputs (start – end). Register it as
 * `inputFieldComponents[FieldType.dateRange]` on `SmartProvider`.
 *
 * The control value stays the `IDateRange` shape (`{ start, end }`,
 * `YYYY-MM-DD`): a changed input sets it and marks the control dirty, and
 * clearing both ends sets `null`; leaving either input marks the control
 * touched. `className` is appended to the classes of the inputs' row. The
 * Preline range datepicker (Vanilla Calendar Pro and the Preline JS plugin) is
 * not used, and the inputs are not bound to the control's disabled state.
 */
export function SmartInputDateRangePreset<T>(props: SmartInputFieldProps<T>) {
  const { className } = props;
  const {
    control,
    value,
    required,
    label,
    setValue,
    markAsTouched,
    autoFocus,
  } = useInput(props);
  const id = useId();

  if (!control) return null;

  const range = normalize(value);
  const commit = (next: DateRangeValue) => setValue(toControlValue(next));

  return (
    <>
      <label htmlFor={id} className={LABEL_CLASSES}>
        {label}{' '}
        {required && <span className="smart:text-red-500 smart:ml-0.5">*</span>}
      </label>
      <div className={cn(WRAPPER_CLASSES, className)}>
        <input
          id={id}
          type="date"
          data-role="date-range-start"
          className={INPUT_CLASSES}
          value={range.start ?? ''}
          autoFocus={autoFocus}
          onChange={(e) => commit({ ...range, start: e.target.value })}
          onBlur={markAsTouched}
        />
        <span className={SEPARATOR_CLASSES}>&ndash;</span>
        <input
          type="date"
          data-role="date-range-end"
          className={INPUT_CLASSES}
          value={range.end ?? ''}
          onChange={(e) => commit({ ...range, end: e.target.value })}
          onBlur={markAsTouched}
        />
      </div>
    </>
  );
}
