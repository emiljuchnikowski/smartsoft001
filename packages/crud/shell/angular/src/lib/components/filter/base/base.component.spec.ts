import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { FieldType, IModelFilter } from '@smartsoft001/models';

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
  changeDetection: ChangeDetectionStrategy.Eager,
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

  describe('immutable filter state (NgRx strictStateImmutability)', () => {
    it('should not throw and add a query entry when refresh runs on a deeply frozen filter', () => {
      // Arrange
      jest.useFakeTimers();
      const fixture = setup();
      const item = {
        key: 'title',
        type: '=',
        label: 'Title',
      } as unknown as IModelFilter;
      const filter: ICrudFilter = Object.freeze({
        limit: 25,
        offset: 25,
        query: Object.freeze([
          Object.freeze({ key: 'other', type: '=', value: 'x' }),
        ]),
      }) as unknown as ICrudFilter;
      fixture.componentRef.setInput('item', item);
      fixture.componentRef.setInput('filter', filter);
      fixture.detectChanges();
      lastFacadeMock.read.mockClear();

      // Act / Assert
      expect(() => {
        fixture.componentInstance.refresh('Signals');
        jest.advanceTimersByTime(500);
      }).not.toThrow();

      expect(lastFacadeMock.read).toHaveBeenCalledTimes(1);
      const passed = lastFacadeMock.read.mock.calls[0][0] as ICrudFilter;
      expect(passed.offset).toBe(0);
      expect(passed.query).toEqual(
        expect.arrayContaining([
          { key: 'other', type: '=', value: 'x' },
          { key: 'title', type: '=', value: 'Signals', label: 'Title' },
        ]),
      );
      jest.useRealTimers();
    });

    it('should not throw and remove a matching query entry when refresh(null) runs on a deeply frozen filter', () => {
      // Arrange
      jest.useFakeTimers();
      const fixture = setup();
      const item = {
        key: 'title',
        type: '=',
        label: 'Title',
      } as unknown as IModelFilter;
      const filter: ICrudFilter = Object.freeze({
        limit: 25,
        offset: 25,
        query: Object.freeze([
          Object.freeze({ key: 'other', type: '=', value: 'x' }),
          Object.freeze({
            key: 'title',
            type: '=',
            value: 'Signals',
            label: 'Title',
          }),
        ]),
      }) as unknown as ICrudFilter;
      fixture.componentRef.setInput('item', item);
      fixture.componentRef.setInput('filter', filter);
      fixture.detectChanges();
      lastFacadeMock.read.mockClear();

      // Act / Assert
      expect(() => {
        fixture.componentInstance.refresh(null);
        jest.advanceTimersByTime(500);
      }).not.toThrow();

      expect(lastFacadeMock.read).toHaveBeenCalledTimes(1);
      const passed = lastFacadeMock.read.mock.calls[0][0] as ICrudFilter;
      expect(passed.offset).toBe(0);
      expect(passed.query?.find((q) => q.key === 'title')).toBeUndefined();
      expect(passed.query).toEqual([{ key: 'other', type: '=', value: 'x' }]);
      jest.useRealTimers();
    });

    it('should not throw and remove matching entries when clear runs on a deeply frozen filter', () => {
      // Arrange
      const fixture = setup();
      const item = {
        key: 'title',
        type: '=',
        label: 'Title',
      } as unknown as IModelFilter;
      const filter: ICrudFilter = Object.freeze({
        limit: 25,
        offset: 25,
        query: Object.freeze([
          Object.freeze({ key: 'other', type: '=', value: 'x' }),
          Object.freeze({
            key: 'title',
            type: '=',
            value: 'Signals',
            label: 'Title',
          }),
        ]),
      }) as unknown as ICrudFilter;
      fixture.componentRef.setInput('item', item);
      fixture.componentRef.setInput('filter', filter);
      fixture.detectChanges();
      lastFacadeMock.read.mockClear();

      // Act / Assert
      expect(() => fixture.componentInstance.clear()).not.toThrow();

      expect(lastFacadeMock.read).toHaveBeenCalledTimes(1);
      const passed = lastFacadeMock.read.mock.calls[0][0] as ICrudFilter;
      expect(passed.offset).toBe(0);
      expect(passed.query).toEqual([{ key: 'other', type: '=', value: 'x' }]);
      jest.useRealTimers();
    });

    it('should not throw on the array-type refresh path with a deeply frozen filter', () => {
      // Arrange
      jest.useFakeTimers();
      const fixture = setup();
      const item = {
        key: 'tags',
        type: '=',
        label: 'Tags',
        fieldType: FieldType.check,
      } as unknown as IModelFilter;
      const filter: ICrudFilter = Object.freeze({
        limit: 25,
        offset: 25,
        query: Object.freeze([
          Object.freeze({ key: 'tags', type: '=', value: 'old' }),
        ]),
      }) as unknown as ICrudFilter;
      fixture.componentRef.setInput('item', item);
      fixture.componentRef.setInput('filter', filter);
      fixture.detectChanges();
      lastFacadeMock.read.mockClear();

      // Act / Assert
      expect(() => {
        fixture.componentInstance.refresh(['a', 'b']);
        jest.advanceTimersByTime(500);
      }).not.toThrow();

      expect(lastFacadeMock.read).toHaveBeenCalledTimes(1);
      const passed = lastFacadeMock.read.mock.calls[0][0] as ICrudFilter;
      expect(passed.offset).toBe(0);
      expect(passed.query).toEqual([
        { key: 'tags', type: '=', value: 'a' },
        { key: 'tags', type: '=', value: 'b' },
      ]);
      jest.useRealTimers();
    });
  });
});
