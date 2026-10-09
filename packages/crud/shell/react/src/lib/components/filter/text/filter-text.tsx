import { useMemo } from 'react';

import { SmartInputText } from '@smartsoft001/react';

import { useCrudFilter, useCrudFilterControl } from '../base/use-crud-filter';
import { SmartCrudFilterProps } from '../filter.types';

/**
 * The text filter: the shared text field bound to the item's value, and a
 * clear button while it has one.
 * Typing reads the list 500 ms after the last change.
 */
export function SmartCrudFilterText(props: SmartCrudFilterProps) {
  const filter = useCrudFilter(props);
  const control = useCrudFilterControl(filter);
  const { buildInputOptions, hasValue, refresh } = filter;
  const options = useMemo(
    () => buildInputOptions(control),
    [buildInputOptions, control],
  );

  return (
    <div className="smart:block smart:w-full">
      <div className="smart:flex smart:w-full smart:items-end smart:gap-2">
        <div className="smart:flex-1">
          <SmartInputText className="smart:flex-1" options={options} />
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
