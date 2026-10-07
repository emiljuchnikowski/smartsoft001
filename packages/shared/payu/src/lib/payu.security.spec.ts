import { Logger } from '@nestjs/common';
import { of, throwError } from 'rxjs';

import { PayuService } from './payu.service';

const secret = 'synthetic-private-secret';

const config = {
  clientId: 'audit',
  clientSecret: secret,
  test: true,
  posId: 'test',
  notifyUrl: '',
  continueUrl: '',
};

const trans = {
  data: {},
  history: [{ status: 'started', data: { orderId: 'order-1' } }],
} as any;

function httpError(status?: number): Error {
  return Object.assign(new Error(secret), {
    config: {
      data: `client_secret=${secret}`,
      headers: { Authorization: `Bearer ${secret}` },
    },
    ...(status ? { response: { status, data: { secret } } } : {}),
  });
}

function createService(http: { post?: jest.Mock; get?: jest.Mock }) {
  return new PayuService(http as any, config, {
    get: () => ({ get: async () => config }),
  } as any);
}

function createOrder(service: PayuService) {
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

describe('payu: credential confidentiality of failures', () => {
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
    expect(caught).not.toHaveProperty('response');
    expect(
      JSON.stringify([log.mock.calls, logger.mock.calls, caught]),
    ).not.toContain(secret);
    expect((caught as Error).message).not.toContain(secret);
  }

  it('does not log or propagate credential-bearing token errors', async () => {
    const error = httpError();
    const service = createService({
      post: jest.fn(() => throwError(() => error)),
    });

    const caught = await catchFailure(() => createOrder(service));

    expect((caught as Error).message).toBe('PayU authentication failed');
    expectNoSecretIn(caught, error);
  });

  it('keeps the HTTP status of a failed authentication', async () => {
    const error = httpError(401);
    const service = createService({
      post: jest.fn(() => throwError(() => error)),
    });

    const caught = await catchFailure(() => createOrder(service));

    expect((caught as Error).message).toBe(
      'PayU authentication failed (HTTP 401)',
    );
    expect(logger).toHaveBeenCalledWith(
      'PayU authentication failed (HTTP 401)',
      'PayuService',
    );
    expectNoSecretIn(caught, error);
  });

  it('does not log or propagate the bearer token of a failed order', async () => {
    const error = httpError(500);
    const service = createService({
      post: jest
        .fn()
        .mockReturnValueOnce(of({ data: { access_token: secret } }))
        .mockReturnValueOnce(throwError(() => error)),
    });

    const caught = await catchFailure(() => createOrder(service));

    expect((caught as Error).message).toBe(
      'PayU order creation failed (HTTP 500)',
    );
    expect(log).not.toHaveBeenCalled();
    expectNoSecretIn(caught, error);
  });

  it('does not propagate the bearer token of a failed status lookup', async () => {
    const error = httpError(503);
    const service = createService({
      post: jest.fn(() => of({ data: { access_token: secret } })),
      get: jest.fn(() => throwError(() => error)),
    });

    const caught = await catchFailure(() => service.getStatus(trans));

    expect((caught as Error).message).toBe(
      'PayU status lookup failed (HTTP 503)',
    );
    expectNoSecretIn(caught, error);
  });

  it('does not propagate the bearer token of a failed refund', async () => {
    const error = httpError(400);
    const service = createService({
      post: jest
        .fn()
        .mockReturnValueOnce(of({ data: { access_token: secret } }))
        .mockReturnValueOnce(throwError(() => error)),
    });

    const caught = await catchFailure(() => service.refund(trans, 'audit'));

    expect((caught as Error).message).toBe('PayU refund failed (HTTP 400)');
    expectNoSecretIn(caught, error);
  });
});
