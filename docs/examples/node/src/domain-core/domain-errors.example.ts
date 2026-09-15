// #region usage
import {
  DomainForbiddenError,
  DomainValidationError,
} from '@smartsoft001/domain-core';
import { IUser } from '@smartsoft001/users';

/** Rejects a non positive amount. The NestJS filter maps this to HTTP 400. */
export function assertPositive(amount: number): void {
  if (amount <= 0) {
    throw new DomainValidationError('Amount has to be greater than zero');
  }
}

/**
 * Rejects a user that does not own the resource, identified by the username
 * stored on it. The NestJS filter maps this to HTTP 403.
 */
export function assertOwner(user: IUser, ownerId: string): void {
  if (user.username !== ownerId) {
    throw new DomainForbiddenError('Only the owner can change this resource');
  }
}
// #endregion
