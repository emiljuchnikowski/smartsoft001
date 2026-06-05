import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { IModelFilter } from '@smartsoft001/models';

import { FilterRadioComponent } from './radio.component';
import { CrudFacade } from '../../../+state/crud.facade';
import { CrudConfig } from '../../../crud.config';
import { ICrudFilter } from '../../../models';

class SomeModel {}

describe('crud-shell-angular: FilterRadioComponent', () => {
  function setup() {
    const facadeMock = { read: jest.fn() };

    TestBed.configureTestingModule({
      imports: [FilterRadioComponent],
      providers: [
        { provide: CrudFacade, useValue: facadeMock },
        provideTranslateService(),
        { provide: CrudConfig, useValue: { type: SomeModel } },
      ],
    });

    const fixture: ComponentFixture<FilterRadioComponent<any>> =
      TestBed.createComponent(FilterRadioComponent);
    return fixture;
  }

  it('should render the heading label', () => {
    // Arrange
    const fixture = setup();
    const item = {
      key: 'status',
      type: '=',
      label: 'status.label',
      possibilities: signal([
        { id: 1, text: 'a' },
        { id: 2, text: 'b' },
      ]),
    } as unknown as IModelFilter;
    fixture.componentRef.setInput('item', item);

    // Act
    fixture.detectChanges();

    // Assert
    expect(fixture.nativeElement.textContent).toContain('status.label');
  });

  it('should render one radio input per possibility', () => {
    // Arrange
    const fixture = setup();
    const item = {
      key: 'status',
      type: '=',
      label: 'status.label',
      possibilities: signal([
        { id: 1, text: 'a' },
        { id: 2, text: 'b' },
      ]),
    } as unknown as IModelFilter;
    fixture.componentRef.setInput('item', item);

    // Act
    fixture.detectChanges();

    // Assert
    const radios = fixture.nativeElement.querySelectorAll(
      'input[type="radio"]',
    );
    expect(radios.length).toBe(2);
  });

  it('should show the clear button when a matching query value is present', () => {
    // Arrange
    const fixture = setup();
    const item = {
      key: 'status',
      type: '=',
      label: 'status.label',
      possibilities: signal([
        { id: 1, text: 'a' },
        { id: 2, text: 'b' },
      ]),
    } as unknown as IModelFilter;
    const filter: ICrudFilter = {
      query: [{ key: 'status', type: '=', value: 1 }],
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
});
