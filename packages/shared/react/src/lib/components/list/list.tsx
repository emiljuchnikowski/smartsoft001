import { useMemo } from 'react';
import type { ComponentType } from 'react';

import { IEntity } from '@smartsoft001/domain-core';
import {
  getModelFieldsWithOptions,
  IFieldListMetadata,
  IFieldOptions,
} from '@smartsoft001/models';

import { SmartListDesktop } from './desktop/list-desktop';
import { SmartListModeProps, SmartListProps } from './list.types';
import { SmartListMasonryGrid } from './masonry-grid/list-masonry-grid';
import { SmartListMobile } from './mobile/list-mobile';
import { IListInternalOptions, ListMode } from '../../models';
import {
  useListModeComponents,
  useSmartComponent,
  useTranslate,
} from '../../providers/hooks';
import { SmartLoader } from '../loader/loader';

type ListField = { key: string; options: IFieldOptions };

const LIST_MODE_COMPONENTS: Partial<
  Record<ListMode, ComponentType<SmartListModeProps<IEntity<string>>>>
> = {
  [ListMode.desktop]: SmartListDesktop,
  [ListMode.mobile]: SmartListMobile,
  [ListMode.masonryGrid]: SmartListMasonryGrid,
};

/** Ascending `list.order`, the fields without one last (lodash `sortBy`). */
function compareOrder(a?: number, b?: number): number {
  if (a === b) return 0;
  if (a === undefined) return 1;
  if (b === undefined) return -1;

  return a - b;
}

/** The fields of the model with `list` options, sorted by `list.order`. */
function getListFields(type: any): ListField[] {
  const fields =
    getModelFieldsWithOptions(new type())?.filter(
      (item) => item?.options?.list,
    ) ?? [];

  return [...fields].sort((a, b) =>
    compareOrder(
      (a.options.list as IFieldListMetadata).order,
      (b.options.list as IFieldListMetadata).order,
    ),
  );
}

/**
 * `<smart-list>`: resolves the list `fields` of `options.type` (the fields
 * with `list` options, sorted by `list.order`) and renders the
 * implementation of `options.mode` (desktop by default): the one registered
 * in `listModeComponents` on `SmartProvider` (the Angular
 * `LIST_MODE_COMPONENTS_TOKEN`, e.g. `LIST_PRESET_MODE_COMPONENTS`), else
 * `SmartListDesktop` / `SmartListMobile` / `SmartListMasonryGrid`. A
 * component registered as `components.list` replaces it for every mode.
 *
 * Below it: the loader while `provider.loading`, and "no results" for an
 * empty list. (The Angular `HardwareService.isMobile` that picked the mobile
 * mode without `options.mode` is always `false`, so desktop is the default.)
 */
export function SmartList<T extends IEntity<string>>({
  options,
  className = '',
}: SmartListProps<T>) {
  const t = useTranslate();
  const modeComponents = useListModeComponents(LIST_MODE_COMPONENTS);
  const type = options.type;

  const fields = useMemo(() => getListFields(type), [type]);

  const internalOptions = useMemo<IListInternalOptions<T>>(
    () => ({ ...options, fields }),
    [options, fields],
  );

  const mode = internalOptions.mode ?? ListMode.desktop;
  const ModeComponent = useSmartComponent<SmartListModeProps<T>>(
    'list',
    modeComponents[mode] ?? SmartListDesktop,
  );
  const loading = internalOptions.provider?.loading;

  return (
    <>
      <ModeComponent options={internalOptions} className={className} />
      <SmartLoader show={loading ?? false} />
      {!loading && !internalOptions.provider?.list?.length ? (
        <h2 className="smart:mt-4 smart:text-center smart:text-gray-500 smart:dark:text-gray-400">
          {t('noResults')}
        </h2>
      ) : null}
    </>
  );
}
