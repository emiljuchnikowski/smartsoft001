import { IEntity } from '@smartsoft001/domain-core';
import { FieldType } from '@smartsoft001/models';

import {
  getListDesktopCellClasses,
  getListDesktopContainerClasses,
  getListDesktopHeaderCellClasses,
  getListDesktopHeaderRowClasses,
  getListDesktopRowClasses,
  getListDesktopTableClasses,
} from './preset-classes';
import { PaginationMode } from '../../../../models';
import { useTranslate } from '../../../../providers/hooks';
import { cn } from '../../../../utils/class-names';
import { useListHeaderFn } from '../../../../utils/hooks';
import { toInnerHtml } from '../../../../utils/html';
import { getListCell } from '../../../../utils/model';
import { SmartPaging } from '../../../paging/paging';
import { SmartListModeProps } from '../../list.types';
import { useListFileUrl } from '../../use-list';
import {
  LIST_DESKTOP_STICKY_HEADER_STYLE,
  useListDesktop,
} from '../use-list-desktop';

/**
 * Preline-styled desktop list variation. Drop-in replacement for
 * `SmartListDesktop`: register it for `ListMode.desktop` through
 * `listModeComponents` on `SmartProvider` (see `LIST_PRESET_MODE_COMPONENTS`),
 * or render it directly.
 *
 * Keeps every functional branch of the desktop table (top slot, multi
 * select, remove / item actions, pagination, image cells) and restyles it
 * with the Preline table look, driven by `options.presentation`: `variant`
 * (default | striped | bordered | borderless), `hoverable` and `header`
 * (default | muted | none). `className` goes on the container.
 *
 * The table ends with an empty hidden `<tfoot>`, so the dividers also draw a
 * line below the last body row.
 */
export function SmartListDesktopPreset<T extends IEntity<string>>(
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
    loadNextPage,
    page,
    totalPages,
    handlePageChange,
    infiniteScroll,
    infiniteScrollRef,
  } = useListDesktop(props);
  const Top = componentFactories?.top;
  const rows = desktopList ?? [];

  const presentation = options?.presentation ?? {};
  const containerClasses = cn(
    getListDesktopContainerClasses(presentation.variant),
    className,
  );
  const tableClasses = getListDesktopTableClasses(presentation.variant);
  const headerRowClasses = getListDesktopHeaderRowClasses(presentation.header);
  const headerCellClasses = getListDesktopHeaderCellClasses();
  const rowClasses = getListDesktopRowClasses(
    presentation.variant,
    Boolean(presentation.hoverable),
  );
  const cellClasses = getListDesktopCellClasses();

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

      <div className={containerClasses}>
        <table data-role="table" className={tableClasses}>
          <thead>
            <tr
              data-role="header-row"
              className={headerRowClasses || undefined}
            >
              {desktopKeys.map((key, index) => {
                const last = index === desktopKeys.length - 1;

                switch (key) {
                  case 'selectMulti':
                    return (
                      <th
                        key={key}
                        className="smart:w-10 smart:px-3 smart:py-3"
                        style={LIST_DESKTOP_STICKY_HEADER_STYLE}
                      ></th>
                    );
                  case 'removeAction':
                  case 'itemAction':
                    return (
                      <th
                        key={key}
                        className={cn(
                          headerCellClasses,
                          'smart:w-10 smart:text-end',
                        )}
                        style={LIST_DESKTOP_STICKY_HEADER_STYLE}
                      >
                        {pagination(last)}
                      </th>
                    );
                  default:
                    return (
                      <th
                        key={key}
                        className={headerCellClasses}
                        style={LIST_DESKTOP_STICKY_HEADER_STYLE}
                      >
                        {listHeader(desktopList, key, type)}
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
                data-role="row"
                className={rowClasses || undefined}
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
                            className="smart:shrink-0 smart:border-gray-300 smart:rounded-sm smart:text-blue-600 smart:focus:ring-blue-500 smart:dark:bg-gray-800 smart:dark:border-gray-600 smart:dark:checked:bg-blue-500 smart:dark:checked:border-blue-500"
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
                    case 'removeAction':
                      return (
                        <td
                          key={key}
                          className={cn(
                            cellClasses,
                            'smart:w-10 smart:text-end',
                          )}
                        >
                          {!checkRemoveHandler ||
                          checkRemoveHandler(element) ? (
                            <button
                              type="button"
                              data-role="remove"
                              className="smart:inline-flex smart:items-center smart:gap-x-2 smart:text-sm smart:font-semibold smart:rounded-lg smart:text-red-600 smart:hover:text-red-700 smart:dark:text-red-400 smart:dark:hover:text-red-300 smart:focus:outline-hidden smart:disabled:opacity-50 smart:disabled:pointer-events-none"
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
                          className={cn(
                            cellClasses,
                            'smart:w-10 smart:text-end',
                          )}
                        >
                          <button
                            type="button"
                            data-role="item"
                            className="smart:inline-flex smart:items-center smart:gap-x-2 smart:text-sm smart:font-semibold smart:rounded-lg smart:text-blue-600 smart:hover:text-blue-700 smart:dark:text-blue-400 smart:dark:hover:text-blue-300 smart:focus:outline-hidden smart:disabled:opacity-50 smart:disabled:pointer-events-none"
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
                          className={cellClasses}
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
          <tfoot style={{ display: 'none' }}></tfoot>
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
