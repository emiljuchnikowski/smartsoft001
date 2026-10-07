import { Logger } from '@nestjs/common';
import { throwError } from 'rxjs';

import { RevolutService } from './revolut.service';

const secret = 'synthetic-revolut-secret-key';

const config = { token: secret, test: true };

const trans = {
  data: {},
  history: [
    {
      status: 'started',
      data: { orderId: 'order-token', responseData: { id: 'order-1' } },
    },
  ],
} as any;

function httpError(status?: number): Error {
  return Object.assign(new Error(`Bearer ${secret}`), {
    config: { headers: { Authorization: `Bearer ${secret}` } },
    request: { _header: `Authorization: Bearer ${secret}` },
    ...(status ? { response: { status, data: { secret } } } : {}),
  });
}

function createService(http: { post?: jest.Mock; get?: jest.Mock }) {
  return new RevolutService(
    http as any,
    { get: () => ({ get: async () => config }) } as any,
    config,
  );
}

function createOrder(service: RevolutService) {
  return service.create({
    id: 'audit',
    name: 'audit',
    amount: 100,
    clientIp: '127.0.0.1',
    data: {},
  });
}

async function catchFailure(run: () => Promise<unknown>): Promise<unknown> {
  try {
    await run();
  } catch (failure) {
    return failure;
  }
  throw new Error('expected the call to fail');
}

describe('revolut: credential confidentiality of failures', () => {
  let log: jest.SpyInstance;
  let logger: jest.SpyInstance;

  beforeEach(() => {
    log = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    logger = jest.spyOn(Logger, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => jest.restoreAllMocks());

  function expectNoSecretIn(caught: unknown, error: Error): void {
    expect(caught).toBeInstanceOf(Error);
    expect(caught).not.toBe(error);
    expect(caught).not.toHaveProperty('cause');
    expect(caught).not.toHaveProperty('config');
    expect(caught).not.toHaveProperty('request');
    expect(caught).not.toHaveProperty('response');
    expect(
      JSON.stringify([log.mock.calls, logger.mock.calls, caught]),
    ).not.toContain(secret);
    expect((caught as Error).message).not.toContain(secret);
    expect((caught as Error).stack).not.toContain(secret);
  }

  it('does not log or propagate the secret key of a failed order', async () => {
    const error = httpError(401);
    const service = createService({
      post: jest.fn(() => throwError(() => error)),
    });

    const caught = await catchFailure(() => createOrder(service));

    expect((caught as Error).message).toBe(
      'Revolut order creation failed (HTTP 401)',
    );
    expect(logger).toHaveBeenCalledWith(
      'Revolut order creation failed (HTTP 401)',
      'RevolutService',
    );
    expect(log).not.toHaveBeenCalled();
    expectNoSecretIn(caught, error);
  });

  it('ends the message at "failed" when Revolut did not answer', async () => {
    const error = httpError();
    const service = createService({
      post: jest.fn(() => throwError(() => error)),
    });

    const caught = await catchFailure(() => createOrder(service));

    expect((caught as Error).message).toBe('Revolut order creation failed');
    expectNoSecretIn(caught, error);
  });

  it('does not log or propagate the secret key of a failed status lookup', async () => {
    const error = httpError(503);
    const service = createService({
      get: jest.fn(() => throwError(() => error)),
    });

    const caught = await catchFailure(() => service.getStatus(trans));

    expect((caught as Error).message).toBe(
      'Revolut status lookup failed (HTTP 503)',
    );
    expect(logger).toHaveBeenCalledWith(
      'Revolut status lookup failed (HTTP 503)',
      'RevolutService',
    );
    expectNoSecretIn(caught, error);
  });

  it('rejects a refund without sending, logging or exposing the key', async () => {
    const post = jest.fn();
    const get = jest.fn();
    const service = createService({ post, get });

    const caught = await catchFailure(() => service.refund(trans, 'audit'));

    expect(caught).toBe('Revolut does not support refund');
    expect(post).not.toHaveBeenCalled();
    expect(get).not.toHaveBeenCalled();
    expect(
      JSON.stringify([log.mock.calls, logger.mock.calls, caught]),
    ).not.toContain(secret);
  });
});
