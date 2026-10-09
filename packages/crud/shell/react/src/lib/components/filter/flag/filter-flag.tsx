import { useMemo } from 'react';

import { SmartInputFlag } from '@smartsoft001/react';

import { useCrudFilter, useCrudFilterControl } from '../base/use-crud-filter';
import { SmartCrudFilterProps } from '../filter.types';

/**
 * The flag filter: the shared flag field bound to the item's value, and a
 * clear button while the value is `true` or `false`.
 */
export function SmartCrudFilterFlag(props: SmartCrudFilterProps) {
  const filter = useCrudFilter(props);
  const control = useCrudFilterControl(filter);
  const { buildInputOptions, value, refresh } = filter;
  const options = useMemo(
    () => buildInputOptions(control),
    [buildInputOptions, control],
  );

  return (
    <div className="smart:block smart:w-full">
      <div className="smart:flex smart:w-full smart:items-center smart:gap-2">
        <div className="smart:flex-1">
          <SmartInputFlag className="smart:flex-1" options={options} />
        </div>
        {(value === true || value === false) && (
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
