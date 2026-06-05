import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { IModelFilter } from '@smartsoft001/models';

import { BaseComponent } from './base.component';
import { CrudFacade } from '../../../+state/crud.facade';
import { CrudConfig } from '../../../crud.config';
import {
  CRUD_MODEL_POSSIBILITIES_PROVIDER,
  ICrudModelPossibilitiesProvider,
} from '../../../providers/model-possibilities/model-possibilities.provider';

class SomeModel {}

@Component({
  selector: 'smart-test-filter-base',
  template: '',
  standalone: true,
})
class TestHostComponent extends BaseComponent<any> {}

describe('crud-shell-angular: filter BaseComponent', () => {
  function setup(provider?: ICrudModelPossibilitiesProvider) {
    const facadeMock = { read: jest.fn() };
    const translateMock = { currentLang: 'en' };

    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        { provide: CrudFacade, useValue: facadeMock },
        { provide: TranslateService, useValue: translateMock },
        { provide: CrudConfig, useValue: { type: SomeModel } },
        ...(provider
          ? [
              {
                provide: CRUD_MODEL_POSSIBILITIES_PROVIDER,
                useValue: provider,
              },
            ]
          : []),
      ],
    });

    const fixture: ComponentFixture<TestHostComponent> =
      TestBed.createComponent(TestHostComponent);
    return fixture;
  }

  it('should override item.possibilities with provider value when provider has an entry for the key', () => {
    // Arrange
    const provider: ICrudModelPossibilitiesProvider = {
      get: jest.fn().mockReturnValue({ name: of([{ id: 1, text: 'x' }]) }),
    };
    const fixture = setup(provider);
    const item: IModelFilter = {
      key: 'name',
      possibilities: signal([{ id: 99, text: 'fromItem' }]),
    } as unknown as IModelFilter;
    fixture.componentRef.setInput('item', item);

    // Act
    fixture.detectChanges();

    // Assert
    expect(fixture.componentInstance.possibilities()).toEqual([
      { id: 1, text: 'x' },
    ]);
  });

  it('should fall back to item.possibilities when provider has no entry for the key', () => {
    // Arrange
    const provider: ICrudModelPossibilitiesProvider = {
      get: jest.fn().mockReturnValue({}),
    };
    const fixture = setup(provider);
    const itemPossibilities = signal([{ id: 99, text: 'fromItem' }]);
    const item: IModelFilter = {
      key: 'name',
      possibilities: itemPossibilities,
    } as unknown as IModelFilter;
    fixture.componentRef.setInput('item', item);

    // Act
    fixture.detectChanges();

    // Assert
    expect(fixture.componentInstance.possibilities).toBe(itemPossibilities);
  });

  it('should not throw and use item.possibilities when provider is not provided', () => {
    // Arrange
    const fixture = setup();
    const itemPossibilities = signal([{ id: 99, text: 'fromItem' }]);
    const item: IModelFilter = {
      key: 'name',
      possibilities: itemPossibilities,
    } as unknown as IModelFilter;
    fixture.componentRef.setInput('item', item);

    // Act / Assert
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(fixture.componentInstance.possibilities).toBe(itemPossibilities);
  });
});
