import { Request } from 'express';

import {
  AUTH_TOKEN_PAYLOAD_PROVIDER,
  AUTH_TOKEN_USER_PROVIDER,
  AUTH_TOKEN_VALIDATION_PROVIDER,
  IAuthToken,
  IAuthTokenRequestPassword,
  ITokenPayloadProvider,
  TokenFactory,
} from '@smartsoft001/auth-domain';

import {
  createAuthService,
  createModuleRef,
  requestToken,
} from './auth-service.example';

const request: IAuthTokenRequestPassword = {
  grant_type: 'password',
  username: 'anna',
  password: 'secret',
  client_id: 'docs-client',
};

const issued: IAuthToken = {
  access_token: 'signed.jwt',
  refresh_token: 'refresh-1',
  expired_in: 3600,
  token_type: 'bearer',
};

describe('docs-examples-node: AuthService', () => {
  it('should leave every provider that is not registered undefined', async () => {
    const factory = { create: jest.fn().mockResolvedValue(issued) };
    const httpReq = {} as Request;
    const service = createAuthService(
      factory as unknown as TokenFactory,
      createModuleRef(),
    );

    await requestToken(service, request, httpReq);

    expect(factory.create).toHaveBeenCalledWith({
      httpReq,
      request,
      payloadProvider: undefined,
      validationProvider: undefined,
      userProvider: undefined,
    });
  });
  it('should thread a registered payload provider through to the factory', async () => {
    const factory = { create: jest.fn().mockResolvedValue(issued) };
    const payloadProvider: ITokenPayloadProvider = { change: jest.fn() };
    const service = createAuthService(
      factory as unknown as TokenFactory,
      createModuleRef({ [AUTH_TOKEN_PAYLOAD_PROVIDER]: payloadProvider }),
    );

    await requestToken(service, request);

    expect(factory.create.mock.calls[0][0].payloadProvider).toBe(
      payloadProvider,
    );
  });

  it('should resolve the validation and user providers independently', async () => {
    const factory = { create: jest.fn().mockResolvedValue(issued) };
    const validationProvider = { replace: true, check: jest.fn() };
    const userProvider = { get: jest.fn() };
    const service = createAuthService(
      factory as unknown as TokenFactory,
      createModuleRef({
        [AUTH_TOKEN_VALIDATION_PROVIDER]: validationProvider,
        [AUTH_TOKEN_USER_PROVIDER]: userProvider,
      }),
    );

    await requestToken(service, request);

    expect(factory.create.mock.calls[0][0]).toEqual({
      httpReq: undefined,
      request,
      payloadProvider: undefined,
      validationProvider,
      userProvider,
    });
  });

  it('should return the token produced by the factory unchanged', async () => {
    const factory = { create: jest.fn().mockResolvedValue(issued) };
    const service = createAuthService(
      factory as unknown as TokenFactory,
      createModuleRef(),
    );

    const token = await requestToken(service, request);

    expect(token).toBe(issued);
  });
});
