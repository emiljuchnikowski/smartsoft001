import { UnauthorizedException } from '@nestjs/common';
import { of, throwError } from 'rxjs';

import { createHmac } from 'node:crypto';

import { IFbAppCredentials, FbService } from './fb.service';

describe('fb: access token app binding', () => {
  const credentials: IFbAppCredentials = {
    appId: 'trusted',
    appSecret: 'app-secret',
  };
  const debug = { is_valid: true, app_id: 'trusted', user_id: 'user' };
  const debugUrl = (token: string) =>
    'https://graph.facebook.com/debug_token?input_token=' +
    encodeURIComponent(token) +
    '&access_token=trusted%7Capp-secret';

  const serviceAnswering = (...answers: unknown[]) => {
    const get = jest.fn();
    answers.forEach((data) => get.mockReturnValueOnce(of({ data })));
    return { get, service: new FbService({ get } as any) };
  };

  it.each([
    { is_valid: false },
    { is_valid: 'true' },
    { app_id: 'other' },
    { app_id: undefined },
    { user_id: '' },
    { user_id: 42 },
  ])('rejects invalid debug_token metadata: %j', async (patch) => {
    const { service } = serviceAnswering({ data: { ...debug, ...patch } });

    await expect(
      service.getUserId('synthetic-token', ['trusted'], credentials),
    ).rejects.toThrow('Invalid Facebook token');
  });

  it('rejects a debug_token answer without data', async () => {
    const { service } = serviceAnswering({});

    await expect(
      service.getUserId('synthetic-token', ['trusted'], credentials),
    ).rejects.toThrow('Invalid Facebook token');
  });

  it.each([
    ['no allowed app', [], credentials],
    ['no app id', ['trusted'], { ...credentials, appId: '' }],
    ['no app secret', ['trusted'], { ...credentials, appSecret: '' }],
  ] as const)(
    'fails closed with %s before making a request',
    async (_, appIds, creds) => {
      const { get, service } = serviceAnswering();

      await expect(
        service.getUserId('synthetic-token', appIds, creds),
      ).rejects.toThrow('Invalid Facebook token or app configuration');
      expect(get).not.toHaveBeenCalled();
    },
  );

  it.each(['', 'x'.repeat(8193)])(
    'rejects an empty or oversized token before making a request',
    async (token) => {
      const { get, service } = serviceAnswering();

      await expect(
        service.getUserId(token, ['trusted'], credentials),
      ).rejects.toBeInstanceOf(UnauthorizedException);
      expect(get).not.toHaveBeenCalled();
    },
  );

  it('requires the allowlist and the credentials at compile time', async () => {
    const service = new FbService({ get: jest.fn() } as any);

    // @ts-expect-error appIds and credentials are required parameters
    await expect(service.getUserId('synthetic-token')).rejects.toThrow();
    const withoutCredentials = () =>
      // @ts-expect-error credentials is a required parameter
      service.getData('synthetic-token', ['trusted']);
    await expect(withoutCredentials()).rejects.toThrow();
  });

  it('verifies with debug_token and encodes the token as one URL parameter', async () => {
    const { get, service } = serviceAnswering({ data: debug });

    const result = await service.getUserId(
      'synthetic&input_token=value',
      ['trusted'],
      credentials,
    );

    expect(result).toBe('user');
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith(debugUrl('synthetic&input_token=value'));
  });

  it('accepts a token of any app in the allowlist', async () => {
    const { service } = serviceAnswering({
      data: { ...debug, app_id: 'second' },
    });

    await expect(
      service.getUserId('synthetic-token', ['trusted', 'second'], credentials),
    ).resolves.toBe('user');
  });

  it('hides HTTP errors, which carry the token and the app secret', async () => {
    const get = jest.fn(() =>
      throwError(
        () => new Error('GET ' + debugUrl('synthetic-token') + ' failed'),
      ),
    );
    const service = new FbService({ get } as any);

    const error = await service
      .getUserId('synthetic-token', ['trusted'], credentials)
      .catch((e: unknown) => e);

    expect(error).toBeInstanceOf(UnauthorizedException);
    expect(String((error as Error).message)).toBe('Invalid Facebook token');
    expect(JSON.stringify(error)).not.toContain('synthetic-token');
    expect(JSON.stringify(error)).not.toContain('app-secret');
  });

  describe('getData', () => {
    it('reads the profile only after debug_token, with the token encoded', async () => {
      const { get, service } = serviceAnswering(
        { data: debug },
        { id: 'user', email: 'user@example.com' },
      );

      const result = await service.getData(
        'synthetic&token',
        ['trusted'],
        credentials,
      );

      expect(result).toEqual({ id: 'user', email: 'user@example.com' });
      expect(get.mock.calls).toEqual([
        [debugUrl('synthetic&token')],
        [
          'https://graph.facebook.com/me?fields=email,id&access_token=synthetic%26token' +
            // Of the raw token, not the encoded one.
            `&appsecret_proof=${createHmac('sha256', 'app-secret').update('synthetic&token').digest('hex')}`,
        ],
      ]);
    });

    it('does not read the profile of a token issued to another app', async () => {
      const { get, service } = serviceAnswering({
        data: { ...debug, app_id: 'other' },
      });

      await expect(
        service.getData('synthetic-token', ['trusted'], credentials),
      ).rejects.toThrow('Invalid Facebook token');
      expect(get).toHaveBeenCalledTimes(1);
    });

    it('rejects a profile that belongs to another user', async () => {
      const { service } = serviceAnswering(
        { data: debug },
        { id: 'someone-else', email: 'x@example.com' },
      );

      await expect(
        service.getData('synthetic-token', ['trusted'], credentials),
      ).rejects.toThrow('Invalid Facebook token');
    });

    it('hides HTTP errors of the profile call', async () => {
      const get = jest
        .fn()
        .mockReturnValueOnce(of({ data: { data: debug } }))
        .mockReturnValueOnce(
          throwError(() => new Error('GET ...access_token=synthetic-token')),
        );
      const service = new FbService({ get } as any);

      const error = await service
        .getData('synthetic-token', ['trusted'], credentials)
        .catch((e: unknown) => e);

      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(JSON.stringify(error)).not.toContain('synthetic-token');
    });

    it('hides the app secret and the proof when the profile call fails', async () => {
      const get = jest
        .fn()
        .mockReturnValueOnce(of({ data: { data: debug } }))
        .mockImplementationOnce((url: string) =>
          throwError(() => new Error('GET ' + url + ' failed')),
        );
      const service = new FbService({ get } as any);

      const error = await service
        .getData('synthetic-token', ['trusted'], credentials)
        .catch((e: unknown) => e);

      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(JSON.stringify(error)).not.toContain('app-secret');
      expect(JSON.stringify(error)).not.toContain('appsecret_proof');
    });
  });
});
