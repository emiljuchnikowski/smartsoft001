import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Guid } from 'guid-typescript';
import { Request } from 'express';

import { DomainValidationError, IFactory } from '@smartsoft001/domain-core';
import { PasswordService } from '@smartsoft001/utils';
import { FbService } from '@smartsoft001/fb';
import { GoogleService } from '@smartsoft001/google';

import { User } from '../entities';
import { TokenConfig } from './token.config';
import { IAuthToken, IAuthTokenRequest } from './interfaces';
import { ITokenPayloadProvider } from './token-payload.provider';
import { ITokenValidationProvider } from './token-validation.provider';
import { ITokenUserProvider } from './token-user.provider';

@Injectable()
export class TokenFactory
  implements
    IFactory<
      IAuthToken,
      {
        httpReq?: Request;
        request: IAuthTokenRequest;
        payloadProvider?: ITokenPayloadProvider;
        validationProvider?: ITokenValidationProvider;
        userProvider?: ITokenUserProvider;
      }
    >
{
  private _invalidUsernameOrPasswordMessage = 'Invalid username or password';

  constructor(
    private config: TokenConfig,
    @InjectRepository(User) private repository: Repository<User>,
    private jwtService: JwtService,
    private fbService: FbService,
    private googleService: GoogleService,
  ) {}

  static getQuery(
    config: IAuthTokenRequest,
    customProvider = false,
  ): Partial<User> {
    switch (config.grant_type) {
      case 'fb':
        return { facebookUserId: config.fb_user_id };
      case 'google':
        return { googleUserId: config.google_user_id };
      case 'password':
        return { username: config.username };
      case 'refresh_token':
        return { authRefreshToken: config.refresh_token };
      default:
        if (!customProvider) {
          throw new DomainValidationError('Invalid grand type');
        }
        return null;
    }
  }

  static checkDisabled(user: User) {
    if (user.disabled) throw new DomainValidationError('user disabled');
  }

  async create(options: {
    httpReq?: Request;
    request: IAuthTokenRequest;
    payloadProvider?: ITokenPayloadProvider;
    validationProvider?: ITokenValidationProvider;
    userProvider?: ITokenUserProvider;
  }): Promise<IAuthToken> {
    if (options.request.grant_type === 'fb') {
      options.request.fb_user_id = await this.fbService.getUserId(
        options.request.fb_token,
      );
    }

    if (options.request.grant_type === 'google') {
      options.request.google_user_id = await this.googleService.getUserId(
        options.request.google_token,
      );
    }

    this.valid(options.request);

    const query = TokenFactory.getQuery(
      options.request,
      !!options.userProvider,
    );

    const user = options.userProvider
      ? await options.userProvider.get(query, options.request, options.httpReq)
      : await this.repository.findOne(query as any);

    if (!options.validationProvider || !options.validationProvider.replace) {
      this.checkUser(options.request, user);
      TokenFactory.checkDisabled(user);
      await this.checkPassword(options.request, user);
    }

    if (options.validationProvider) {
      await options.validationProvider.check({
        request: options.request,
        user,
      });
    }

    const refreshToken = Guid.raw();
    await this.repository.update(
      {
        ...query,
        disabled: { $ne: true },
      } as any,
      {
        lastLoginDate: new Date(),
        authRefreshToken: refreshToken,
      },
    );

    const payload = {
      permissions: user.permissions,
      scope: options.request.scope,
    };

    if (options.payloadProvider) {
      await options.payloadProvider.change(payload, {
        user,
        request: options.request,
        httpReq: options.httpReq,
      });
    }

    return {
      expired_in: this.config.expiredIn,
      token_type: 'bearer',
      access_token: this.jwtService.sign(payload, {
        expiresIn: this.config.expiredIn,
        subject: user.username,
      }),
      refresh_token: refreshToken,
      username: user.username,
    };
  }

  private checkUser(config: IAuthTokenRequest, user: User): void {
    if (!user)
      throw new DomainValidationError(
        config.grant_type === 'password'
          ? this._invalidUsernameOrPasswordMessage
          : 'Invalid token',
      );
  }

  private async checkPassword(
    config: IAuthTokenRequest,
    user: User,
  ): Promise<void> {
    if (
      config.grant_type === 'password' &&
      !(await PasswordService.compare(config.password, user.password))
    )
      throw new DomainValidationError(this._invalidUsernameOrPasswordMessage);
  }

  private valid(req: NonNullable<IAuthTokenRequest>): void {
    if (!req) throw new DomainValidationError('config is empty');
    if (!req.grant_type) throw new DomainValidationError('grant_type is empty');

    // password
    if (req.grant_type === 'password') {
      if (!req.username) throw new DomainValidationError('username is empty');
      if (!req.password) throw new DomainValidationError('password is empty');
      if (!req.client_id) throw new DomainValidationError('client_id is empty');
      if (!this.config.clients.some((c) => c === req.client_id))
        throw new DomainValidationError('client_id is incorrect');

      // refres token
    } else if (req.grant_type === 'refresh_token') {
      if (!req.refresh_token)
        throw new DomainValidationError('refresh_token is empty');

      // fb token
    } else if (req.grant_type === 'fb') {
      if (!req.fb_token) throw new DomainValidationError('fb_token is empty');

      if (!req.fb_user_id)
        throw new DomainValidationError('fb_user_id is empty');
    } else if (req.grant_type === 'google') {
      if (!req.google_token)
        throw new DomainValidationError('google_token is empty');

      if (!req.google_user_id)
        throw new DomainValidationError('google_user_id is empty');
    }
  }
}
