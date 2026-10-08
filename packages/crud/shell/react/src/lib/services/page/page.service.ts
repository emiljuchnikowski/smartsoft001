import { getModelOptions } from '@smartsoft001/models';
import { AuthService } from '@smartsoft001/react';


import { CrudFullConfig } from '../../crud.config';

/**
 * Turns off `add`, `edit` and `remove` when the model's `create`, `update`
 * or `remove` permissions are not granted. The Angular `PageService` changed
 * the injected config in place; this returns a new config instead.
 */
export function applyPagePermissions<T>(
  config: CrudFullConfig<T>,
  authService: Pick<AuthService, 'expectPermissions'>,
): CrudFullConfig<T> {
  const val: CrudFullConfig<T> = { ...config };
  const modelOptions = getModelOptions(val.type) ?? {};

  if (
    val.add &&
    modelOptions.create &&
    modelOptions.create.permissions &&
    !authService.expectPermissions(modelOptions.create.permissions)
  ) {
    val.add = false;
  }

  if (
    val.edit &&
    modelOptions.update &&
    modelOptions.update.permissions &&
    !authService.expectPermissions(modelOptions.update.permissions)
  ) {
    val.edit = false;
  }

  if (
    val.remove &&
    modelOptions.remove &&
    modelOptions.remove.permissions &&
    !authService.expectPermissions(modelOptions.remove.permissions)
  ) {
    val.remove = false;
  }

  return val;
}
