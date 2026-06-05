import {
  createEnvironmentInjector,
  EnvironmentInjector,
  runInInjectionContext,
  signal,
  Signal,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';

import { IModelLabelOptions, IModelLabelProvider } from '@smartsoft001/angular';

import { CrudModelLabelProvider } from './model-label.provider';

describe('CrudModelLabelProvider', () => {
  describe('without parent provider', () => {
    it('should fall back to translating MODEL.<key>', () => {
      const translateServiceMock = {
        instant: jest.fn().mockReturnValue('Name'),
      };
      TestBed.configureTestingModule({
        providers: [
          CrudModelLabelProvider,
          { provide: TranslateService, useValue: translateServiceMock },
        ],
      });

      const provider = TestBed.inject(CrudModelLabelProvider);
      const result = provider.get({ key: 'name' });

      expect(translateServiceMock.instant).toHaveBeenCalledWith('MODEL.name');
      expect(result()).toBe('Name');
    });
  });

  describe('with parent provider', () => {
    it('should delegate to the parent provider higher in the injector tree', () => {
      const translateServiceMock = {
        instant: jest.fn().mockReturnValue('Name'),
      };
      const parentProvider: IModelLabelProvider = {
        get: (_options: IModelLabelOptions): Signal<string> => signal('Parent'),
      };
      TestBed.configureTestingModule({
        providers: [
          { provide: TranslateService, useValue: translateServiceMock },
          { provide: IModelLabelProvider, useValue: parentProvider },
        ],
      });

      const parentInjector = TestBed.inject(EnvironmentInjector);
      const childInjector = createEnvironmentInjector(
        [CrudModelLabelProvider],
        parentInjector,
      );

      const provider = runInInjectionContext(childInjector, () =>
        childInjector.get(CrudModelLabelProvider),
      );
      const result = provider.get({ key: 'name' });

      expect(result()).toBe('Parent');
    });
  });
});
