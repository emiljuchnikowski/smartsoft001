import { Logger } from '@nestjs/common';
import { throwError } from 'rxjs';

import { PayuService } from './payu.service';

describe('payu: token error confidentiality', () => {
  afterEach(() => jest.restoreAllMocks());

  it('does not log or propagate credential-bearing HTTP errors', async () => {
    const secret = 'synthetic-private-secret';
    const error = Object.assign(new Error(secret), {
      config: {
        data: `client_secret=${secret}`,
        headers: { Authorization: `Bearer ${secret}` },
      },
    });
    const log = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    const logger = jest
      .spyOn(Logger, 'error')
      .mockImplementation(() => undefined);
    const config = {
      clientId: 'audit',
      clientSecret: secret,
      test: true,
      posId: 'test',
      notifyUrl: '',
      continueUrl: '',
    };
    const service = new PayuService(
      { post: () => throwError(() => error) } as any,
      config,
      { get: () => ({ get: async () => config }) } as any,
    );
    let caught: unknown;
    try {
      await service.create({
        id: 'audit',
        name: 'audit',
        amount: 100,
        clientIp: '127.0.0.1',
        data: {},
      });
    } catch (failure) {
      caught = failure;
    }
    expect(caught).toBeInstanceOf(Error);
    expect((caught as Error).message).toBe('PayU authentication failed');
    expect(caught).not.toBe(error);
    expect(caught).not.toHaveProperty('cause');
    expect(
      JSON.stringify([log.mock.calls, logger.mock.calls, caught]),
    ).not.toContain(secret);
  });
});
