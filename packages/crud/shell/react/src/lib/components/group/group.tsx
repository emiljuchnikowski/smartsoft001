import { IEntity } from '@smartsoft001/domain-core';
import { cn, SmartList, useTranslate } from '@smartsoft001/react';

import { SmartCrudGroupProps } from './group.types';
import { useCrudGroup } from './use-crud-group';

/**
 * The list grouped by `groups`, each group an accessible disclosure — a
 * button with `aria-expanded` / `aria-controls` and its region. An open group
 * shows the list with `listOptions`, or its `children` groups. Render it
 * inside `<CrudProvider>`.
 */
export function SmartCrudGroup<T extends IEntity<string>>(
  props: SmartCrudGroupProps<T>,
) {
  const t = useTranslate();
  const { groups, listOptions, change } = useCrudGroup<T>(props);

  return (
    <>
      {groups?.map((item) => (
        <div key={item.key} className="smart:border-b smart:border-gray-200">
          <button
            type="button"
            onClick={() => change(!item.show, item)}
            aria-expanded={item.show || false}
            aria-controls={'smart-crud-group-' + item.key}
            className={cn(
              'smart:flex smart:w-full smart:items-center smart:justify-between smart:py-3 smart:text-left smart:text-sm',
              item.show && 'smart:font-bold',
            )}
          >
            <span>{t(item.text)}</span>
            <span aria-hidden="true" className="smart:text-gray-500">
              {item.show ? '▾' : '▸'}
            </span>
          </button>
          {item.show && (
            <div id={'smart-crud-group-' + item.key} className="smart:pb-3">
              {!item.children && listOptions && (
                <SmartList options={listOptions} />
              )}
              {item.children && (
                <div className="smart:ml-12">
                  <SmartCrudGroup
                    groups={item.children}
                    listOptions={listOptions}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </>
  );
}
