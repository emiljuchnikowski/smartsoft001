import { IAuthTokenRequest } from './interfaces';
import { User } from '../entities';

export const AUTH_TOKEN_VALIDATION_PROVIDER = 'AUTH_TOKEN_VALIDATION_PROVIDER';

export abstract class ITokenValidationProvider {
  abstract replace?: boolean;

  /**
   * `user` is `null` when the lookup found nobody; a provider with `replace`
   * sees that case (the built-in checks are skipped), one without does not.
   */
  abstract check(data: {
    request?: IAuthTokenRequest;
    user?: User | null;
  }): Promise<void>;
}
