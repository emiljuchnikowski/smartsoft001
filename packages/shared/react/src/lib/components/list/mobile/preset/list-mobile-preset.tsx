import { IEntity } from '@smartsoft001/domain-core';
import { FieldType } from '@smartsoft001/models';

import { PaginationMode } from '../../../../models';
import { useTranslate } from '../../../../providers/hooks';
import { cn } from '../../../../utils/class-names';
import { toInnerHtml } from '../../../../utils/html';
import { getListCell } from '../../../../utils/model';
import { getCardContainerClasses } from '../../../card/preset/preset-classes';
import { SmartPaging } from '../../../paging/paging';
import { getListTitleKey } from '../../list-title-key';
import { SmartListModeProps } from '../../list.types';
import { useList, useListFileUrl } from '../../use-list';

/**
 * Preline-styled mobile list variation: a responsive grid of cards. Image cells
 * become the card image, the first non-image column the card title and the
 * others card text, followed by the details and remove buttons. Register it for
 * `ListMode.mobile` through `listModeComponents` on `SmartProvider` (see
 * `LIST_PRESET_MODE_COMPONENTS`).
 */
export function SmartListMobilePreset<T extends IEntity<string>>(
  props: SmartListModeProps<T>,
) {
  const { options, className } = props;
  const t = useTranslate();
  const fileUrl = useListFileUrl();
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
  const presetItems = list ?? [];
  const cardContainerClasses = getCardContainerClasses();
  const titleKey = getListTitleKey(type, keys);

  return (
    <>
      <div>{Top ? <Top /> : null}</div>

      <ul
        role="list"
        className={cn(
          'smart:grid smart:gap-4 smart:grid-cols-1 smart:sm:grid-cols-2 smart:lg:grid-cols-3',
          className,
        )}
      >
        {presetItems.map((item) => {
          const cells = keys.map((key) => ({
            key,
            cell: getListCell(item, key, cellPipe, type, t),
          }));

          return (
            <li key={item.id} data-role="card" className={cardContainerClasses}>
              {cells.map(({ key, cell }) =>
                cell && cell.type === FieldType.image ? (
                  <img
                    key={key}
                    data-role="card-image"
                    className="smart:w-full smart:h-auto smart:rounded-t-xl"
                    src={fileUrl(cell.value) || undefined}
                    loading="lazy"
                    alt=""
                  />
                ) : null,
              )}
              <div className="smart:p-4">
                {cells.map(({ key, cell }) => {
                  if (!cell || cell.type === FieldType.image) return null;

                  return key === titleKey ? (
                    <h3
                      key={key}
                      data-role="card-title"
                      className="smart:font-semibold smart:text-gray-900 smart:dark:text-white"
                      dangerouslySetInnerHTML={toInnerHtml(cell.value)}
                    ></h3>
                  ) : (
                    <p
                      key={key}
                      data-role="card-text"
                      className="smart:mt-1 smart:text-gray-500 smart:dark:text-gray-400"
                      dangerouslySetInnerHTML={toInnerHtml(cell.value)}
                    ></p>
                  );
                })}
                <div className="smart:flex smart:items-center smart:gap-x-4">
                  {itemHandler ? (
                    <button
                      type="button"
                      data-role="item"
                      className="smart:mt-2 smart:py-2 smart:px-3 smart:inline-flex smart:justify-center smart:items-center smart:gap-x-2 smart:text-sm smart:font-medium smart:rounded-lg smart:bg-blue-600 smart:dark:bg-blue-500 smart:text-white smart:hover:bg-blue-700 smart:dark:hover:bg-blue-600 smart:focus:outline-hidden"
                      onClick={() => itemHandler?.(item.id)}
                    >
                      {t('details')}
                    </button>
                  ) : null}
                  {removeHandler &&
                  (!checkRemoveHandler || checkRemoveHandler(item)) ? (
                    <button
                      type="button"
                      data-role="remove"
                      className="smart:mt-2 smart:text-red-600 smart:hover:text-red-900 smart:dark:text-red-400 smart:dark:hover:text-red-300 smart:text-sm"
                      onClick={() => removeHandler?.(item)}
                    >
                      {t('remove')}
                    </button>
                  ) : null}
                </div>
              </div>
            </li>
          );
        })}
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
