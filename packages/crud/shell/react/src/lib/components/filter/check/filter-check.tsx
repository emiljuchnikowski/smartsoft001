import { useEffect, useRef } from 'react';

import { useTranslate } from '@smartsoft001/react';

import { useCrudFilter } from '../base/use-crud-filter';
import { CrudFilterPossibility, SmartCrudFilterProps } from '../filter.types';

/**
 * A checkbox that follows the user's click right away and gets `checked`
 * written to it whenever it changes (the read is debounced, so the value
 * follows 500 ms later).
 */
function FilterCheckbox({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.checked = checked;
  }, [checked]);

  return (
    <input
      ref={ref}
      type="checkbox"
      defaultChecked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      className="smart:h-4 smart:w-4 smart:rounded smart:border-gray-300 smart:text-indigo-600 smart:focus:ring-indigo-500"
    />
  );
}

/**
 * The check filter: a checkbox per possibility, checked when its id is among
 * the item's values, and a clear button while any is checked. Each value is its own query entry.
 */
export function SmartCrudFilterCheck(props: SmartCrudFilterProps) {
  const t = useTranslate();
  const { value, possibilities, setValue, refresh } = useCrudFilter(props);
  const values: any[] = value ?? [];
  const hasCheckedValues = Array.isArray(value) && value.length > 0;
  const list = (possibilities ?? []).map((pos) => ({
    value: pos,
    isCheck: values.some((r) => r === pos.id),
  }));

  const onCheckChange = (checked: boolean, entry: CrudFilterPossibility) => {
    if (checked && !values.some((r) => r === entry.id)) {
      setValue([...values, entry.id]);
    }

    if (!checked && values.some((r) => r === entry.id)) {
      setValue(value?.filter((r: any) => r !== entry.id));
    }
  };

  return (
    <div className="smart:block smart:w-full">
      <fieldset className="smart:w-full">
        <legend className="smart:flex smart:items-center smart:justify-between smart:text-sm smart:font-medium smart:text-gray-900">
          <span>{t(props.item?.label || '')}</span>
          {hasCheckedValues && (
            <button
              type="button"
              onClick={() => refresh([])}
              aria-label="clear"
              className="smart:rounded smart:px-2 smart:py-1 smart:text-red-600 smart:hover:bg-red-50"
            >
              ×
            </button>
          )}
        </legend>
        <div className="smart:mt-2 smart:space-y-2">
          {list.map((entry) => (
            <label
              key={entry.value.id}
              className="smart:flex smart:items-center smart:gap-x-2"
            >
              <FilterCheckbox
                checked={entry.isCheck}
                onCheckedChange={(checked) =>
                  onCheckChange(checked, entry.value)
                }
              />
              <span className="smart:text-sm smart:text-gray-900">
                {t(entry.value.text)}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
