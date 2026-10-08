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
import { useListFileUrl } from '../../use-list';
import { useListMasonryGrid } from '../use-list-masonry-grid';

/**
 * Preline-styled masonry-grid list variation: keeps the masonry column layout
 * and renders every item as a Preline card, the image on a rounded top, the
 * first non-image column as the title and the others as text. Register it for
 * `ListMode.masonryGrid` through `listModeComponents` on `SmartProvider` (see
 * `LIST_PRESET_MODE_COMPONENTS`).
 */
export function SmartListMasonryGridPreset<T extends IEntity<string>>(
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
  const cardContainerClasses = getCardContainerClasses();
  const titleKey = getListTitleKey(type, keys);

  return (
    <>
      <div>{Top ? <Top /> : null}</div>

      <ul
        role="list"
        data-role="grid"
        className={cn(
          'smart:grid smart:grid-cols-1 smart:gap-6 smart:sm:grid-cols-2 smart:lg:grid-cols-3',
          className,
        )}
      >
        {(listWithImages ?? []).map((item) => (
          <li
            key={item.data.id}
            data-role="card"
            className={cardContainerClasses}
          >
            {item.image ? (
              <img
                data-role="card-image"
                className="smart:h-48 smart:w-full smart:object-cover smart:rounded-t-xl"
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
