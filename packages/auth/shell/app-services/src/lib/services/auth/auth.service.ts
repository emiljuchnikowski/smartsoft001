import { Injectable, Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Request } from 'express';

import {
  AUTH_TOKEN_PAYLOAD_PROVIDER,
  AUTH_TOKEN_USER_PROVIDER,
  AUTH_TOKEN_VALIDATION_PROVIDER,
  IAuthToken,
  IAuthTokenRequest,
  ITokenPayloadProvider,
  ITokenUserProvider,
  ITokenValidationProvider,
  TokenFactory,
} from '@smartsoft001/auth-domain';

@Injectable()
export class AuthService {
  constructor(
    private factory: TokenFactory,
    private moduleRef: ModuleRef,
  ) {}

  create(req: IAuthTokenRequest, httpReq?: Request): Promise<IAuthToken> {
    return this.factory.create({
      httpReq: httpReq,
      request: req,
      payloadProvider: this.getProvider<ITokenPayloadProvider>(
        AUTH_TOKEN_PAYLOAD_PROVIDER,
      ),
      validationProvider: this.getProvider<ITokenValidationProvider>(
        AUTH_TOKEN_VALIDATION_PROVIDER,
      ),
      userProvider: this.getProvider<ITokenUserProvider>(
        AUTH_TOKEN_USER_PROVIDER,
      ),
    });
  }

  /**
   * The providers are optional extension points: a host that does not
   * register one gets the factory's built-in behaviour, so "not found" is
   * `undefined`, not an error.
   */
  private getProvider<T>(token: string): T | undefined {
    try {
      return this.moduleRef.get<T>(token, { strict: false });
    } catch (e) {
      Logger.debug(
        e instanceof Error ? e.message : String(e),
        AuthService.name,
      );
    }
    return undefined;
  }
}
