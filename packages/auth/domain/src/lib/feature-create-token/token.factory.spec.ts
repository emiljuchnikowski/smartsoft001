import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DomainValidationError } from '@smartsoft001/domain-core';
import { FbService } from '@smartsoft001/fb';
import { GoogleService } from '@smartsoft001/google';
import { PasswordService } from '@smartsoft001/utils';

import { User } from '../entities';
import { TokenConfig } from './token.config';
import { TokenFactory } from './token.factory';

describe('auth-domain: TokenFactory', () => {
  let tokenFactory: TokenFactory;
  let repository: Repository<User>;
  let jwtService: JwtService;
  let fbService: FbService;
  let googleService: GoogleService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TokenFactory,
        {
          provide: TokenConfig,
          useValue: {
            expiredIn: 3600,
            clients: ['test-client'],
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: FbService,
          useValue: {
            getUserId: jest.fn(),
          },
        },
        {
          provide: GoogleService,
          useValue: {
            getUserId: jest.fn(),
          },
        },
      ],
    }).compile();

    tokenFactory = module.get<TokenFactory>(TokenFactory);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
    fbService = module.get<FbService>(FbService);
    googleService = module.get<GoogleService>(GoogleService);
  });

  describe('getQuery', () => {
    it('should return query for password grant type', () => {
      const query = TokenFactory.getQuery({
        grant_type: 'password',
        username: 'test',
      });
      expect(query).toEqual({ username: 'test' });
    });

    it('should return query for refresh_token grant type', () => {
      const query = TokenFactory.getQuery({
        grant_type: 'refresh_token',
        refresh_token: 'token',
      });
      expect(query).toEqual({ authRefreshToken: 'token' });
    });

    it('should return query for fb grant type', () => {
      const query = TokenFactory.getQuery({
        grant_type: 'fb',
        fb_user_id: 'fb123',
      });
      expect(query).toEqual({ facebookUserId: 'fb123' });
    });

    it('should return query for google grant type', () => {
      const query = TokenFactory.getQuery({
        grant_type: 'google',
        google_user_id: 'g123',
      });
      expect(query).toEqual({ googleUserId: 'g123' });
    });

    it('should throw error for invalid grant type', () => {
      expect(() => TokenFactory.getQuery({ grant_type: 'invalid' })).toThrow(
        DomainValidationError,
      );
    });
  });

  describe('checkDisabled', () => {
    it('should throw error when user is disabled', () => {
      const user = { disabled: true } as User;
      expect(() => TokenFactory.checkDisabled(user)).toThrow(
        DomainValidationError,
      );
    });
  });

  describe('create', () => {
    beforeEach(() => {
      jest.spyOn(PasswordService, 'compare').mockResolvedValue(true);
    });

    it('should create token for valid password credentials', async () => {
      const user = { username: 'test', permissions: ['read'] };
      (repository.findOne as jest.Mock).mockResolvedValue(user);
      (jwtService.sign as jest.Mock).mockReturnValue('signed-token');

      const result = await tokenFactory.create({
        request: {
          grant_type: 'password',
          username: 'test',
          password: 'test',
          client_id: 'test-client',
        },
      });

      expect(result.token_type).toBe('bearer');
    });

    it('should create token for valid fb credentials', async () => {
      const user = { username: 'fb-user', permissions: ['read'] };
      (fbService.getUserId as jest.Mock).mockResolvedValue('fb123');
      (repository.findOne as jest.Mock).mockResolvedValue(user);
      (jwtService.sign as jest.Mock).mockReturnValue('signed-token');

      const result = await tokenFactory.create({
        request: {
          grant_type: 'fb',
          fb_token: 'token',
        },
      });

      expect(result.token_type).toBe('bearer');
    });

    it('should create token for valid google credentials', async () => {
      const user = { username: 'google-user', permissions: ['read'] };
      (googleService.getUserId as jest.Mock).mockResolvedValue('g123');
      (repository.findOne as jest.Mock).mockResolvedValue(user);
      (jwtService.sign as jest.Mock).mockReturnValue('signed-token');

      const result = await tokenFactory.create({
        request: {
          grant_type: 'google',
          google_token: 'token',
        },
      });

      expect(result.token_type).toBe('bearer');
    });

    it('should throw error for invalid request', async () => {
      await expect(
        tokenFactory.create({
          request: {} as any,
        }),
      ).rejects.toThrow(DomainValidationError);
    });

    it('should throw error when user is not found', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        tokenFactory.create({
          request: {
            grant_type: 'password',
            username: 'test',
            password: 'test',
            client_id: 'test-client',
          },
        }),
      ).rejects.toThrow(DomainValidationError);
    });
  });
});
