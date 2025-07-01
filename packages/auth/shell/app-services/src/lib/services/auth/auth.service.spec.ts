import { Test, TestingModule } from '@nestjs/testing';
import { ModuleRef } from '@nestjs/core';
import { Request } from 'express';
import {
  AUTH_TOKEN_PAYLOAD_PROVIDER,
  AUTH_TOKEN_USER_PROVIDER,
  AUTH_TOKEN_VALIDATION_PROVIDER,
  IAuthToken,
  TokenFactory
} from '@smartsoft001/auth-domain';

import { AuthService } from './auth.service';

describe('auth-shell-app-services: AuthService', () => {
  let service: AuthService;
  let moduleRef: ModuleRef;
  let tokenFactory: TokenFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: TokenFactory,
          useValue: {
            create: jest.fn()
          }
        },
        {
          provide: ModuleRef,
          useValue: {
            get: jest.fn()
          }
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    moduleRef = module.get<ModuleRef>(ModuleRef);
    tokenFactory = module.get<TokenFactory>(TokenFactory);
  });

  describe('create', () => {
    it('should call TokenFactory.create with correct parameters when no providers are available', async () => {
      const request = { grant_type: 'password' };
      const httpReq = {} as Request;
      const expectedToken = { token_type: 'bearer' } as IAuthToken;

      (moduleRef.get as jest.Mock).mockImplementation(() => {
        throw new Error('Not found');
      });
      (tokenFactory.create as jest.Mock).mockResolvedValue(expectedToken);

      const result = await service.create(request, httpReq);

      expect(result).toEqual(expectedToken);
    });

    it('should include payload provider when available', async () => {
      const request = { grant_type: 'password' };
      const payloadProvider = { change: jest.fn() };

      (moduleRef.get as jest.Mock).mockImplementation((token) => {
        if (token === AUTH_TOKEN_PAYLOAD_PROVIDER) {
          return payloadProvider;
        }
        throw new Error('Not found');
      });

      await service.create(request);

      expect((tokenFactory.create as jest.Mock).mock.calls[0][0].payloadProvider).toBe(payloadProvider);
    });

    it('should include validation provider when available', async () => {
      const request = { grant_type: 'password' };
      const validationProvider = { check: jest.fn() };

      (moduleRef.get as jest.Mock).mockImplementation((token) => {
        if (token === AUTH_TOKEN_VALIDATION_PROVIDER) {
          return validationProvider;
        }
        throw new Error('Not found');
      });

      await service.create(request);

      expect((tokenFactory.create as jest.Mock).mock.calls[0][0].validationProvider).toBe(validationProvider);
    });

    it('should include user provider when available', async () => {
      const request = { grant_type: 'password' };
      const userProvider = { get: jest.fn() };

      (moduleRef.get as jest.Mock).mockImplementation((token) => {
        if (token === AUTH_TOKEN_USER_PROVIDER) {
          return userProvider;
        }
        throw new Error('Not found');
      });

      await service.create(request);

      expect((tokenFactory.create as jest.Mock).mock.calls[0][0].userProvider).toBe(userProvider);
    });
  });
});
