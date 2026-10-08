import type { ReactNode } from 'react';

import { IEntity } from '@smartsoft001/domain-core';
import { IListOptions } from '@smartsoft001/react';

/** The props of `<SmartCrudListPage>` (the Angular `<smart-crud-list-page>`). */
export interface SmartCrudListPageProps {
  /**
   * The path of the list, which the add button (`<basePath>/add`) and the
   * item links (`<basePath>/<id>`) are relative to. The current path when
   * omitted, as the Angular page used the router's current URL.
   */
  basePath?: string;
  /**
   * The Angular `ng-content`: handed to the body. The standard body does not
   * render it (its Angular template has no `ng-content`); a body registered
   * as `crud-list-page` can.
   */
  children?: ReactNode;
}

/**
 * The props of the list page body: `SmartCrudListPageStandard` or a body
 * registered as `components['crud-list-page']` on `SmartProvider` (the inputs
 * of the Angular `CrudListPageBaseComponent`).
 */
export interface SmartCrudListPageBodyProps<T extends IEntity<string> = any> {
  listOptions: IListOptions<T> | null;
  children?: ReactNode;
}
