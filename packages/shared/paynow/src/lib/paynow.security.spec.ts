import { Logger } from '@nestjs/common';
import { throwError } from 'rxjs';

import { PaynowService } from './paynow.service';

const apiKey = 'synthetic-paynow-api-key';
const apiSignatureKey = 'synthetic-paynow-signature-key';

const config = {
  apiKey,
  apiSignatureKey,
  continueUrl: 'https://app.example.com/thank-you',
  test: true,
};

const trans = {
  amount: 100,
  data: {},
  history: [{ status: 'started', data: { orderId: 'payment-1' } }],
} as any;

function httpError(status?: number): Error {
  return Object.assign(new Error(`Api-Key: ${apiKey}`), {
    config: {
      headers: { 'Api-Key': apiKey },
      data: JSON.stringify({ apiSignatureKey }),
    },
    request: { _header: `Api-Key: ${apiKey}` },
    ...(status ? { response: { status, data: { apiKey } } } : {}),
  });
}

function createService(http: { post?: jest.Mock; get?: jest.Mock }) {
  return new PaynowService(http as any, config, {
    get: () => ({ get: async () => config }),
  } as any);
}

function createPayment(service: PaynowService) {
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

describe('paynow: credential confidentiality of failures', () => {
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

    const everything = JSON.stringify([
      log.mock.calls,
      logger.mock.calls,
      caught,
      (caught as Error).message,
      (caught as Error).stack,
    ]);
    expect(everything).not.toContain(apiKey);
    expect(everything).not.toContain(apiSignatureKey);
  }

  it('does not log or propagate the api key of a failed payment creation', async () => {
    const error = httpError(401);
    const service = createService({
      post: jest.fn(() => throwError(() => error)),
    });

    const caught = await catchFailure(() => createPayment(service));

    expect((caught as Error).message).toBe(
      'Paynow payment creation failed (HTTP 401)',
    );
    expect(logger).toHaveBeenCalledWith(
      'Paynow payment creation failed (HTTP 401)',
      'PaynowService',
    );
    expect(log).not.toHaveBeenCalled();
    expectNoSecretIn(caught, error);
  });

  it('ends the message at "failed" when Paynow did not answer', async () => {
    const error = httpError();
    const service = createService({
      post: jest.fn(() => throwError(() => error)),
    });

    const caught = await catchFailure(() => createPayment(service));

    expect((caught as Error).message).toBe('Paynow payment creation failed');
    expectNoSecretIn(caught, error);
  });

  it('does not log or propagate the api key of a failed status lookup', async () => {
    const error = httpError(503);
    const service = createService({
      get: jest.fn(() => throwError(() => error)),
    });

    const caught = await catchFailure(() => service.getStatus(trans));

    expect((caught as Error).message).toBe(
      'Paynow status lookup failed (HTTP 503)',
    );
    expect(logger).toHaveBeenCalledWith(
      'Paynow status lookup failed (HTTP 503)',
      'PaynowService',
    );
    expectNoSecretIn(caught, error);
  });

  it('does not log or propagate the api key of a failed refund', async () => {
    const error = httpError(400);
    const service = createService({
      post: jest.fn(() => throwError(() => error)),
    });

    const caught = await catchFailure(() => service.refund(trans, 'audit'));

    expect((caught as Error).message).toBe('Paynow refund failed (HTTP 400)');
    expect(logger).toHaveBeenCalledWith(
      'Paynow refund failed (HTTP 400)',
      'PaynowService',
    );
    expectNoSecretIn(caught, error);
  });
});
