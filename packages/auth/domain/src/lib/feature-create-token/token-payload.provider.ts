import { Request } from 'express';

import { User } from '../entities/user.entity';
import { IAuthTokenRequest } from './interfaces';

export const AUTH_TOKEN_PAYLOAD_PROVIDER = 'AUTH_TOKEN_PAYLOAD_PROVIDER';

export abstract class ITokenPayloadProvider {
  abstract change(
    basePayload: Record<string, unknown>,
    data: {
      request?: IAuthTokenRequest;
      user?: User;
      httpReq?: Request;
    },
  ): Promise<void>;
}
