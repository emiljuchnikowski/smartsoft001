import { IEntity } from '@smartsoft001/domain-core';

import { IDetailsOptions } from '../../models';

export interface SmartDetailsProps<T extends IEntity<string> = any> {
  options?: IDetailsOptions<T>;
  className?: string;
}
