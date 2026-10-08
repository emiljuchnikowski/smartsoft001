import { useId, useMemo, useState } from 'react';

import {
  SmartFormControl,
  SmartInputInt,
  toNumberValue,
  useControlBinding,
  useTranslate,
} from '@smartsoft001/react';

import { useCrudFilter, useCrudFilterControl } from '../base/use-crud-filter';
import { SmartCrudFilterProps } from '../filter.types';

const CLEAR_CLASSES =
  'smart:shrink-0 smart:rounded smart:px-2 smart:py-2 smart:text-red-600 smart:hover:bg-red-50';

/**
 * One end of the advanced range: a translated label and a native number
 * input bound to the slot's control (an emptied input is `null`).
 */
function RangeInput({
  label,
  control,
}: {
  label: string;
  control: SmartFormControl;
}) {
  const t = useTranslate();
  const id = useId();
  const { value, onChange, onBlur } = useControlBinding(control);

  return (
    <div className="smart:flex-1">
      <label
        htmlFor={id}
        className="smart:block smart:text-sm/6 smart:font-medium smart:text-gray-900 smart:dark:text-white"
      >
        {t(label)}
      </label>
      <input
        id={id}
        type="number"
        step="1"
        value={value ?? ''}
        onChange={(e) => onChange(toNumberValue(e.target.value))}
        onBlur={onBlur}
        className="smart:mt-2 smart:block smart:w-full smart:rounded-md smart:bg-white smart:px-3 smart:py-1.5 smart:text-base smart:text-gray-900 smart:outline-1 -outline-offset-1 smart:outline-gray-300 smart:focus:outline-2 smart:focus:outline-offset-2 smart:focus:outline-indigo-600 smart:dark:bg-white/5 smart:dark:text-white smart:dark:outline-white/10"
      />
    </div>
  );
}

/**
 * The int filter: the shared int field for the item's value; for an `=` item
 * a settings button switches to the advanced "from" / "to" range (removing
 * the value), shown as well while a range value is set. The clear button
 * removes every entry of the item at once, the range ones only their own.
 *
 * The range controls are seeded once and not re-synced when the filter
 * changes elsewhere (TODO GAP-19).
 */
export function SmartCrudFilterInt(props: SmartCrudFilterProps) {
  const filter = useCrudFilter(props);
  const valueControl = useCrudFilterControl(filter, null);
  const minControl = useCrudFilterControl(filter, '>=');
  const maxControl = useCrudFilterControl(filter, '<=');
  const [advanced, setAdvanced] = useState(false);
  const {
    buildInputOptions,
    hasValue,
    hasMinValue,
    hasMaxValue,
    setValue,
    refresh,
    clear,
  } = filter;
  const valueOptions = useMemo(
    () => buildInputOptions(valueControl),
    [buildInputOptions, valueControl],
  );
  const allowAdvanced = props.item?.type === '=';

  const toggleAdvanced = () => {
    const next = !advanced;

    setAdvanced(next);
    if (next) setValue(null);
  };

  return (
    <div className="smart:block smart:w-full">
      <div className="smart:flex smart:w-full smart:items-end smart:gap-2">
        {!advanced && (
          <div className="smart:flex-1">
            <SmartInputInt className="smart:flex-1" options={valueOptions} />
          </div>
        )}

        {allowAdvanced && (
          <button
            type="button"
            onClick={toggleAdvanced}
            disabled={hasMinValue || hasMaxValue}
            aria-label="settings"
            className="smart:shrink-0 smart:rounded smart:px-2 smart:py-2 smart:text-gray-600 smart:hover:bg-gray-100 smart:disabled:opacity-40"
          >
            ⚙
          </button>
        )}

        {(hasValue || hasMinValue || hasMaxValue) && (
          <button
            type="button"
            onClick={clear}
            aria-label="clear"
            className={CLEAR_CLASSES}
          >
            ×
          </button>
        )}
      </div>

      {(advanced || hasMinValue || hasMaxValue) && allowAdvanced && (
        <div className="smart:mt-2 smart:flex smart:w-full smart:items-end smart:gap-2">
          <RangeInput label="from" control={minControl} />
          {hasMinValue && (
            <button
              type="button"
              onClick={() => refresh(null, '>=')}
              aria-label="clear-from"
              className={CLEAR_CLASSES}
            >
              ×
            </button>
          )}

          <RangeInput label="to" control={maxControl} />
          {hasMaxValue && (
            <button
              type="button"
              onClick={() => refresh(null, '<=')}
              aria-label="clear-to"
              className={CLEAR_CLASSES}
            >
              ×
            </button>
          )}
        </div>
      )}
    </div>
  );
}
