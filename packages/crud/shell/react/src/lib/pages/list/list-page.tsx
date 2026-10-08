import { IEntity } from '@smartsoft001/domain-core';
import { SmartPage, useSmartComponent } from '@smartsoft001/react';

import {
  SmartCrudListPageBodyProps,
  SmartCrudListPageProps,
} from './list-page.types';
import { SmartCrudListPageStandard } from './standard/list-page-standard';
import { useCrudListPage } from './use-crud-list-page';

/**
 * `<smart-crud-list-page>` (the Angular `ListComponent` of the
 * `CrudFullModule` `''` route): a `SmartPage` with the title, search and end
 * buttons of `useCrudListPage`, `config.list.components.top`, and the body:
 * the one registered as `components['crud-list-page']` on `SmartProvider`
 * (the Angular `crud-list-page` dynamic component), else
 * `SmartCrudListPageStandard`. Renders nothing until the feature's filter is
 * set by the first read. Render it inside the feature's `CrudProvider` with a
 * `CrudFullConfig`.
 *
 * Like the Angular page, a registered body renders in the
 * `.dynamic-content` element. The list options are built synchronously, so
 * unlike the Angular page the body never gets `null` ones.
 */
export function SmartCrudListPage<T extends IEntity<string>>(
  props: SmartCrudListPageProps,
) {
  const { children } = props;
  const { config, filter, pageOptions, listOptions, TopComponent } =
    useCrudListPage<T>(props);
  const Body = useSmartComponent<SmartCrudListPageBodyProps<T>>(
    'crud-list-page',
    SmartCrudListPageStandard,
  );
  const standard = Body === SmartCrudListPageStandard;

  if (!filter) return null;

  const body = <Body listOptions={listOptions}>{children}</Body>;

  return (
    <SmartPage options={pageOptions} className={config.className || ''}>
      <div>{TopComponent ? <TopComponent /> : null}</div>

      {standard ? body : null}
      <div className="dynamic-content">{!standard ? body : null}</div>
    </SmartPage>
  );
}
