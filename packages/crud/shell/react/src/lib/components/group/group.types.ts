import { IEntity } from '@smartsoft001/domain-core';
import { IListOptions } from '@smartsoft001/react';

import { ICrudListGroup } from '../../models';

/** The props of `<SmartCrudGroup>` (`<smart-crud-group>`). */
export interface SmartCrudGroupProps<T extends IEntity<string>> {
  groups?: Array<ICrudListGroup> | null;
  listOptions?: IListOptions<T> | null;
}
