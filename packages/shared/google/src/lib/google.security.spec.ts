import { of } from 'rxjs';

import { GoogleService } from './google.service';

describe('google: access token client binding', () => {
  const good = {
    user_id: 'user',
    audience: 'trusted',
    issued_to: 'trusted',
    expires_in: 60,
  };
  it.each([
    { audience: 'other' },
    { issued_to: 'other' },
    { expires_in: 0 },
    { expires_in: -1 },
    { expires_in: Infinity },
    { user_id: '' },
  ])('rejects invalid token metadata: %j', async (patch) => {
    const service = new GoogleService({
      get: () => of({ data: { ...good, ...patch } }),
    } as any);
    await expect(
      service.getUserId('synthetic-token', ['trusted']),
    ).rejects.toThrow('Invalid Google token');
  });
  it('fails closed with no configured client before making a request', async () => {
    const get = jest.fn();
    await expect(
      new GoogleService({ get } as any).getUserId('synthetic-token', []),
    ).rejects.toThrow();
    expect(get).not.toHaveBeenCalled();
  });
  it('requires the allowlist at compile time', async () => {
    const service = new GoogleService({ get: jest.fn() } as any);
    // @ts-expect-error clientIds is a required parameter
    await expect(service.getUserId('synthetic-token')).rejects.toThrow();
    // @ts-expect-error clientIds is a required parameter
    await expect(service.getData('synthetic-token')).rejects.toThrow();
  });
  it('accepts trusted metadata and encodes the token as one URL parameter', async () => {
    const get = jest.fn(() => of({ data: good }));
    expect(
      await new GoogleService({ get } as any).getUserId(
        'synthetic&token=value',
        ['trusted'],
      ),
    ).toBe('user');
    expect(get).toHaveBeenCalledWith(
      'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=synthetic%26token%3Dvalue',
    );
  });
});
