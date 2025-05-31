import { Injectable } from "@angular/core";
import decode from "jwt-decode";

import { StorageService } from "../storage/storage.service"; // This path needs to be correct

export const AUTH_TOKEN = "AUTH_TOKEN";

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(protected storageService: StorageService) {}

  isAuthenticated(): boolean {
    const token: { access_token: string } = this.getToken();

    if (!token) return false;

    const tokenPayload: { exp: number } = decode(
        token.access_token
    ) as any;

    if (Date.now() >= tokenPayload.exp * 1000) {
      this.storageService.removeItem(AUTH_TOKEN); // Remove expired token
      return false;
    }

    return !!token;
  }

  expectPermissions(permissions: Array<string>): boolean {
    const token: { access_token: string } = this.getToken();

    if (!token) return false;

    // Check for token expiration before decoding
    const tokenPayloadExp: { exp: number } = decode(token.access_token) as any;
    if (Date.now() >= tokenPayloadExp.exp * 1000) {
      this.storageService.removeItem(AUTH_TOKEN); // Remove expired token
      return false;
    }

    const tokenPayloadPerm: { permissions: Array<string> } = decode(
      token.access_token
    ) as any;

    return (
      // this.isAuthenticated() call here would be redundant and might lead to multiple decodes/checks.
      // Relies on the fact that getToken() would return null for an expired token if isAuthenticated() was called first,
      // but it's safer to explicitly check expiration here too or ensure getToken handles it.
      // For now, direct check as added above.
      tokenPayloadPerm.permissions &&
      permissions.some((p) =>
        (tokenPayloadPerm.permissions as Array<string>).some((tp) => p === tp)
      )
    );
  }

  getPermissions(): Array<string> {
    const token: { access_token: string } = this.getToken();

    if (!token) return [];

    // Check for token expiration
    const tokenPayloadExp: { exp: number } = decode(token.access_token) as any;
    if (Date.now() >= tokenPayloadExp.exp * 1000) {
      this.storageService.removeItem(AUTH_TOKEN); // Remove expired token
      return [];
    }

    const tokenPayload: { permissions: Array<string> } = decode(
        token.access_token
    ) as any;

    return tokenPayload.permissions || []; // ensure it returns empty array if permissions field is missing
  }

  getTokenPayload(): any {
    const token: { access_token: string } = this.getToken();
    if (!token) return null;

    const tokenPayload: { exp: number } = decode(token.access_token) as any;
    if (Date.now() >= tokenPayload.exp * 1000) {
      this.storageService.removeItem(AUTH_TOKEN);
      return null;
    }
    return tokenPayload;
  }

  // Renamed from original getToken to avoid confusion with new getTokenPayload
  protected getRawToken(): { access_token: string } | null {
    const tokenString = this.storageService.getItem(AUTH_TOKEN);

    if (!tokenString) return null;

    // Assuming token is stored as { "access_token": "xyz" } after JSON.parse
    // The original code was: return JSON.parse(token) as any;
    // This needs to align with how StorageService.getItem returns (it JSON.parses)
    // and how setToken (if it existed) would store it.
    // For now, assume getItem returns the object directly.
    return tokenString as { access_token: string };
  }

  // Adjusted to use getRawToken and be more explicit
  protected getToken(): { access_token: string } | null {
    const token = this.getRawToken();
    if (!token || !token.access_token) { // ensure access_token property exists
        return null;
    }

    // No need to check expiration here as individual methods do it.
    // If we wanted a central place, this would be it.
    return token;
  }

  setToken(token: { access_token: string } | null): void {
    if (!token || !token.access_token) {
      this.storageService.removeItem(AUTH_TOKEN);
    } else {
      this.storageService.setItem(AUTH_TOKEN, token);
    }
  }

  removeToken(): void {
    this.storageService.removeItem(AUTH_TOKEN);
  }
}
