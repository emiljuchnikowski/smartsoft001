// #region usage
import { ModuleRef } from '@nestjs/core';
import { Request } from 'express';

import {
  IAuthToken,
  IAuthTokenRequest,
  TokenFactory,
} from '@smartsoft001/auth-domain';
import { AuthService } from '@smartsoft001/auth-shell-app-services';

/**
 * `AuthService` looks three optional extension points up in the injector:
 * `AUTH_TOKEN_PAYLOAD_PROVIDER`, `AUTH_TOKEN_VALIDATION_PROVIDER` and
 * `AUTH_TOKEN_USER_PROVIDER`. The lookup is `moduleRef.get(token, { strict:
 * false })`, so a provider registered anywhere in the application is found.
 *
 * This stub answers only for the tokens it was handed and throws for the rest,
 * which is what Nest does for an unregistered provider. `AuthService` catches
 * that error, logs it at debug level and passes `null` on instead, so an
 * application that registers none of the three still issues tokens.
 */
export function createModuleRef(
  providers: Record<string, unknown> = {},
): ModuleRef {
  return {
    get: (token: string): unknown => {
      if (token in providers) {
        return providers[token];
      }

      throw new Error(`Nest could not find ${token} element`);
    },
  } as unknown as ModuleRef;
}

/**
 * In an application both collaborators are injected by
 * `AuthShellNestjsModule.forRoot(...)`; here they are passed by hand so the
 * example stays offline.
 */
export function createAuthService(
  factory: TokenFactory,
  moduleRef: ModuleRef,
): AuthService {
  return new AuthService(factory, moduleRef);
}

/**
 * The single entry point of the service. `TokenController` calls exactly this
 * on `POST /token`, forwarding the Express request so that a payload or user
 * provider can read headers from it.
 */
export function requestToken(
  service: AuthService,
  request: IAuthTokenRequest,
  httpReq?: Request,
): Promise<IAuthToken> {
  return service.create(request, httpReq);
}
// #endregion
