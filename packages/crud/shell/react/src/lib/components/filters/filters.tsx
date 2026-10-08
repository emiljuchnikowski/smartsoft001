import { IEntity } from '@smartsoft001/domain-core';
import { useTranslate } from '@smartsoft001/react';

import { SmartCrudFiltersProps } from './filters.types';
import { useCrudFilters } from './use-crud-filters';
import { SmartCrudFilter } from '../filter/filter';

/**
 * The filters panel of the CRUD feature, opened in the end menu — a header
 * with the title and a close button (unless `hideMenu`), then a
 * `SmartCrudFilter` for every filter of the model: the `filters` of `@Model`
 * and the fields with `list.filter`. Render it inside `<CrudProvider>`.
 */
export function SmartCrudFilters<T extends IEntity<string>>(
  props: SmartCrudFiltersProps,
) {
  const t = useTranslate();
  const { elementRef, hideMenu, list, filter, onClose } =
    useCrudFilters<T>(props);

  return (
    <div ref={elementRef} className="smart:flex smart:h-full smart:flex-col">
      {!hideMenu && (
        <header className="smart:flex smart:items-center smart:justify-between smart:border-b smart:border-gray-200 smart:px-4 smart:py-3">
          <h2 className="smart:text-lg smart:font-semibold smart:text-gray-900">
            {t('filters')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="close"
            className="smart:rounded smart:p-1 smart:text-gray-500 smart:hover:bg-gray-100"
          >
            ✕
          </button>
        </header>
      )}
      {/* No `space-y-*` here: each filter is spaced by its own padding. */}
      <div className="smart:flex-1 smart:overflow-y-auto smart:px-4 smart:py-3">
        {list.map((item, index) => (
          <SmartCrudFilter
            key={`${index}:${item.key}`}
            item={item}
            filter={filter}
          />
        ))}
      </div>
    </div>
  );
}
