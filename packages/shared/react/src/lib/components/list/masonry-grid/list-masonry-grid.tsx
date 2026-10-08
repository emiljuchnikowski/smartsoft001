import { IEntity } from '@smartsoft001/domain-core';
import { FieldType } from '@smartsoft001/models';

import { useListMasonryGrid } from './use-list-masonry-grid';
import { PaginationMode } from '../../../models';
import { useTranslate } from '../../../providers/hooks';
import { cn } from '../../../utils/class-names';
import { toInnerHtml } from '../../../utils/html';
import { getListCell } from '../../../utils/model';
import { SmartPaging } from '../../paging/paging';
import { SmartListModeProps } from '../list.types';
import { useListFileUrl } from '../use-list';

/**
 * The masonry-grid list (the Angular `<smart-list-masonry-grid>`,
 * `ListMasonryGridComponent`): a grid of tiles with the item's image (the
 * model's first image field, lazy loaded) over its non-image cells, the
 * `top` component factory above it and the paging below it
 * (`PaginationMode.singlePage`).
 */
export function SmartListMasonryGrid<T extends IEntity<string>>(
  props: SmartListModeProps<T>,
) {
  const { options, className } = props;
  const t = useTranslate();
  const fileUrl = useListFileUrl();
  const {
    listWithImages,
    keys,
    cellPipe,
    type,
    page,
    totalPages,
    handlePageChange,
    infiniteScroll,
    infiniteScrollRef,
  } = useListMasonryGrid(props);
  const Top = options.componentFactories?.top;

  return (
    <>
      <div>{Top ? <Top /> : null}</div>

      <ul
        role="list"
        className={cn(
          'smart:grid smart:grid-cols-1 smart:gap-6 smart:sm:grid-cols-2 smart:lg:grid-cols-3',
          className,
        )}
      >
        {(listWithImages ?? []).map((item) => (
          <li
            key={item.data.id}
            className="smart:col-span-1 smart:rounded-lg smart:bg-white smart:shadow-sm smart:dark:bg-gray-800/50 smart:overflow-hidden"
          >
            {item.image ? (
              <img
                className="smart:h-48 smart:w-full smart:object-cover"
                src={fileUrl(item.image) || undefined}
                width="400"
                height="192"
                loading="lazy"
                alt=""
              />
            ) : null}
            <div className="smart:p-4">
              {keys.map((key) => {
                const cell = getListCell(item.data, key, cellPipe, type, t);

                return cell && cell.type !== FieldType.image ? (
                  <p
                    key={key}
                    className="smart:text-sm smart:text-gray-900 smart:dark:text-white"
                    dangerouslySetInnerHTML={toInnerHtml(cell.value)}
                  ></p>
                ) : null;
              })}
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
