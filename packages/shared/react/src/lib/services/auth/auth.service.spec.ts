import { StorageService } from '../storage/storage.service';
import { AUTH_TOKEN, AuthService } from './auth.service';

function token(payload: Record<string, unknown>): string {
  const encode = (value: unknown) =>
    Buffer.from(JSON.stringify(value)).toString('base64url');

  return `${encode({ alg: 'none' })}.${encode(payload)}.signature`;
}

describe('@smartsoft001/react: AuthService', () => {
  const future = Math.floor(Date.now() / 1000) + 3600;
  const past = Math.floor(Date.now() / 1000) - 3600;
  let storage: StorageService;
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    storage = new StorageService();
    service = new AuthService(storage);
  });

  it('should not be authenticated without a token', () => {
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should be authenticated with a valid token', () => {
    service.setToken({ access_token: token({ exp: future }) });

    expect(service.isAuthenticated()).toBe(true);
  });

  it('should drop an expired token', () => {
    service.setToken({ access_token: token({ exp: past }) });

    service.isAuthenticated();

    expect(storage.getItem(AUTH_TOKEN)).toBeNull();
  });

  it('should grant a permission the token carries', () => {
    service.setToken({
      access_token: token({ exp: future, permissions: ['admin'] }),
    });

    expect(service.expectPermissions(['user', 'admin'])).toBe(true);
  });

  it('should refuse a permission the token lacks', () => {
    service.setToken({
      access_token: token({ exp: future, permissions: ['user'] }),
    });

    expect(service.expectPermissions(['admin'])).toBe(false);
  });

  it('should refuse null permissions', () => {
    service.setToken({
      access_token: token({ exp: future, permissions: ['user'] }),
    });

    expect(service.expectPermissions(null)).toBe(false);
  });

  it('should return the permissions of the token', () => {
    service.setToken({
      access_token: token({ exp: future, permissions: ['a', 'b'] }),
    });

    expect(service.getPermissions()).toEqual(['a', 'b']);
  });

  it('should drop a token that cannot be decoded', () => {
    storage.setItem(AUTH_TOKEN, { access_token: 'garbage' });

    expect([service.isAuthenticated(), storage.getItem(AUTH_TOKEN)]).toEqual([
      false,
      null,
    ]);
  });

  it('should return the access token while it is valid', () => {
    const value = token({ exp: future });
    service.setToken({ access_token: value });

    expect(service.getAccessToken()).toBe(value);
  });
});
