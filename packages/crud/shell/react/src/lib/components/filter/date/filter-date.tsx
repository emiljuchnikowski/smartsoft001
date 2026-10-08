import { SmartDateEdit, useTranslate } from '@smartsoft001/react';

import { useCrudFilterDate } from './use-crud-filter-date';
import { useCrudFilterNgModel } from './use-crud-filter-ng-model';
import { SmartCrudFilterProps } from '../filter.types';

/**
 * `<smart-crud-filter-date>` (Angular `FilterDateComponent`): the item label,
 * the shared date editor bound to the item's value (`YYYY-MM-DD`) and a
 * clear button while it has one.
 */
export function SmartCrudFilterDate(props: SmartCrudFilterProps) {
  const t = useTranslate();
  const { customValue, setCustomValue, hasValue, refresh } =
    useCrudFilterDate(props);
  const [date, setDate] = useCrudFilterNgModel(
    customValue || '',
    setCustomValue,
  );

  return (
    <div className="smart:block smart:w-full">
      <label className="smart:mb-1 smart:block smart:text-sm smart:font-medium">
        {t(props.item?.label || '')}
      </label>
      <div className="smart:flex smart:w-full smart:items-end smart:gap-2">
        <div className="smart:flex-1">
          <SmartDateEdit
            className="smart:flex-1"
            value={date}
            onValueChange={setDate}
          />
        </div>
        {hasValue && (
          <button
            type="button"
            onClick={() => refresh(null)}
            aria-label="clear"
            className="smart:shrink-0 smart:rounded smart:px-2 smart:py-2 smart:text-red-600 smart:hover:bg-red-50"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
