import { IEntity } from '@smartsoft001/domain-core';
import { FieldType } from '@smartsoft001/models';

import {
  LIST_DESKTOP_STICKY_HEADER_STYLE,
  useListDesktop,
} from './use-list-desktop';
import { PaginationMode } from '../../../models';
import { useTranslate } from '../../../providers/hooks';
import { cn } from '../../../utils/class-names';
import { useListHeaderFn } from '../../../utils/hooks';
import { toInnerHtml } from '../../../utils/html';
import { getListCell } from '../../../utils/model';
import { SmartPaging } from '../../paging/paging';
import { SmartListModeProps } from '../list.types';
import { useListFileUrl } from '../use-list';

/**
 * The desktop list: a table with one column per list field, plus the
 * multi-select, details, remove and item columns, the `top` component factory
 * above it and the paging below it (`PaginationMode.singlePage`). The header
 * row stays sticky; with `options.sort` the field headers are sort buttons.
 */
export function SmartListDesktop<T extends IEntity<string>>(
  props: SmartListModeProps<T>,
) {
  const { options, className } = props;
  const t = useTranslate();
  const listHeader = useListHeaderFn();
  const fileUrl = useListFileUrl();
  const {
    desktopList,
    desktopKeys,
    componentFactories,
    onChangeMultiselect,
    cellPipe,
    type,
    checkRemoveHandler,
    removeHandler,
    itemHandler,
    detailsHandler,
    isSortable,
    sortBy,
    getAriaSort,
    getSortIndicator,
    loadNextPage,
    page,
    totalPages,
    handlePageChange,
    infiniteScroll,
    infiniteScrollRef,
  } = useListDesktop(props);
  const Top = componentFactories?.top;
  const rows = desktopList ?? [];

  const pagination = (last: boolean) =>
    last && loadNextPage && totalPages ? (
      <div className="smart:float-right smart:text-sm smart:text-gray-500">
        {t('page')}:{' '}
        <b>
          {page}/{totalPages}
        </b>
      </div>
    ) : null;

  return (
    <>
      <div>{Top ? <Top /> : null}</div>

      <div className="smart:overflow-x-auto">
        <table
          className={cn(
            'smart:min-w-full smart:divide-y smart:divide-gray-300 smart:dark:divide-white/10',
            className,
          )}
        >
          <thead>
            <tr className="smart:bg-gray-50 smart:dark:bg-gray-800/50">
              {desktopKeys.map((key, index) => {
                const last = index === desktopKeys.length - 1;

                switch (key) {
                  case 'selectMulti':
                    return (
                      <th
                        key={key}
                        className="smart:w-10 smart:px-3 smart:py-3.5"
                        style={LIST_DESKTOP_STICKY_HEADER_STYLE}
                      ></th>
                    );
                  case 'detailsAction':
                  case 'removeAction':
                  case 'itemAction':
                    return (
                      <th
                        key={key}
                        className="smart:w-10 smart:px-3 smart:py-3.5"
                        style={LIST_DESKTOP_STICKY_HEADER_STYLE}
                      >
                        {pagination(last)}
                      </th>
                    );
                  default:
                    return (
                      <th
                        key={key}
                        className="smart:px-3 smart:py-3.5 smart:text-left smart:text-sm smart:font-semibold smart:text-gray-900 smart:dark:text-white"
                        style={LIST_DESKTOP_STICKY_HEADER_STYLE}
                        aria-sort={getAriaSort(key) ?? undefined}
                      >
                        {isSortable(key) ? (
                          <button
                            type="button"
                            data-role="sort"
                            className="smart:inline-flex smart:items-center smart:gap-x-1 smart:font-semibold smart:text-gray-900 smart:hover:text-indigo-600 smart:dark:text-white smart:dark:hover:text-indigo-400"
                            onClick={() => sortBy(key)}
                          >
                            {listHeader(desktopList, key, type)}
                            <span
                              aria-hidden="true"
                              className="smart:text-gray-400 smart:dark:text-gray-500"
                            >
                              {getSortIndicator(key)}
                            </span>
                          </button>
                        ) : (
                          listHeader(desktopList, key, type)
                        )}
                        {pagination(last)}
                      </th>
                    );
                }
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((element) => (
              <tr
                key={element.id}
                className="smart:hover:bg-gray-50 smart:dark:hover:bg-gray-800/30"
              >
                {desktopKeys.map((key) => {
                  switch (key) {
                    case 'selectMulti':
                      return (
                        <td
                          key={key}
                          className="smart:w-10 smart:px-3 smart:py-4"
                        >
                          <input
                            type="checkbox"
                            className="smart:rounded smart:border-gray-300 smart:text-indigo-600 smart:focus:ring-indigo-600"
                            onChange={(event) =>
                              onChangeMultiselect(
                                event.target.checked,
                                element,
                                rows,
                              )
                            }
                          />
                        </td>
                      );
                    case 'detailsAction':
                      return (
                        <td
                          key={key}
                          className="smart:w-10 smart:px-3 smart:py-4"
                        >
                          <button
                            type="button"
                            data-role="details"
                            className="smart:text-indigo-600 smart:hover:text-indigo-900 smart:dark:text-indigo-400 smart:dark:hover:text-indigo-300"
                            onClick={() => detailsHandler?.(element)}
                          >
                            {t('show')}
                          </button>
                        </td>
                      );
                    case 'removeAction':
                      return (
                        <td
                          key={key}
                          className="smart:w-10 smart:px-3 smart:py-4"
                        >
                          {!checkRemoveHandler ||
                          checkRemoveHandler(element) ? (
                            <button
                              type="button"
                              className="smart:text-red-600 smart:hover:text-red-900 smart:dark:text-red-400 smart:dark:hover:text-red-300"
                              onClick={() => removeHandler?.(element)}
                            >
                              {t('remove')}
                            </button>
                          ) : null}
                        </td>
                      );
                    case 'itemAction':
                      return (
                        <td
                          key={key}
                          className="smart:w-10 smart:px-3 smart:py-4"
                        >
                          <button
                            type="button"
                            className="smart:text-indigo-600 smart:hover:text-indigo-900 smart:dark:text-indigo-400 smart:dark:hover:text-indigo-300"
                            onClick={() => itemHandler?.(element.id)}
                          >
                            →
                          </button>
                        </td>
                      );
                    default: {
                      const cell = getListCell(element, key, cellPipe, type, t);

                      return (
                        <td
                          key={key}
                          className="smart:px-3 smart:py-4 smart:text-sm smart:text-gray-700 smart:dark:text-gray-300"
                          smart-item-key={key}
                        >
                          {cell ? (
                            cell.type === FieldType.image ? (
                              <img
                                height="50"
                                src={fileUrl(cell.value) || undefined}
                                loading="lazy"
                                alt=""
                                className="smart:h-10 smart:w-auto"
                              />
                            ) : (
                              <div
                                dangerouslySetInnerHTML={toInnerHtml(
                                  cell.value,
                                )}
                              ></div>
                            )
                          ) : null}
                        </td>
                      );
                    }
                  }
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
