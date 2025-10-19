import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { DYNAMIC_COMPONENTS_STORE } from './dynamic-component-storage.service';
import { DynamicComponentStorageService } from './dynamic-component-storage.service';

describe('angular: DynamicComponentStorageService', () => {
  let dynamicComponentStorageService: DynamicComponentStorageService;

  beforeEach(() => {
    jest.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [DynamicComponentStorageService],
    });

    dynamicComponentStorageService = TestBed.inject(
      DynamicComponentStorageService,
    );
  });

  it('should be created', () => {
    expect(dynamicComponentStorageService).toBeTruthy();
  });

  describe('get', () => {
    it('returns empty array if moduleRef is null', () => {
      const result = DynamicComponentStorageService.get('test', null as any);
      expect(result).toEqual([]);
    });

    it('returns empty array if DYNAMIC_COMPONENTS_STORE and declarations are missing', () => {
      const moduleRefMock = {
        injector: { get: jest.fn().mockReturnValue(null) },
        instance: { constructor: {} },
      } as any;
      const result = DynamicComponentStorageService.get('test', moduleRefMock);
      expect(result).toEqual([]);
    });

    it('returns components from DYNAMIC_COMPONENTS_STORE matching smartType', () => {
      const compA = { smartType: 'test' };
      const compB = { smartType: 'other' };
      const moduleRefMock = {
        injector: {
          get: jest.fn((token) =>
            token === DYNAMIC_COMPONENTS_STORE ? [compA, compB] : null,
          ),
        },
        instance: { constructor: {} },
      } as any;
      const result = DynamicComponentStorageService.get('test', moduleRefMock);
      expect(result).toEqual([compA]);
    });

    it('returns components from internal Angular declarations if DYNAMIC_COMPONENTS_STORE is not provided', () => {
      const compA = { smartType: 'test' };
      const compB = { smartType: 'other' };
      const moduleRefMock = {
        injector: { get: jest.fn().mockReturnValue(null) },
        instance: {
          constructor: {
            ɵmod: {
              declarations: [compA, compB],
            },
          },
        },
      } as any;
      const result = DynamicComponentStorageService.get('test', moduleRefMock);
      expect(result).toEqual([compA]);
    });

    it('falls back to root AppModule if no components found in current moduleRef', () => {
      const compA = { smartType: 'list' };
      const appModuleRefMock = {
        injector: {
          get: jest.fn((token) =>
            token === DYNAMIC_COMPONENTS_STORE ? [compA] : null,
          ),
        },
        instance: { constructor: {} },
      } as any;
      const appComponentMock = {
        componentType: { name: 'AppComponent' },
        injector: { get: jest.fn().mockReturnValue(appModuleRefMock) },
      };
      const applicationRefMock = {
        components: [appComponentMock],
      };
      const moduleRefMock = {
        injector: {
          get: jest.fn((token) => {
            if (token === DYNAMIC_COMPONENTS_STORE) return null;
            if (token === ApplicationRef) return applicationRefMock;
            return null;
          }),
        },
        instance: { constructor: {} },
      } as any;
      const result = DynamicComponentStorageService.get('list', moduleRefMock);
      expect(result).toEqual([compA]);
    });

    it('logs a warning and returns empty array if no components found for key', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {}); // eslint-disable-line
      const moduleRefMock = {
        injector: { get: jest.fn().mockReturnValue([]) },
        instance: { constructor: {} },
      } as any;
      const result = DynamicComponentStorageService.get(
        'form',
        moduleRefMock,
      );
      expect(result).toEqual([]);
      expect(warnSpy).toHaveBeenCalledWith(
        `DynamicComponentStorageService: No components found for key 'form'`,
      );
      warnSpy.mockRestore();
    });
  });
});
