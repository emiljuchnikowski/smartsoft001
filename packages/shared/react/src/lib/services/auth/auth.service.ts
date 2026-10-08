import { jwtDecode } from 'jwt-decode';

import { StorageService } from '../storage/storage.service';

export const AUTH_TOKEN = 'AUTH_TOKEN';

export interface IAuthToken {
  access_token: string;
  [key: string]: unknown;
}

/**
 * The access token the API issued, kept in storage under `AUTH_TOKEN`, and
 * the checks the components make against its claims. An expired token is
 * removed the first time it is read.
 */
export class AuthService {
  constructor(protected readonly storageService: StorageService) {}

  isAuthenticated(): boolean {
    return !!this.getValidPayload();
  }

  /** True when the token grants at least one of `permissions`. */
  expectPermissions(permissions: Array<string> | null): boolean {
    if (permissions === null) return false;

    const payload = this.getValidPayload<{ permissions?: Array<string> }>();

    if (!payload?.permissions) return false;

    return permissions.some((p) =>
      (payload.permissions as Array<string>).some((tp) => p === tp),
    );
  }

  getPermissions(): Array<string> {
    return (
      this.getValidPayload<{ permissions?: Array<string> }>()?.permissions ?? []
    );
  }

  getTokenPayload<T = any>(): T | null {
    return this.getValidPayload<T>();
  }

  /** The raw access token, for an `Authorization` header. */
  getAccessToken(): string | null {
    return this.isAuthenticated()
      ? (this.getToken()?.access_token ?? null)
      : null;
  }

  setToken(token: IAuthToken | null): void {
    if (!token || !token.access_token) {
      this.storageService.removeItem(AUTH_TOKEN);
    } else {
      this.storageService.setItem(AUTH_TOKEN, token);
    }
  }

  removeToken(): void {
    this.storageService.removeItem(AUTH_TOKEN);
  }

  protected getToken(): IAuthToken | null {
    const token = this.storageService.getItem<IAuthToken>(AUTH_TOKEN);

    if (!token || !token.access_token) return null;

    return token;
  }

  private getValidPayload<T>(): (T & { exp?: number }) | null {
    const token = this.getToken();

    if (!token) return null;

    let payload: T & { exp?: number };

    try {
      payload = jwtDecode<T & { exp?: number }>(token.access_token);
    } catch {
      this.storageService.removeItem(AUTH_TOKEN);
      return null;
    }

    if (payload.exp && Date.now() >= payload.exp * 1000) {
      this.storageService.removeItem(AUTH_TOKEN);
      return null;
    }

    return payload;
  }
}
