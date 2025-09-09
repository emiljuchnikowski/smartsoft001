// Create interface for our mock
import { ɵNoopNgZone as NoopNgZone, NgZone } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from '@angular/platform-browser/testing';

interface MockAuthService {
  expectPermissions: jest.Mock;
}

// Mock getModelOptions
const mockGetModelOptions = jest.fn();
jest.mock('@smartsoft001/models', () => ({
  getModelOptions: mockGetModelOptions,
}));

// Mock entire @smartsoft001/angular module
jest.mock('@smartsoft001/angular', () => ({
  AuthService: jest.fn().mockImplementation(() => ({
    expectPermissions: jest.fn(),
  })),
}));

import { AuthService } from '@smartsoft001/angular';

import { PageService } from './page.service';
import { CrudFullConfig } from '../../crud.config';

TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());

describe('crud-shell-angular: PageService', () => {
  let service: PageService<any>;
  let authService: MockAuthService;
  let config: CrudFullConfig<any>;

  beforeEach(() => {
    config = {
      type: 'TestType',
      title: 'Test Title',
      apiUrl: 'http://test-api.com',
      entity: {} as any,
      add: true,
      edit: true,
      remove: true,
    };

    TestBed.configureTestingModule({
      providers: [
        PageService,
        { provide: AuthService, useValue: { expectPermissions: jest.fn() } },
        { provide: CrudFullConfig, useValue: config },
        { provide: NgZone, useClass: NoopNgZone },
      ],
    });

    service = TestBed.inject(PageService);
    authService = TestBed.inject(AuthService) as unknown as MockAuthService;

    // Reset all mocks before each test
    jest.clearAllMocks();
    mockGetModelOptions.mockReturnValue({
      create: { permissions: ['create'] },
      update: { permissions: ['update'] },
      remove: { permissions: ['delete'] },
    });
  });

  it('should create service', () => {
    expect(service).toBeTruthy();
  });

  describe('checkPermissions', () => {
    it('should disable add when user lacks create permissions', () => {
      authService.expectPermissions.mockReturnValue(false);
      service.checkPermissions();
      expect(config.add).toBe(false);
    });

    it('should keep add enabled when user has create permissions', () => {
      authService.expectPermissions.mockReturnValue(true);
      service.checkPermissions();
      expect(config.add).toBe(true);
    });

    it('should disable edit when user lacks update permissions', () => {
      authService.expectPermissions.mockReturnValue(false);
      service.checkPermissions();
      expect(config.edit).toBe(false);
    });

    it('should keep edit enabled when user has update permissions', () => {
      authService.expectPermissions.mockReturnValue(true);
      service.checkPermissions();
      expect(config.edit).toBe(true);
    });

    it('should disable remove when user lacks delete permissions', () => {
      authService.expectPermissions.mockReturnValue(false);
      service.checkPermissions();
      expect(config.remove).toBe(false);
    });

    it('should keep remove enabled when user has delete permissions', () => {
      authService.expectPermissions.mockReturnValue(true);
      service.checkPermissions();
      expect(config.remove).toBe(true);
    });

    it('should not modify add when model has no create permissions defined', () => {
      mockGetModelOptions.mockReturnValue({
        create: {},
      });
      service.checkPermissions();
      expect(config.add).toBe(true);
    });

    it('should not modify edit when model has no update permissions defined', () => {
      mockGetModelOptions.mockReturnValue({
        update: {},
      });
      service.checkPermissions();
      expect(config.edit).toBe(true);
    });

    it('should not modify remove when model has no remove permissions defined', () => {
      mockGetModelOptions.mockReturnValue({
        remove: {},
      });
      service.checkPermissions();
      expect(config.remove).toBe(true);
    });

    it('should handle undefined model options gracefully', () => {
      mockGetModelOptions.mockReturnValue({});
      service.checkPermissions();
      expect(config.add).toBe(true);
      expect(config.edit).toBe(true);
      expect(config.remove).toBe(true);
    });
  });
});
