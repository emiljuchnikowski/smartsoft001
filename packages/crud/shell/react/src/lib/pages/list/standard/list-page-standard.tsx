import { IEntity } from '@smartsoft001/domain-core';
import { SmartList } from '@smartsoft001/react';

import { SmartCrudFiltersConfig } from '../../../components/filters-config/filters-config';
import { SmartCrudGroup } from '../../../components/group/group';
import { useCrudConfig } from '../../../crud.context';
import { useCrudState } from '../../../hooks';
import { SmartCrudListPageBodyProps } from '../list-page.types';

/**
 * The default list page body: the active filters (`SmartCrudFiltersConfig`)
 * and `SmartList`; with `config.list.groups` the list is hidden behind
 * `SmartCrudGroup` unless a text is searched. `children` are not rendered.
 *
 * The list is hidden through a `div` around it, rendered only when there are
 * groups.
 */
export function SmartCrudListPageStandard<T extends IEntity<string>>({
  listOptions,
}: SmartCrudListPageBodyProps<T>) {
  const config = useCrudConfig<T>();
  const isSearch = useCrudState<T, boolean>(
    (state) => !!state.filter?.searchText,
  );
  const groups = config.list?.groups;
  const hideList = !!groups && !isSearch;

  const list = listOptions ? <SmartList options={listOptions} /> : null;

  return (
    <>
      <SmartCrudFiltersConfig />
      {groups ? <div hidden={hideList || undefined}>{list}</div> : list}
      {groups && !isSearch ? (
        <SmartCrudGroup groups={groups} listOptions={listOptions || null} />
      ) : null}
    </>
  );
}
