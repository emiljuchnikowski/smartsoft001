import { Request } from 'express';

import { IAuthTokenRequest } from './interfaces';
import { User } from '../entities/user.entity';

export const AUTH_TOKEN_USER_PROVIDER = 'AUTH_TOKEN_USER_PROVIDER';

export abstract class ITokenUserProvider {
  /**
   * Resolves the user a token is requested for. `baseQuery` is `null` for a
   * custom grant type, which has no built-in lookup; `null` as the result
   * means "no such user" and makes the token request fail.
   */
  abstract get(
    baseQuery: Partial<User> | null,
    request: IAuthTokenRequest,
    httpReq?: Request,
  ): Promise<User | null>;
}
