import { IEntity } from '@smartsoft001/domain-core';

import { PaginationMode } from '../../../models';
import { useTranslate } from '../../../providers/hooks';
import { cn } from '../../../utils/class-names';
import { toInnerHtml } from '../../../utils/html';
import { getListCell } from '../../../utils/model';
import { SmartPaging } from '../../paging/paging';
import { SmartListModeProps } from '../list.types';
import { useList } from '../use-list';

/**
 * The mobile list: a stacked list with one paragraph per cell and the remove /
 * item buttons, the `top` component factory above it and the paging below it
 * (`PaginationMode.singlePage`).
 */
export function SmartListMobile<T extends IEntity<string>>(
  props: SmartListModeProps<T>,
) {
  const { options, className } = props;
  const t = useTranslate();
  const {
    list,
    keys,
    cellPipe,
    type,
    checkRemoveHandler,
    removeHandler,
    itemHandler,
    page,
    totalPages,
    handlePageChange,
    infiniteScroll,
    infiniteScrollRef,
  } = useList(props);
  const Top = options.componentFactories?.top;
  const mobileItems = list ?? [];

  return (
    <>
      <div>{Top ? <Top /> : null}</div>

      <ul
        role="list"
        className={cn(
          'smart:divide-y smart:divide-gray-100 smart:dark:divide-white/10',
          className,
        )}
      >
        {mobileItems.map((item) => (
          <li
            key={item.id}
            className="smart:flex smart:justify-between smart:gap-x-6 smart:py-5"
          >
            <div className="smart:flex smart:min-w-0 smart:gap-x-4">
              <div className="smart:min-w-0 smart:flex-auto">
                {keys.map((key) => {
                  const cell = getListCell(item, key, cellPipe, type, t);

                  return cell ? (
                    <p
                      key={key}
                      className="smart:text-sm smart:text-gray-900 smart:dark:text-white"
                      dangerouslySetInnerHTML={toInnerHtml(cell.value)}
                    ></p>
                  ) : null;
                })}
              </div>
            </div>
            <div className="smart:flex smart:shrink-0 smart:items-center smart:gap-x-4">
              {removeHandler &&
              (!checkRemoveHandler || checkRemoveHandler(item)) ? (
                <button
                  type="button"
                  className="smart:text-red-600 smart:hover:text-red-900 smart:dark:text-red-400 smart:dark:hover:text-red-300 smart:text-sm"
                  onClick={() => removeHandler?.(item)}
                >
                  {t('remove')}
                </button>
              ) : null}
              {itemHandler ? (
                <button
                  type="button"
                  className="smart:text-indigo-600 smart:hover:text-indigo-900 smart:dark:text-indigo-400 smart:dark:hover:text-indigo-300 smart:text-sm"
                  onClick={() => itemHandler?.(item.id)}
                >
                  →
                </button>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      {options.pagination?.mode === PaginationMode.singlePage ? (
        <SmartPaging
          currentPage={page ?? 1}
          totalPages={totalPages ?? 1}
          onPageChange={handlePageChange}
        />
      ) : null}
      {infiniteScroll ? (
        <div
          ref={infiniteScrollRef}
          data-role="infinite-scroll"
          aria-hidden="true"
        ></div>
      ) : null}
    </>
  );
}
