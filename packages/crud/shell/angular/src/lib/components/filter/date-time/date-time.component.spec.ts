import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { IModelFilter } from '@smartsoft001/models';

import { FilterDateTimeComponent } from './date-time.component';
import { CrudFacade } from '../../../+state/crud.facade';
import { CrudConfig } from '../../../crud.config';
import { ICrudFilter } from '../../../models';

class SomeModel {
  date?: string;
}

describe('crud-shell-angular: FilterDateTimeComponent', () => {
  function setup() {
    const facadeMock = { read: jest.fn() };

    TestBed.configureTestingModule({
      imports: [FilterDateTimeComponent],
      providers: [
        { provide: CrudFacade, useValue: facadeMock },
        provideTranslateService(),
        { provide: CrudConfig, useValue: { type: SomeModel } },
      ],
    });

    const fixture: ComponentFixture<FilterDateTimeComponent<any>> =
      TestBed.createComponent(FilterDateTimeComponent);
    return { fixture, facadeMock };
  }

  const item = {
    key: 'date',
    type: '=',
    label: 'date.label',
  } as unknown as IModelFilter;

  it('should render datetime-local inputs for the from/to range', () => {
    // Arrange
    const { fixture } = setup();
    fixture.componentRef.setInput('item', item);

    // Act
    fixture.detectChanges();

    // Assert
    const inputs = fixture.nativeElement.querySelectorAll(
      'input[type="datetime-local"]',
    );
    expect(inputs.length).toBe(2);
  });

  it('should push the assigned customMinValue through refresh to facade.read for the ">=" slot', () => {
    // Arrange
    jest.useFakeTimers();
    const { fixture, facadeMock } = setup();
    const filter: ICrudFilter = { query: [] };
    fixture.componentRef.setInput('item', item);
    fixture.componentRef.setInput('filter', filter);
    fixture.detectChanges();

    // Act (moment reformats a valid ISO datetime down to the YYYY-MM-DD day)
    fixture.componentInstance.customMinValue = '2024-03-15T10:30';
    jest.advanceTimersByTime(500);

    // Assert
    expect(filter.query).toEqual([
      expect.objectContaining({
        key: 'date',
        type: '>=',
        value: '2024-03-15',
      }),
    ]);
    expect(facadeMock.read).toHaveBeenCalledWith(filter);
    jest.useRealTimers();
  });

  it('should show the clear button when any matching query value is present', () => {
    // Arrange
    const { fixture } = setup();
    const filter: ICrudFilter = {
      query: [{ key: 'date', type: '>=', value: '2024-03-15T10:30' }],
    };
    fixture.componentRef.setInput('item', item);
    fixture.componentRef.setInput('filter', filter);

    // Act
    fixture.detectChanges();

    // Assert
    const clear = fixture.nativeElement.querySelector(
      'button[aria-label="clear-from"]',
    );
    expect(clear).toBeTruthy();
  });
});
