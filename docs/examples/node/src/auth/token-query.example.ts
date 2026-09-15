// #region usage
import {
  IAuthTokenRequest,
  TokenFactory,
  User,
} from '@smartsoft001/auth-domain';

/**
 * Turns an incoming token request into the lookup the factory runs against the
 * `users` table. `TokenFactory.getQuery` is static, so it needs no DI, no
 * database and no network.
 *
 * Despite its parameter name, the first argument is the **request**, not a
 * `TokenConfig`: each grant type selects a different column. `password` looks
 * up `username`, `refresh_token` looks up `authRefreshToken`, and the two
 * social grants look up `facebookUserId` / `googleUserId`.
 *
 * The second argument says whether an `ITokenUserProvider` is registered. With
 * no provider an unrecognised grant type is a client error and throws
 * `DomainValidationError('Invalid grand type')`. With a provider the factory
 * returns `null` instead, because the provider is expected to resolve the user
 * on its own and the built-in query would only get in the way.
 */
export function queryFor(
  request: IAuthTokenRequest,
  hasUserProvider = false,
): Partial<User> {
  return TokenFactory.getQuery(request, hasUserProvider);
}
// #endregion
