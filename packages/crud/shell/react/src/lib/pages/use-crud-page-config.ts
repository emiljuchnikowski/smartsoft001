import { useMemo } from 'react';

import { IEntity } from '@smartsoft001/domain-core';
import { useAuthService } from '@smartsoft001/react';

import { CrudFullConfig } from '../crud.config';
import { useCrudConfig } from '../crud.context';
import { applyPagePermissions } from '../services/page/page.service';

/**
 * The configuration of the feature's pages: the `CrudFullConfig` of the
 * `CrudProvider` with `add`, `edit` and `remove` turned off when the model's
 * permissions are not granted.
 */
export function useCrudPageConfig<
  T extends IEntity<string>,
>(): CrudFullConfig<T> {
  const config = useCrudConfig<T>();
  const authService = useAuthService();

  return useMemo(
    () => applyPagePermissions(config as CrudFullConfig<T>, authService),
    [config, authService],
  );
}
