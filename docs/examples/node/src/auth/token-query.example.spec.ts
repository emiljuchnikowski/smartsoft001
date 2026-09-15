import {
  IAuthTokenRequestCustom,
  IAuthTokenRequestFb,
  IAuthTokenRequestGoogle,
  IAuthTokenRequestPassword,
  IAuthTokenRequestRefreshToken,
} from '@smartsoft001/auth-domain';
import { DomainValidationError } from '@smartsoft001/domain-core';

import { queryFor } from './token-query.example';

describe('docs-examples-node: TokenFactory.getQuery', () => {
  it('should look a password grant up by username', () => {
    const request: IAuthTokenRequestPassword = {
      grant_type: 'password',
      username: 'anna',
      password: 'secret',
      client_id: 'docs-client',
    };

    const query = queryFor(request);

    expect(query).toEqual({ username: 'anna' });
  });

  it('should look a refresh token grant up by the stored refresh token', () => {
    const request: IAuthTokenRequestRefreshToken = {
      grant_type: 'refresh_token',
      refresh_token: 'c0ffee',
    };

    const query = queryFor(request);

    expect(query).toEqual({ authRefreshToken: 'c0ffee' });
  });

  it('should look a Facebook grant up by the Facebook user id', () => {
    // `IAuthTokenRequestFb` extends `IUserCredentials`, so the type insists on
    // `username` and `password` even though the Facebook grant ignores both.
    const request: IAuthTokenRequestFb = {
      grant_type: 'fb',
      fb_token: 'fb-access-token',
      fb_user_id: 'fb-42',
      client_id: 'docs-client',
      username: '',
      password: '',
    };

    const query = queryFor(request);

    expect(query).toEqual({ facebookUserId: 'fb-42' });
  });

  it('should look a Google grant up by the Google user id', () => {
    const request: IAuthTokenRequestGoogle = {
      grant_type: 'google',
      google_token: 'google-access-token',
      google_user_id: 'google-42',
      client_id: 'docs-client',
      username: '',
      password: '',
    };

    const query = queryFor(request);

    expect(query).toEqual({ googleUserId: 'google-42' });
  });

  it('should reject a grant type it does not know', () => {
    const request: IAuthTokenRequestCustom = {
      grant_type: 'client_credentials',
    };

    expect(() => queryFor(request)).toThrow(
      new DomainValidationError('Invalid grand type'),
    );
  });

  it('should return no query for an unknown grant when a user provider takes over', () => {
    const request: IAuthTokenRequestCustom = {
      grant_type: 'client_credentials',
    };

    const query = queryFor(request, true);

    expect(query).toBeNull();
  });
});
