import { Injectable } from '@nestjs/common';
import { DomainForbiddenError } from '@smartsoft001/domain-core';
import { IUser } from '@smartsoft001/users';

import { PermissionType, SharedConfig } from '../shared.config';

/**
 * Service to handle permission validation for users.
 *
 * @class PermissionService
 */
@Injectable()
export class PermissionService {
  constructor(private config: SharedConfig) {}

  /**
   * Validates if the user has the required permissions for a given type.
   * @param {PermissionType} type - The type of permission to validate.
   * @param {IUser} user - The user object containing permissions.
   * @throws {DomainForbiddenError} If the user does not have the required permissions.
   */
  valid(type: PermissionType, user: IUser): void {
    if (!this.config.permissions) return;

    const typeConfig = this.config.permissions[type];

    if (!typeConfig) return;

    if (!user.permissions) throw new DomainForbiddenError(`Context forbidden`);

    if (!typeConfig.some((tc) => user.permissions.some((up) => tc === up)))
      throw new DomainForbiddenError(`Context forbidden`);
  }
}
