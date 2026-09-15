import {
  DomainForbiddenError,
  DomainValidationError,
} from '@smartsoft001/domain-core';
import { IUser } from '@smartsoft001/users';

import { assertOwner, assertPositive } from './domain-errors.example';

const owner: IUser = { username: 'owner@example.com', permissions: [] };

function catchError(action: () => void): unknown {
  try {
    action();
  } catch (error) {
    return error;
  }

  return undefined;
}

describe('docs-examples-node: domain errors', () => {
  it('should accept a positive amount', () => {
    const error = catchError(() => assertPositive(10));

    expect(error).toBeUndefined();
  });

  it('should throw a validation error for a non positive amount', () => {
    const error = catchError(() => assertPositive(0));

    expect(error).toBeInstanceOf(DomainValidationError);
  });

  it('should tag the validation error with the type the filter branches on', () => {
    const error = catchError(() => assertPositive(-1)) as DomainValidationError;

    expect(error.type).toBe(DomainValidationError);
  });

  it('should accept the owner of the resource', () => {
    const error = catchError(() => assertOwner(owner, 'owner@example.com'));

    expect(error).toBeUndefined();
  });

  it('should throw a forbidden error for anybody else', () => {
    const error = catchError(() =>
      assertOwner(owner, 'somebody@example.com'),
    ) as DomainForbiddenError;

    expect(error).toBeInstanceOf(DomainForbiddenError);
    expect(error.type).toBe(DomainForbiddenError);
  });
});
