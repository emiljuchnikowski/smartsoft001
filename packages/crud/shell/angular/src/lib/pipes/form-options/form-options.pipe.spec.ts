import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { IEntity } from '@smartsoft001/domain-core';

import { FormOptionsPipe } from './form-options.pipe';
import {
  CRUD_MODEL_POSSIBILITIES_PROVIDER,
  ICrudModelPossibilitiesProvider,
} from '../../providers/model-possibilities/model-possibilities.provider';

class SomeType implements IEntity<string> {
  id!: string;
}

describe('crud-shell-angular: FormOptionsPipe', () => {
  it('should not throw and return empty possibilities when provider token is not provided', () => {
    // Arrange
    TestBed.configureTestingModule({});

    // Act
    const pipe = TestBed.runInInjectionContext(
      () => new FormOptionsPipe<SomeType>(),
    );
    const result = pipe.transform(new SomeType(), 'create', SomeType);

    // Assert
    expect(result.possibilities).toEqual({});
  });

  it('should return provider possibilities when provider token is provided', () => {
    // Arrange
    const providerResult = { someKey: of([{ id: 1, text: 'a' }]) };
    const providerMock: ICrudModelPossibilitiesProvider = {
      get: jest.fn().mockReturnValue(providerResult),
    };
    TestBed.configureTestingModule({
      providers: [
        {
          provide: CRUD_MODEL_POSSIBILITIES_PROVIDER,
          useValue: providerMock,
        },
      ],
    });

    // Act
    const pipe = TestBed.runInInjectionContext(
      () => new FormOptionsPipe<SomeType>(),
    );
    const result = pipe.transform(new SomeType(), 'create', SomeType);

    // Assert
    expect(result.possibilities).toBe(providerResult);
  });
});
