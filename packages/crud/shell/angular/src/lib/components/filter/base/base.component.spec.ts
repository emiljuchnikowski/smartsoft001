import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { IModelFilter } from '@smartsoft001/models';

import { BaseComponent } from './base.component';
import { CrudFacade } from '../../../+state/crud.facade';
import { CrudConfig } from '../../../crud.config';
import { ICrudFilter } from '../../../models';
import {
  CRUD_MODEL_POSSIBILITIES_PROVIDER,
  ICrudModelPossibilitiesProvider,
} from '../../../providers/model-possibilities/model-possibilities.provider';

class SomeModel {
  name?: string;
}

@Component({
  selector: 'smart-test-filter-base',
  template: '',
  standalone: true,
})
class TestHostComponent extends BaseComponent<any> {
  publicBindValueControl() {
    return this.bindValueControl();
  }
}

describe('crud-shell-angular: filter BaseComponent', () => {
  let lastFacadeMock: { read: jest.Mock };

  function setup(provider?: ICrudModelPossibilitiesProvider) {
    const facadeMock = { read: jest.fn() };
    lastFacadeMock = facadeMock;
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

  describe('hasValue()', () => {
    it('should be true when filter().query has a matching entry with a non-empty value', () => {
      // Arrange
      const fixture = setup();
      const item = {
        key: 'name',
        type: '=',
      } as unknown as IModelFilter;
      const filter: ICrudFilter = {
        query: [{ key: 'name', type: '=', value: 'abc' }],
      };
      fixture.componentRef.setInput('item', item);
      fixture.componentRef.setInput('filter', filter);

      // Act
      fixture.detectChanges();

      // Assert
      expect(fixture.componentInstance.hasValue()).toBe(true);
    });

    it('should be false when no matching query entry exists', () => {
      // Arrange
      const fixture = setup();
      const item = {
        key: 'name',
        type: '=',
      } as unknown as IModelFilter;
      const filter: ICrudFilter = { query: [] };
      fixture.componentRef.setInput('item', item);
      fixture.componentRef.setInput('filter', filter);

      // Act
      fixture.detectChanges();

      // Assert
      expect(fixture.componentInstance.hasValue()).toBe(false);
    });

    it('should be false when the matching entry has an empty value', () => {
      // Arrange
      const fixture = setup();
      const item = {
        key: 'name',
        type: '=',
      } as unknown as IModelFilter;
      const filter: ICrudFilter = {
        query: [{ key: 'name', type: '=', value: '' }],
      };
      fixture.componentRef.setInput('item', item);
      fixture.componentRef.setInput('filter', filter);

      // Act
      fixture.detectChanges();

      // Assert
      expect(fixture.componentInstance.hasValue()).toBe(false);
    });
  });

  describe('bindValueControl()', () => {
    it('should seed the control with the current legacy value', () => {
      // Arrange
      const fixture = setup();
      const item = {
        key: 'name',
        type: '=',
      } as unknown as IModelFilter;
      const filter: ICrudFilter = {
        query: [{ key: 'name', type: '=', value: 'seed' }],
      };
      fixture.componentRef.setInput('item', item);
      fixture.componentRef.setInput('filter', filter);
      fixture.detectChanges();

      // Act
      const control = fixture.componentInstance.publicBindValueControl();

      // Assert
      expect(control.value).toBe('seed');
    });

    it('should trigger facade.read when the control value changes', () => {
      // Arrange
      jest.useFakeTimers();
      const fixture = setup();
      const item = {
        key: 'name',
        type: '=',
      } as unknown as IModelFilter;
      const filter: ICrudFilter = { query: [] };
      fixture.componentRef.setInput('item', item);
      fixture.componentRef.setInput('filter', filter);
      fixture.detectChanges();
      const control = fixture.componentInstance.publicBindValueControl();
      lastFacadeMock.read.mockClear();

      // Act
      control.setValue('typed');
      jest.advanceTimersByTime(500);

      // Assert
      expect(lastFacadeMock.read).toHaveBeenCalled();
      jest.useRealTimers();
    });
  });
});
