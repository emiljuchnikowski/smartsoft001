import {Injectable, Logger} from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { Request } from "express";

import {
  AUTH_TOKEN_PAYLOAD_PROVIDER, AUTH_TOKEN_USER_PROVIDER,
  AUTH_TOKEN_VALIDATION_PROVIDER,
  IAuthToken,
  IAuthTokenRequest,
  ITokenPayloadProvider, ITokenUserProvider,
  ITokenValidationProvider,
  TokenFactory,
} from "@smartsoft001/auth-domain";

@Injectable()
export class AuthService {
  constructor(
      private factory: TokenFactory,
      private moduleRef: ModuleRef
  ) {}

    create(req: IAuthTokenRequest, httpReq?: Request): Promise<IAuthToken> {
    return this.factory.create({
      httpReq: httpReq,
      request: req,
      payloadProvider: this.getPayloadProvider(),
      validationProvider: this.getValidationProvider(),
      userProvider: this.getUserProvider()
    }) as Promise<IAuthToken>;
  }

  private getPayloadProvider(): ITokenPayloadProvider {
    try {
      return this.moduleRef.get(AUTH_TOKEN_PAYLOAD_PROVIDER, {
        strict: false,
      });
    } catch (e) {
      Logger.debug(e.message, AuthService.name);
    }
    return null;
  }

  private getValidationProvider(): ITokenValidationProvider {
    try {
      return this.moduleRef.get(AUTH_TOKEN_VALIDATION_PROVIDER, {
        strict: false,
      });
    } catch (e) {
      Logger.debug(e.message, AuthService.name);
    }
    return null;
  }

  private getUserProvider(): ITokenUserProvider {
    try {
      return this.moduleRef.get(AUTH_TOKEN_USER_PROVIDER, {
        strict: false,
      });
    } catch (e) {
      Logger.debug(e.message, AuthService.name);
    }
    return null;
  }
}
