import { useId } from 'react';

import { useTranslate } from '@smartsoft001/react';

import { useCrudFilterDate } from '../date/use-crud-filter-date';
import { useCrudFilterValue } from '../date/use-crud-filter-value';
import { SmartCrudFilterProps } from '../filter.types';

/** One end of the range: a label, a `datetime-local` input and its clear. */
function DateTimeRangeRow({
  label,
  value,
  onValueChange,
  clearLabel,
  showClear,
  onClear,
}: {
  label: string;
  value: any;
  onValueChange: (value: any) => void;
  clearLabel: string;
  showClear: boolean;
  onClear: () => void;
}) {
  const t = useTranslate();
  const id = useId();
  const [shown, setShown] = useCrudFilterValue(value, onValueChange);

  return (
    <div className="smart:flex smart:w-full smart:items-end smart:gap-2">
      <label htmlFor={id} className="smart:text-sm">
        {t(label)}
      </label>
      <input
        id={id}
        type="datetime-local"
        className="smart:flex-1 smart:rounded smart:border smart:border-gray-300 smart:px-2 smart:py-1"
        value={shown}
        onChange={(e) => setShown(e.target.value)}
      />
      {showClear && (
        <button
          type="button"
          onClick={onClear}
          aria-label={clearLabel}
          className="smart:shrink-0 smart:rounded smart:px-2 smart:py-2 smart:text-red-600 smart:hover:bg-red-50"
        >
          ×
        </button>
      )}
    </div>
  );
}

/**
 * The date-time filter: the item label and a "from" / "to" pair of native
 * `datetime-local` inputs for the `>=` / `<=` values, each with its clear
 * button. A valid date-time is stored as its `YYYY-MM-DD` day.
 */
export function SmartCrudFilterDateTime(props: SmartCrudFilterProps) {
  const t = useTranslate();
  const {
    customMinValue,
    customMaxValue,
    setCustomMinValue,
    setCustomMaxValue,
    hasMinValue,
    hasMaxValue,
    refresh,
  } = useCrudFilterDate(props);

  return (
    <div className="smart:block smart:w-full">
      <label className="smart:mb-1 smart:block smart:text-sm smart:font-medium">
        {t(props.item?.label || '')}
      </label>
      <div className="smart:flex smart:w-full smart:flex-col smart:gap-2">
        <DateTimeRangeRow
          label="from"
          value={customMinValue || ''}
          onValueChange={setCustomMinValue}
          clearLabel="clear-from"
          showClear={hasMinValue}
          onClear={() => refresh(null, '>=')}
        />
        <DateTimeRangeRow
          label="to"
          value={customMaxValue || ''}
          onValueChange={setCustomMaxValue}
          clearLabel="clear-to"
          showClear={hasMaxValue}
          onClear={() => refresh(null, '<=')}
        />
      </div>
    </div>
  );
}
