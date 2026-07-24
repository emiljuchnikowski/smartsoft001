import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { IModelFilter } from '@smartsoft001/models';

import { FilterDateWithEditComponent } from './date-with-edit.component';
import { CrudFacade } from '../../../+state/crud.facade';
import { CrudConfig } from '../../../crud.config';
import { ICrudFilter } from '../../../models';

class SomeModel {
  date?: string;
}

describe('crud-shell-angular: FilterDateWithEditComponent', () => {
  function setup() {
    const facadeMock = { read: jest.fn() };

    TestBed.configureTestingModule({
      imports: [FilterDateWithEditComponent],
      providers: [
        { provide: CrudFacade, useValue: facadeMock },
        provideTranslateService(),
        { provide: CrudConfig, useValue: { type: SomeModel } },
      ],
    });

    const fixture: ComponentFixture<FilterDateWithEditComponent<any>> =
      TestBed.createComponent(FilterDateWithEditComponent);
    return { fixture, facadeMock };
  }

  const item = {
    key: 'date',
    type: '=',
    label: 'date.label',
  } as unknown as IModelFilter;

  it('should render the primary smart-date-edit element', () => {
    // Arrange
    const { fixture } = setup();
    fixture.componentRef.setInput('item', item);

    // Act
    fixture.detectChanges();

    // Assert
    const picker = fixture.nativeElement.querySelector('smart-date-edit');
    expect(picker).toBeTruthy();
  });

  it('should reveal the from/to range editors when advanced is toggled on', () => {
    // Arrange
    const { fixture } = setup();
    fixture.componentRef.setInput('item', item);
    fixture.detectChanges();

    // Assert (collapsed: only the single primary editor)
    expect(
      fixture.nativeElement.querySelectorAll('smart-date-edit').length,
    ).toBe(1);

    // Act
    fixture.componentInstance.toggleAdvanced();
    fixture.detectChanges();

    // Assert (advanced replaces the single editor with the from/to range pair)
    expect(
      fixture.nativeElement.querySelectorAll('smart-date-edit').length,
    ).toBe(2);
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
});
