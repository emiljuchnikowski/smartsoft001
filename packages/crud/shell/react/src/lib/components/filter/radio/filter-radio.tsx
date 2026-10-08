import { useMemo } from 'react';

import { SmartInputRadio } from '@smartsoft001/react';

import { useCrudFilter, useCrudFilterControl } from '../base/use-crud-filter';
import { SmartCrudFilterProps } from '../filter.types';

/**
 * `<smart-crud-filter-radio>` (Angular `FilterRadioComponent`): the shared
 * radio field with the filter's possibilities, bound to the item's value, and
 * a clear button while the value is truthy or `false`.
 */
export function SmartCrudFilterRadio(props: SmartCrudFilterProps) {
  const filter = useCrudFilter(props);
  const control = useCrudFilterControl(filter);
  const { buildInputOptions, value, refresh } = filter;
  const options = useMemo(
    () => buildInputOptions(control, true),
    [buildInputOptions, control],
  );

  return (
    <div className="smart:mb-5 smart:block smart:w-full">
      <div className="smart:flex smart:w-full smart:items-start smart:gap-2">
        <div className="smart:flex-1">
          <SmartInputRadio className="smart:flex-1" options={options} />
        </div>
        {(value || value === false) && (
          <button
            type="button"
            onClick={() => refresh(null)}
            aria-label="clear"
            className="smart:shrink-0 smart:rounded smart:px-2 smart:py-1 smart:text-red-600 smart:hover:bg-red-50"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
