import { IAuthToken } from '@smartsoft001/auth-domain';
import { DomainValidationError } from '@smartsoft001/domain-core';

import {
  createDocsUserRepository,
  createTokenFactory,
  DOCS_CLIENT_ID,
  InMemoryUserRepository,
  issueToken,
} from './password-grant.example';

describe('docs-examples-node: TokenFactory password grant', () => {
  let repository: InMemoryUserRepository;

  beforeEach(async () => {
    repository = await createDocsUserRepository();
  });

  it('should issue a bearer token for valid credentials', async () => {
    const factory = createTokenFactory(repository);

    const token: IAuthToken = await issueToken(
      factory,
      'anna',
      'secret',
      DOCS_CLIENT_ID,
    );

    expect(token.token_type).toBe('bearer');
  });

  it('should report the lifetime configured on the token config', async () => {
    const factory = createTokenFactory(repository);

    const token = await issueToken(factory, 'anna', 'secret', DOCS_CLIENT_ID);

    expect(token.expired_in).toBe(3600);
  });

  it('should return the access token signed by the JWT service', async () => {
    const factory = createTokenFactory(repository);

    const token = await issueToken(factory, 'anna', 'secret', DOCS_CLIENT_ID);

    expect(token.access_token).toBe('signed.jwt');
  });

  it('should persist the rotated refresh token on the user', async () => {
    const factory = createTokenFactory(repository);

    const token = await issueToken(factory, 'anna', 'secret', DOCS_CLIENT_ID);

    expect(repository.users[0].authRefreshToken).toBe(token.refresh_token);
  });

  it('should stamp the login date on the user', async () => {
    const factory = createTokenFactory(repository);

    await issueToken(factory, 'anna', 'secret', DOCS_CLIENT_ID);

    expect(repository.users[0].lastLoginDate).toBeInstanceOf(Date);
  });

  it('should never expose the stored password hash through the token', async () => {
    const factory = createTokenFactory(repository);

    const token = await issueToken(factory, 'anna', 'secret', DOCS_CLIENT_ID);

    expect(Object.keys(token)).not.toContain('password');
  });

  it('should reject a wrong password without saying which half was wrong', async () => {
    const factory = createTokenFactory(repository);

    await expect(
      issueToken(factory, 'anna', 'wrong', DOCS_CLIENT_ID),
    ).rejects.toThrow(
      new DomainValidationError('Invalid username or password'),
    );
  });

  it('should reject an unknown username with the same message', async () => {
    const factory = createTokenFactory(repository);

    await expect(
      issueToken(factory, 'nobody', 'secret', DOCS_CLIENT_ID),
    ).rejects.toThrow(
      new DomainValidationError('Invalid username or password'),
    );
  });

  it('should reject a client id that is not registered in the token config', async () => {
    const factory = createTokenFactory(repository);

    await expect(
      issueToken(factory, 'anna', 'secret', 'other-client'),
    ).rejects.toThrow(new DomainValidationError('client_id is incorrect'));
  });

  it('should reject a disabled user', async () => {
    repository.users[0].disabled = true;
    const factory = createTokenFactory(repository);

    await expect(
      issueToken(factory, 'anna', 'secret', DOCS_CLIENT_ID),
    ).rejects.toThrow(new DomainValidationError('user disabled'));
  });
});
