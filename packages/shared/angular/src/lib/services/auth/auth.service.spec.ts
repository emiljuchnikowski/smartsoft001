import { TestBed } from '@angular/core/testing';
import { jwtDecode } from 'jwt-decode';

import { AuthService, AUTH_TOKEN } from './auth.service';
import { StorageService } from '../storage/storage.service';

jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(),
}));

describe('angular: AuthService', () => {
  let service: AuthService;
  let storageService: jest.Mocked<StorageService>;

  const mockStorageService = {
    getItem: jest.fn(),
    removeItem: jest.fn(),
    setItem: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: StorageService, useValue: mockStorageService },
      ],
    });

    service = TestBed.inject(AuthService);
    storageService = TestBed.inject(
      StorageService,
    ) as jest.Mocked<StorageService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isAuthenticated', () => {
    it('should return false when no token exists', () => {
      mockStorageService.getItem.mockReturnValue(null);
      expect(service.isAuthenticated()).toBeFalsy();
    });

    it('should return false when token is expired', () => {
      const expiredToken = { access_token: 'expired_token' };
      mockStorageService.getItem.mockReturnValue(expiredToken);
      (jwtDecode as jest.MockedFunction<typeof jwtDecode>).mockReturnValue({
        exp: Date.now() / 1000 - 1000,
      }); // expired 1000 seconds ago

      expect(service.isAuthenticated()).toBeFalsy();
      expect(mockStorageService.removeItem).toHaveBeenCalledWith(AUTH_TOKEN);
    });

    it('should return true when token exists and is valid', () => {
      const validToken = { access_token: 'valid_token' };
      mockStorageService.getItem.mockReturnValue(validToken);
      (jwtDecode as jest.MockedFunction<typeof jwtDecode>).mockReturnValue({
        exp: Date.now() / 1000 + 1000,
      }); // expires in 1000 seconds

      expect(service.isAuthenticated()).toBeTruthy();
    });
  });

  describe('expectPermissions', () => {
    it('should return false when no token exists', () => {
      mockStorageService.getItem.mockReturnValue(null);
      expect(service.expectPermissions(['READ'])).toBeFalsy();
    });

    it('should return false when permissions parameter is null', () => {
      const validToken = { access_token: 'valid_token' };
      mockStorageService.getItem.mockReturnValue(validToken);
      expect(service.expectPermissions(null)).toBeFalsy();
    });
  });

  describe('getPermissions', () => {
    it('should return empty array when no token exists', () => {
      mockStorageService.getItem.mockReturnValue(null);
      expect(service.getPermissions()).toEqual([]);
    });

    it('should return empty array when token is expired', () => {
      const expiredToken = { access_token: 'expired_token' };
      mockStorageService.getItem.mockReturnValue(expiredToken);
      (jwtDecode as jest.MockedFunction<typeof jwtDecode>).mockReturnValue({
        exp: Date.now() / 1000 - 1000,
      });

      expect(service.getPermissions()).toEqual([]);
      expect(mockStorageService.removeItem).toHaveBeenCalledWith(AUTH_TOKEN);
    });

    it('should return permissions array when token is valid', () => {
      const validToken = { access_token: 'valid_token' };
      const mockPermissions = ['READ', 'WRITE'];
      mockStorageService.getItem.mockReturnValue(validToken);
      (jwtDecode as jest.MockedFunction<typeof jwtDecode>)
        .mockReturnValueOnce({ exp: Date.now() / 1000 + 1000 })
        .mockReturnValueOnce({ permissions: mockPermissions });

      expect(service.getPermissions()).toEqual(mockPermissions);
    });

    it('should return empty array when token has no permissions', () => {
      const validToken = { access_token: 'valid_token' };
      mockStorageService.getItem.mockReturnValue(validToken);
      (jwtDecode as jest.MockedFunction<typeof jwtDecode>)
        .mockReturnValueOnce({ exp: Date.now() / 1000 + 1000 })
        .mockReturnValueOnce({});

      expect(service.getPermissions()).toEqual([]);
    });
  });

  describe('getTokenPayload', () => {
    it('should return null when no token exists', () => {
      mockStorageService.getItem.mockReturnValue(null);
      expect(service.getTokenPayload()).toBeNull();
    });

    it('should return null when token is expired', () => {
      const expiredToken = { access_token: 'expired_token' };
      mockStorageService.getItem.mockReturnValue(expiredToken);
      (jwtDecode as jest.MockedFunction<typeof jwtDecode>).mockReturnValue({
        exp: Date.now() / 1000 - 1000,
      });

      expect(service.getTokenPayload()).toBeNull();
      expect(mockStorageService.removeItem).toHaveBeenCalledWith(AUTH_TOKEN);
    });

    it('should return token payload when token is valid', () => {
      const validToken = { access_token: 'valid_token' };
      const mockPayload = {
        exp: Date.now() / 1000 + 1000,
        sub: 'user123',
        permissions: ['READ'],
      };
      mockStorageService.getItem.mockReturnValue(validToken);
      (jwtDecode as jest.MockedFunction<typeof jwtDecode>).mockReturnValue(
        mockPayload,
      );

      expect(service.getTokenPayload()).toEqual(mockPayload);
    });
  });

  describe('setToken', () => {
    it('should remove token when null is provided', () => {
      service.setToken(null);
      expect(mockStorageService.removeItem).toHaveBeenCalledWith(AUTH_TOKEN);
    });

    it('should remove token when invalid token object is provided', () => {
      service.setToken({} as any);
      expect(mockStorageService.removeItem).toHaveBeenCalledWith(AUTH_TOKEN);
    });

    it('should store valid token', () => {
      const validToken = { access_token: 'valid_token' };
      service.setToken(validToken);
      expect(mockStorageService.setItem).toHaveBeenCalledWith(
        AUTH_TOKEN,
        validToken,
      );
    });
  });

  describe('removeToken', () => {
    it('should remove token from storage', () => {
      service.removeToken();
      expect(mockStorageService.removeItem).toHaveBeenCalledWith(AUTH_TOKEN);
    });
  });
});
