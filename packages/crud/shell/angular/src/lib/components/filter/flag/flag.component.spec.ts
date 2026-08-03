import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormControl } from '@angular/forms';
import { provideTranslateService } from '@ngx-translate/core';

import { InputOptions, IModelLabelProvider } from '@smartsoft001/angular';
import { IModelFilter } from '@smartsoft001/models';

import { FilterFlagComponent } from './flag.component';
import { CrudFacade } from '../../../+state/crud.facade';
import { CrudConfig } from '../../../crud.config';
import { ICrudFilter } from '../../../models';

class SomeModel {
  active?: boolean;
}

// smart-input-flag renders its label via ModelLabelPipe, whose fallback path
// (`toSignal(translateService.instant(...))`) throws NG0602 inside the OnPush
// reactive context. Registering an IModelLabelProvider short-circuits before
// that fallback, which is how the shared component is meant to be consumed.
class MockModelLabelProvider extends IModelLabelProvider {
  override get() {
    return signal('Mock Label');
  }
}

describe('crud-shell-angular: FilterFlagComponent', () => {
  function setup() {
    const facadeMock = { read: jest.fn() };

    TestBed.configureTestingModule({
      imports: [FilterFlagComponent],
      providers: [
        { provide: CrudFacade, useValue: facadeMock },
        provideTranslateService(),
        { provide: CrudConfig, useValue: { type: SomeModel } },
        { provide: IModelLabelProvider, useClass: MockModelLabelProvider },
      ],
    });

    const fixture: ComponentFixture<FilterFlagComponent<any>> =
      TestBed.createComponent(FilterFlagComponent);
    return fixture;
  }

  it('should render a smart-input-flag element', () => {
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
    const input = fixture.nativeElement.querySelector('smart-input-flag');
    expect(input).toBeTruthy();
  });

  it('should pass input options carrying the built control with the item key and a model instance', () => {
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
    const options =
      fixture.componentInstance.inputOptions() as InputOptions<any>;
    expect(options.fieldKey).toBe('active');
    expect(options.model).toBeInstanceOf(SomeModel);
    expect(options.control).toBeInstanceOf(UntypedFormControl);
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
