import { HttpException } from '@nestjs/common';

import { DomainValidationError } from '@smartsoft001/domain-core';

import { Trans } from './entities';
import { TransBaseService } from './trans.service';

class TestTransService extends TransBaseService<unknown> {
  constructor(repository: { update: jest.Mock }) {
    super(repository as any);
  }

  fail(trans: Trans<unknown>, error: unknown, context?: string) {
    return this.setError(trans, error, context);
  }
}

const secret = 'synthetic-private-secret';

function newTrans(): Trans<unknown> {
  return { id: 'trans-1', status: 'new', history: [] } as any;
}

function lastEntry(trans: Trans<unknown>) {
  return trans.history[trans.history.length - 1];
}

describe('trans-domain: TransBaseService.setError', () => {
  let repository: { update: jest.Mock };
  let service: TestTransService;

  beforeEach(() => {
    repository = { update: jest.fn(async () => undefined) };
    service = new TestTransService(repository);
  });

  it('should mark the transaction as failed and persist it', async () => {
    const trans = newTrans();

    await service.fail(trans, new Error('boom'));

    expect(trans.status).toBe('error');
    expect(lastEntry(trans).status).toBe('error');
    expect(repository.update).toHaveBeenCalledWith(trans, null);
  });

  it('should keep the name and message of a domain validation error', async () => {
    const trans = newTrans();

    await service.fail(trans, new DomainValidationError('amount is empty'));

    expect(lastEntry(trans).data).toEqual({
      name: 'DomainValidationError',
      message: 'amount is empty',
    });
  });

  it('should keep only the name and HTTP status of an axios error', async () => {
    const trans = newTrans();
    const error = Object.assign(new Error(`Bearer ${secret}`), {
      name: 'AxiosError',
      config: { headers: { Authorization: `Bearer ${secret}` } },
      response: { status: 502, data: { secret } },
    });

    await service.fail(trans, error, 'Transaction refund failed');

    expect(lastEntry(trans).data).toEqual({
      name: 'AxiosError',
      message: 'Transaction refund failed (HTTP 502)',
      status: 502,
    });
  });

  it('should read the status of a Nest HTTP exception', async () => {
    const trans = newTrans();

    await service.fail(trans, new HttpException(secret, 409));

    expect(lastEntry(trans).data).toEqual({
      name: 'HttpException',
      message: 'Transaction failed (HTTP 409)',
      status: 409,
    });
  });

  it('should not store the message of an unknown error', async () => {
    const trans = newTrans();

    await service.fail(trans, new TypeError(secret));

    expect(lastEntry(trans).data).toEqual({
      name: 'TypeError',
      message: 'Transaction failed',
    });
  });

  it('should not throw on a circular error carrying functions', async () => {
    const trans = newTrans();
    const error: any = new Error(secret);
    error.request = { socket: { destroy: () => undefined } };
    error.request.self = error.request;
    error.config = { transformRequest: [() => secret] };

    await service.fail(trans, error);

    expect(JSON.stringify(trans.history)).not.toContain(secret);
  });

  it('should accept a value that is not an Error', async () => {
    const trans = newTrans();

    await service.fail(trans, { message: secret, config: { secret } });

    expect(lastEntry(trans).data).toEqual({
      name: 'Error',
      message: 'Transaction failed',
    });
  });
});
