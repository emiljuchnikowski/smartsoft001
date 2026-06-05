import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { IModelFilter } from '@smartsoft001/models';

import { FilterFlagComponent } from './flag.component';
import { CrudFacade } from '../../../+state/crud.facade';
import { CrudConfig } from '../../../crud.config';
import { ICrudFilter } from '../../../models';

class SomeModel {}

describe('crud-shell-angular: FilterFlagComponent', () => {
  function setup() {
    const facadeMock = { read: jest.fn() };

    TestBed.configureTestingModule({
      imports: [FilterFlagComponent],
      providers: [
        { provide: CrudFacade, useValue: facadeMock },
        provideTranslateService(),
        { provide: CrudConfig, useValue: { type: SomeModel } },
      ],
    });

    const fixture: ComponentFixture<FilterFlagComponent<any>> =
      TestBed.createComponent(FilterFlagComponent);
    return fixture;
  }

  it('should render the translated label', () => {
    // Arrange
    const fixture = setup();
    const item = {
      key: 'active',
      type: '=',
      label: 'active.label',
    } as unknown as IModelFilter;
    fixture.componentRef.setInput('item', item);

    // Act
    fixture.detectChanges();

    // Assert
    expect(fixture.nativeElement.textContent).toContain('active.label');
  });

  it('should render a native checkbox input', () => {
    // Arrange
    const fixture = setup();

    // Act
    fixture.detectChanges();

    // Assert
    const checkbox = fixture.nativeElement.querySelector(
      'input[type="checkbox"]',
    );
    expect(checkbox).toBeTruthy();
  });

  it('should show the clear button when the query value is boolean', () => {
    // Arrange
    const fixture = setup();
    const item = {
      key: 'active',
      type: '=',
      label: 'active.label',
    } as unknown as IModelFilter;
    const filter: ICrudFilter = {
      query: [{ key: 'active', type: '=', value: false }],
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
    const fixture = setup();
    const item = {
      key: 'active',
      type: '=',
      label: 'active.label',
    } as unknown as IModelFilter;
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
