import { useState } from 'react';

import { SmartDateEdit, useTranslate } from '@smartsoft001/react';

import { useCrudFilterDate } from '../date/use-crud-filter-date';
import { useCrudFilterNgModel } from '../date/use-crud-filter-ng-model';
import { SmartCrudFilterProps } from '../filter.types';

const CLEAR_CLASSES =
  'smart:shrink-0 smart:rounded smart:px-2 smart:py-2 smart:text-red-600 smart:hover:bg-red-50';

/**
 * `<smart-date-edit class="smart:flex-1" [ngModel] (ngModelChange)>`: the
 * shared date editor showing what the user entered until `model` changes.
 */
function BoundDateEdit({
  model,
  onModelChange,
}: {
  model: any;
  onModelChange: (value: any) => void;
}) {
  const [value, setValue] = useCrudFilterNgModel(model, onModelChange);

  return (
    <div className="smart:flex-1">
      <SmartDateEdit
        className="smart:flex-1"
        value={value}
        onValueChange={setValue}
      />
    </div>
  );
}

/** One end of the advanced range: a label, a date editor and its clear. */
function DateRangeRow({
  label,
  model,
  onModelChange,
  clearLabel,
  showClear,
  onClear,
}: {
  label: string;
  model: any;
  onModelChange: (value: any) => void;
  clearLabel: string;
  showClear: boolean;
  onClear: () => void;
}) {
  const t = useTranslate();

  return (
    <div className="smart:flex smart:w-full smart:items-end smart:gap-2">
      <label className="smart:text-sm">{t(label)}</label>
      <BoundDateEdit model={model} onModelChange={onModelChange} />
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
 * `<smart-crud-filter-date-with-edit>` (Angular
 * `FilterDateWithEditComponent`): the item label and the shared date editor
 * for the item's value; for an `=` item an "advanced" button switches to a
 * "from" / "to" pair of editors for the `>=` / `<=` values (removing the
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
            model={customValue || ''}
            onModelChange={setCustomValue}
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
            model={customMinValue || ''}
            onModelChange={setCustomMinValue}
            clearLabel="clear-from"
            showClear={hasMinValue}
            onClear={() => refresh(null, '>=')}
          />
          <DateRangeRow
            label="to"
            model={customMaxValue || ''}
            onModelChange={setCustomMaxValue}
            clearLabel="clear-to"
            showClear={hasMaxValue}
            onClear={() => refresh(null, '<=')}
          />
        </div>
      )}
    </div>
  );
}
