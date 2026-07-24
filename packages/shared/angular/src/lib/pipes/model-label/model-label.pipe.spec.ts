import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';

import { ModelLabelPipe } from './model-label.pipe';
import { IModelLabelOptions, IModelLabelProvider } from '../../providers';

describe('ModelLabelPipe', () => {
  describe('without IModelLabelProvider', () => {
    it('should return the translated MODEL.<key> string without throwing', () => {
      const translateServiceMock = {
        instant: jest.fn().mockReturnValue('Name'),
      };
      TestBed.configureTestingModule({
        providers: [
          ModelLabelPipe,
          { provide: TranslateService, useValue: translateServiceMock },
        ],
      });

      const pipe = TestBed.runInInjectionContext(() => new ModelLabelPipe());
      const result = pipe.transform(undefined, 'name');

      expect(translateServiceMock.instant).toHaveBeenCalledWith('MODEL.name');
      expect(result).toBe('Name');
    });
  });

  describe('with IModelLabelProvider', () => {
    it('should return the provider value', () => {
      const translateServiceMock = {
        instant: jest.fn().mockReturnValue('Name'),
      };
      const providerMock: IModelLabelProvider = {
        get: (_options: IModelLabelOptions) => signal('Custom'),
      };
      TestBed.configureTestingModule({
        providers: [
          ModelLabelPipe,
          { provide: TranslateService, useValue: translateServiceMock },
          { provide: IModelLabelProvider, useValue: providerMock },
        ],
      });

      const pipe = TestBed.runInInjectionContext(() => new ModelLabelPipe());
      const result = pipe.transform({}, 'name');

      expect(result).toBe('Custom');
    });
  });
});
