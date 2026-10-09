import { useMemo } from 'react';

import { useTranslate } from '@smartsoft001/react';
import type { SmartTranslateFn } from '@smartsoft001/react';

import { useCrudFacade } from '../../crud.context';
import { useCrudState } from '../../hooks';
import { ICrudFilterQueryItem } from '../../models';

// A text value is translated, any other value is shown as it is.
function translateValue(t: SmartTranslateFn, value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return t(value);

  return String(value);
}

/**
 * The active filters of the CRUD feature (the visible items of
 * `filter.query`) as chips; clicking a chip removes the item and reads the
 * list again. Render it inside `<CrudProvider>`.
 */
export function SmartCrudFiltersConfig() {
  const t = useTranslate();
  const facade = useCrudFacade();
  const filter = useCrudState((state) => state.filter);

  const query = useMemo<ICrudFilterQueryItem[]>(
    () => filter?.query?.filter((i) => !i.hidden) || [],
    [filter],
  );

  const onRemoveQuery = (item: ICrudFilterQueryItem): void => {
    const current = facade.filter;

    facade.read(
      current?.query
        ? { ...current, query: current.query.filter((i) => i !== item) }
        : current,
    );
  };

  if (!query.length) return null;

  return (
    <div className="smart:flex smart:flex-wrap smart:gap-2 smart:px-4 smart:py-2">
      {query.map((item, index) => (
        <button
          key={`${index}:${item.key}:${item.type}`}
          type="button"
          onClick={() => onRemoveQuery(item)}
          className="smart:inline-flex smart:items-center smart:gap-1 smart:rounded-full smart:border smart:border-gray-300 smart:bg-gray-50 smart:px-3 smart:py-1 smart:text-sm smart:text-gray-700 smart:hover:bg-gray-100"
          aria-label={t('remove') + ' ' + t('MODEL.' + item.key)}
        >
          <span>
            {t('MODEL.' + item.key)} {item.type} {translateValue(t, item.value)}
          </span>
          <span aria-hidden="true" className="smart:text-red-600">
            ✕
          </span>
        </button>
      ))}
    </div>
  );
}
