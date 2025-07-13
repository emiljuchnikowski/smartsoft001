import { Request } from 'express';

import { IAuthTokenRequest } from './interfaces';
import { User } from '../entities/user.entity';

export const AUTH_TOKEN_USER_PROVIDER = 'AUTH_TOKEN_USER_PROVIDER';

export abstract class ITokenUserProvider {
  abstract get(
    baseQuery: Partial<User>,
    request: IAuthTokenRequest,
    httpReq?: Request,
  ): Promise<User>;
}
