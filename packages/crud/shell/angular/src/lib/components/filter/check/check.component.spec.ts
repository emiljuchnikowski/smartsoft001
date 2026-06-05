import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { FieldType, IModelFilter } from '@smartsoft001/models';

import { FilterCheckComponent } from './check.component';
import { CrudFacade } from '../../../+state/crud.facade';
import { CrudConfig } from '../../../crud.config';
import { ICrudFilter } from '../../../models';

class SomeModel {
  status?: number;
}

describe('crud-shell-angular: FilterCheckComponent', () => {
  let lastFacadeMock: { read: jest.Mock };

  function setup() {
    const facadeMock = { read: jest.fn() };
    lastFacadeMock = facadeMock;

    TestBed.configureTestingModule({
      imports: [FilterCheckComponent],
      providers: [
        { provide: CrudFacade, useValue: facadeMock },
        provideTranslateService(),
        { provide: CrudConfig, useValue: { type: SomeModel } },
      ],
    });

    const fixture: ComponentFixture<FilterCheckComponent<any>> =
      TestBed.createComponent(FilterCheckComponent);
    return fixture;
  }

  function buildItem(): IModelFilter {
    return {
      key: 'status',
      type: '=',
      fieldType: FieldType.check,
      label: 'status.label',
      possibilities: signal([
        { id: 1, text: 'a' },
        { id: 2, text: 'b' },
      ]),
    } as unknown as IModelFilter;
  }

  function buildFilter(values: number[]): ICrudFilter {
    return {
      query: values.map((value) => ({
        key: 'status',
        type: '=',
        value,
      })),
    };
  }

  it('should render one checkbox label per possibility', () => {
    // Arrange
    const fixture = setup();
    fixture.componentRef.setInput('item', buildItem());
    fixture.componentRef.setInput('filter', buildFilter([]));

    // Act
    fixture.detectChanges();

    // Assert
    const labels = fixture.nativeElement.querySelectorAll('label');
    expect(labels.length).toBe(2);
  });

  it('should mark only the checkbox whose id is in the value array as checked', () => {
    // Arrange
    const fixture = setup();
    fixture.componentRef.setInput('item', buildItem());
    fixture.componentRef.setInput('filter', buildFilter([1]));

    // Act
    fixture.detectChanges();

    // Assert
    const checkboxes: HTMLInputElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('input[type="checkbox"]'),
    );
    expect(checkboxes[0].checked).toBe(true);
    expect(checkboxes[1].checked).toBe(false);
  });

  it('should show the clear-all button when the value array is non-empty', () => {
    // Arrange
    const fixture = setup();
    fixture.componentRef.setInput('item', buildItem());
    fixture.componentRef.setInput('filter', buildFilter([1]));

    // Act
    fixture.detectChanges();

    // Assert
    const clear = fixture.nativeElement.querySelector(
      'button[aria-label="clear"]',
    );
    expect(clear).toBeTruthy();
  });

  it('should not show the clear-all button when the value array is empty', () => {
    // Arrange
    const fixture = setup();
    fixture.componentRef.setInput('item', buildItem());
    fixture.componentRef.setInput('filter', buildFilter([]));

    // Act
    fixture.detectChanges();

    // Assert
    const clear = fixture.nativeElement.querySelector(
      'button[aria-label="clear"]',
    );
    expect(clear).toBeFalsy();
  });

  it('should render an empty list when no possibilities are available', () => {
    // Arrange
    const fixture = setup();
    const item = {
      key: 'status',
      type: '=',
      fieldType: FieldType.check,
      label: 'status.label',
    } as unknown as IModelFilter;
    fixture.componentRef.setInput('item', item);
    fixture.componentRef.setInput('filter', buildFilter([]));

    // Act
    fixture.detectChanges();

    // Assert
    const labels = fixture.nativeElement.querySelectorAll('label');
    expect(labels.length).toBe(0);
  });

  it('should trigger facade.read when a checkbox is toggled on', () => {
    // Arrange
    jest.useFakeTimers();
    const fixture = setup();
    fixture.componentRef.setInput('item', buildItem());
    fixture.componentRef.setInput('filter', buildFilter([1]));
    fixture.detectChanges();
    const secondEntry = fixture.componentInstance.list()[1];
    lastFacadeMock.read.mockClear();

    // Act
    fixture.componentInstance.onCheckChange(true, secondEntry);
    jest.advanceTimersByTime(500);

    // Assert
    expect(lastFacadeMock.read).toHaveBeenCalled();
    jest.useRealTimers();
  });
});
