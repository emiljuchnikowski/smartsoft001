import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { IModelFilter } from '@smartsoft001/models';

import { FilterDateComponent } from './date.component';
import { CrudFacade } from '../../../+state/crud.facade';
import { CrudConfig } from '../../../crud.config';
import { ICrudFilter } from '../../../models';

class SomeModel {
  date?: string;
}

describe('crud-shell-angular: FilterDateComponent', () => {
  function setup() {
    const facadeMock = { read: jest.fn() };

    TestBed.configureTestingModule({
      imports: [FilterDateComponent],
      providers: [
        { provide: CrudFacade, useValue: facadeMock },
        provideTranslateService(),
        { provide: CrudConfig, useValue: { type: SomeModel } },
      ],
    });

    const fixture: ComponentFixture<FilterDateComponent<any>> =
      TestBed.createComponent(FilterDateComponent);
    return { fixture, facadeMock };
  }

  const item = {
    key: 'date',
    type: '=',
    label: 'date.label',
  } as unknown as IModelFilter;

  it('should render a smart-date-edit element', () => {
    // Arrange
    const { fixture } = setup();
    fixture.componentRef.setInput('item', item);

    // Act
    fixture.detectChanges();

    // Assert
    const picker = fixture.nativeElement.querySelector('smart-date-edit');
    expect(picker).toBeTruthy();
  });

  it('should format the assigned customValue and push it through refresh to facade.read', () => {
    // Arrange
    jest.useFakeTimers();
    const { fixture, facadeMock } = setup();
    const filter: ICrudFilter = { query: [] };
    fixture.componentRef.setInput('item', item);
    fixture.componentRef.setInput('filter', filter);
    fixture.detectChanges();

    // Act
    fixture.componentInstance.customValue = '2024-03-15';
    jest.advanceTimersByTime(500);

    // Assert
    expect(filter.query).toEqual([
      expect.objectContaining({ key: 'date', type: '=', value: '2024-03-15' }),
    ]);
    expect(facadeMock.read).toHaveBeenCalledWith(filter);
    jest.useRealTimers();
  });

  it('should show the clear button when a matching query value is present', () => {
    // Arrange
    const { fixture } = setup();
    const filter: ICrudFilter = {
      query: [{ key: 'date', type: '=', value: '2024-03-15' }],
    };
    fixture.componentRef.setInput('item', item);
    fixture.componentRef.setInput('filter', filter);

    // Act
    fixture.detectChanges();

    // Assert
    const clear = fixture.nativeElement.querySelector(
      'button[aria-label="clear"]',
    );
    expect(clear).toBeTruthy();
  });

  it('should not show the clear button when no matching query value is present', () => {
    // Arrange
    const { fixture } = setup();
    const filter: ICrudFilter = { query: [] };
    fixture.componentRef.setInput('item', item);
    fixture.componentRef.setInput('filter', filter);

    // Act
    fixture.detectChanges();

    // Assert
    const clear = fixture.nativeElement.querySelector(
      'button[aria-label="clear"]',
    );
    expect(clear).toBeFalsy();
  });
});
