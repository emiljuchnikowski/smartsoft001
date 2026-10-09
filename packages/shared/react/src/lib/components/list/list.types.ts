import { IEntity } from '@smartsoft001/domain-core';

import { IListInternalOptions, IListOptions } from '../../models';

/** Props of `<SmartList>`. */
export interface SmartListProps<T extends IEntity<string>> {
  options: IListOptions<T>;
  className?: string;
}

/**
 * Props of a list mode implementation (`SmartListDesktop`, `SmartListMobile`,
 * `SmartListMasonryGrid`, their presets, or one registered through
 * `listModeComponents` / `components.list` on `SmartProvider`). `SmartList`
 * passes the options with the list `fields` of the model already resolved.
 */
export interface SmartListModeProps<T extends IEntity<string>> {
  options: IListInternalOptions<T>;
  className?: string;
}
