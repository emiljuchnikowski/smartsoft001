import type { ReactNode } from 'react';

import { IEntity } from '@smartsoft001/domain-core';
import { IListOptions } from '@smartsoft001/react';

/** The props of `<SmartCrudListPage>`. */
export interface SmartCrudListPageProps {
  /**
   * The path of the list, which the add button (`<basePath>/add`) and the
   * item links (`<basePath>/<id>`) are relative to. The path of the
   * navigation adapter's current URL when omitted.
   */
  basePath?: string;
  /**
   * Handed to the body. The standard body does not render it; a body
   * registered as `crud-list-page` can.
   */
  children?: ReactNode;
}

/**
 * The props of the list page body: `SmartCrudListPageStandard` or a body
 * registered as `components['crud-list-page']` on `SmartProvider`.
 */
export interface SmartCrudListPageBodyProps<T extends IEntity<string> = any> {
  listOptions: IListOptions<T> | null;
  children?: ReactNode;
}
