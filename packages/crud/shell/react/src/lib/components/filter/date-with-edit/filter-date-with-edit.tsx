import { useState } from 'react';

import { SmartDateEdit, useTranslate } from '@smartsoft001/react';

import { useCrudFilterDate } from '../date/use-crud-filter-date';
import { useCrudFilterValue } from '../date/use-crud-filter-value';
import { SmartCrudFilterProps } from '../filter.types';

const CLEAR_CLASSES =
  'smart:shrink-0 smart:rounded smart:px-2 smart:py-2 smart:text-red-600 smart:hover:bg-red-50';

/**
 * The shared date editor showing what the user entered until `value`
 * changes.
 */
function BoundDateEdit({
  value,
  onValueChange,
}: {
  value: any;
  onValueChange: (value: any) => void;
}) {
  const [shown, setShown] = useCrudFilterValue(value, onValueChange);

  return (
    <div className="smart:flex-1">
      <SmartDateEdit
        className="smart:flex-1"
        value={shown}
        onValueChange={setShown}
      />
    </div>
  );
}

/** One end of the advanced range: a label, a date editor and its clear. */
function DateRangeRow({
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

  return (
    <div className="smart:flex smart:w-full smart:items-end smart:gap-2">
      <label className="smart:text-sm">{t(label)}</label>
      <BoundDateEdit value={value} onValueChange={onValueChange} />
      {showClear && (
        <button
          type="button"
          onClick={onClear}
          aria-label={clearLabel}
          className={CLEAR_CLASSES}
        >
          ×
        </button>
      )}
    </div>
  );
}

/**
 * The date filter with a range editor: the item label and the shared date
 * editor for the item's value; for an `=` item an "advanced" button switches
 * to a "from" / "to" pair of editors for the `>=` / `<=` values (removing the
 * value), shown as well while a range value is set.
 */
export function SmartCrudFilterDateWithEdit(props: SmartCrudFilterProps) {
  const t = useTranslate();
  const {
    allowAdvanced,
    customValue,
    customMinValue,
    customMaxValue,
    setCustomValue,
    setCustomMinValue,
    setCustomMaxValue,
    hasValue,
    hasMinValue,
    hasMaxValue,
    setValue,
    refresh,
  } = useCrudFilterDate(props);
  const [advanced, setAdvanced] = useState(false);

  const toggleAdvanced = () => {
    const next = !advanced;

    setAdvanced(next);
    if (next) setValue(null);
  };

  return (
    <div className="smart:block smart:w-full">
      <label className="smart:mb-1 smart:block smart:text-sm smart:font-medium">
        {t(props.item?.label || '')}
      </label>

      {!advanced ? (
        <div className="smart:flex smart:w-full smart:items-end smart:gap-2">
          <BoundDateEdit
            value={customValue || ''}
            onValueChange={setCustomValue}
          />
          {allowAdvanced && (
            <button
              type="button"
              onClick={toggleAdvanced}
              aria-label="advanced"
              className="smart:shrink-0 smart:rounded smart:px-2 smart:py-2 smart:hover:bg-gray-100"
            >
              ⚙
            </button>
          )}
          {hasValue && (
            <button
              type="button"
              onClick={() => refresh(null)}
              aria-label="clear"
              className={CLEAR_CLASSES}
            >
              ×
            </button>
          )}
        </div>
      ) : (
        allowAdvanced && (
          <button
            type="button"
            onClick={toggleAdvanced}
            aria-label="advanced"
            className="smart:mb-2 smart:rounded smart:px-2 smart:py-2 smart:hover:bg-gray-100"
          >
            ⚙
          </button>
        )
      )}

      {(advanced || hasMinValue || hasMaxValue) && allowAdvanced && (
        <div className="smart:flex smart:w-full smart:flex-col smart:gap-2">
          <DateRangeRow
            label="from"
            value={customMinValue || ''}
            onValueChange={setCustomMinValue}
            clearLabel="clear-from"
            showClear={hasMinValue}
            onClear={() => refresh(null, '>=')}
          />
          <DateRangeRow
            label="to"
            value={customMaxValue || ''}
            onValueChange={setCustomMaxValue}
            clearLabel="clear-to"
            showClear={hasMaxValue}
            onClear={() => refresh(null, '<=')}
          />
        </div>
      )}
    </div>
  );
}
