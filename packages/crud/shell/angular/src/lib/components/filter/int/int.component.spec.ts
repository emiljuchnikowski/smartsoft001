import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormControl } from '@angular/forms';
import { provideTranslateService } from '@ngx-translate/core';

import { InputOptions, IModelLabelProvider } from '@smartsoft001/angular';
import { IModelFilter } from '@smartsoft001/models';

import { FilterIntComponent } from './int.component';
import { CrudFacade } from '../../../+state/crud.facade';
import { CrudConfig } from '../../../crud.config';
import { ICrudFilter } from '../../../models';

class SomeModel {
  age?: number;
}

// smart-input-int renders its label via ModelLabelPipe, whose fallback path
// (`toSignal(translateService.instant(...))`) throws NG0602 inside the OnPush
// reactive context. Registering an IModelLabelProvider short-circuits before
// that fallback, which is how the shared component is meant to be consumed.
class MockModelLabelProvider extends IModelLabelProvider {
  override get() {
    return signal('Mock Label');
  }
}

describe('crud-shell-angular: FilterIntComponent', () => {
  function setup() {
    const facadeMock = { read: jest.fn() };

    TestBed.configureTestingModule({
      imports: [FilterIntComponent],
      providers: [
        { provide: CrudFacade, useValue: facadeMock },
        provideTranslateService(),
        { provide: CrudConfig, useValue: { type: SomeModel } },
        { provide: IModelLabelProvider, useClass: MockModelLabelProvider },
      ],
    });

    const fixture: ComponentFixture<FilterIntComponent<any>> =
      TestBed.createComponent(FilterIntComponent);
    return fixture;
  }

  function buildItem(type = '='): IModelFilter {
    return {
      key: 'age',
      type,
      label: 'age.label',
    } as unknown as IModelFilter;
  }

  it('should render the primary smart-input-int with options carrying the value control', () => {
    // Arrange
    const fixture = setup();
    fixture.componentRef.setInput('item', buildItem());

    // Act
    fixture.detectChanges();

    // Assert
    const input = fixture.nativeElement.querySelector('smart-input-int');
    expect(input).toBeTruthy();

    const options =
      fixture.componentInstance.valueOptions() as InputOptions<any>;
    expect(options.fieldKey).toBe('age');
    expect(options.model).toBeInstanceOf(SomeModel);
    expect(options.control).toBeInstanceOf(UntypedFormControl);
  });

  it('should allow advanced only when item type is "="', () => {
    // Arrange
    const fixture = setup();
    fixture.componentRef.setInput('item', buildItem('='));
    fixture.detectChanges();

    // Assert
    expect(fixture.componentInstance.allowAdvanced).toBe(true);
  });

  it('should not allow advanced when item type is not "="', () => {
    // Arrange
    const fixture = setup();
    fixture.componentRef.setInput('item', buildItem('>='));
    fixture.detectChanges();

    // Assert
    expect(fixture.componentInstance.allowAdvanced).toBe(false);
  });

  it('should reveal native from/to number inputs when advanced is toggled on', () => {
    // Arrange
    const fixture = setup();
    fixture.componentRef.setInput('item', buildItem('='));
    fixture.detectChanges();

    // Before toggling, the only number input is the primary smart-input-int.
    expect(
      fixture.nativeElement.querySelectorAll('input[type="number"]').length,
    ).toBe(1);

    // Act
    fixture.componentInstance.toggleAdvanced();
    fixture.detectChanges();

    // Assert: primary input is hidden, two native range inputs are shown.
    const numbers = fixture.nativeElement.querySelectorAll(
      'input[type="number"]',
    );
    expect(numbers.length).toBe(2);
  });

  it('should show the clear button when a matching value query is present', () => {
    // Arrange
    const fixture = setup();
    const filter: ICrudFilter = {
      query: [{ key: 'age', type: '=', value: 5 }],
    };
    fixture.componentRef.setInput('item', buildItem('='));
    fixture.componentRef.setInput('filter', filter);

    // Act
    fixture.detectChanges();

    // Assert
    const clear = fixture.nativeElement.querySelector(
      'button[aria-label="clear"]',
    );
    expect(clear).toBeTruthy();
  });

  it('should show the clear button when a matching min (>=) query is present', () => {
    // Arrange
    const fixture = setup();
    const filter: ICrudFilter = {
      query: [{ key: 'age', type: '>=', value: 1 }],
    };
    fixture.componentRef.setInput('item', buildItem('='));
    fixture.componentRef.setInput('filter', filter);

    // Act
    fixture.detectChanges();

    // Assert
    expect(fixture.componentInstance.hasMinValue()).toBe(true);
    const clear = fixture.nativeElement.querySelector(
      'button[aria-label="clear"]',
    );
    expect(clear).toBeTruthy();
  });

  it('should not show the clear button when no matching query is present', () => {
    // Arrange
    const fixture = setup();
    const filter: ICrudFilter = { query: [] };
    fixture.componentRef.setInput('item', buildItem('='));
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
