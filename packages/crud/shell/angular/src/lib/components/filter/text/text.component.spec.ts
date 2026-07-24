import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormControl } from '@angular/forms';
import { provideTranslateService } from '@ngx-translate/core';

import { InputOptions, IModelLabelProvider } from '@smartsoft001/angular';
import { IModelFilter } from '@smartsoft001/models';

import { FilterTextComponent } from './text.component';
import { CrudFacade } from '../../../+state/crud.facade';
import { CrudConfig } from '../../../crud.config';
import { ICrudFilter } from '../../../models';

class SomeModel {
  name?: string;
}

// smart-input-text renders its label via ModelLabelPipe, whose fallback path
// (`toSignal(translateService.instant(...))`) throws NG0602 inside the OnPush
// reactive context. Registering an IModelLabelProvider short-circuits before
// that fallback, which is how the shared component is meant to be consumed.
class MockModelLabelProvider extends IModelLabelProvider {
  override get() {
    return signal('Mock Label');
  }
}

describe('crud-shell-angular: FilterTextComponent', () => {
  function setup() {
    const facadeMock = { read: jest.fn() };

    TestBed.configureTestingModule({
      imports: [FilterTextComponent],
      providers: [
        { provide: CrudFacade, useValue: facadeMock },
        provideTranslateService(),
        { provide: CrudConfig, useValue: { type: SomeModel } },
        { provide: IModelLabelProvider, useClass: MockModelLabelProvider },
      ],
    });

    const fixture: ComponentFixture<FilterTextComponent<any>> =
      TestBed.createComponent(FilterTextComponent);
    return fixture;
  }

  it('should render a smart-input-text element', () => {
    // Arrange
    const fixture = setup();
    const item = {
      key: 'name',
      type: '=',
      label: 'name.label',
    } as unknown as IModelFilter;
    fixture.componentRef.setInput('item', item);

    // Act
    fixture.detectChanges();

    // Assert
    const input = fixture.nativeElement.querySelector('smart-input-text');
    expect(input).toBeTruthy();
  });

  it('should pass input options carrying the built control with the item key and a model instance', () => {
    // Arrange
    const fixture = setup();
    const item = {
      key: 'name',
      type: '=',
      label: 'name.label',
    } as unknown as IModelFilter;
    fixture.componentRef.setInput('item', item);

    // Act
    fixture.detectChanges();

    // Assert
    const options =
      fixture.componentInstance.inputOptions() as InputOptions<any>;
    expect(options.fieldKey).toBe('name');
    expect(options.model).toBeInstanceOf(SomeModel);
    expect(options.control).toBeInstanceOf(UntypedFormControl);
  });

  it('should show the clear button when a matching query value is present', () => {
    // Arrange
    const fixture = setup();
    const item = {
      key: 'name',
      type: '=',
      label: 'name.label',
    } as unknown as IModelFilter;
    const filter: ICrudFilter = {
      query: [{ key: 'name', type: '=', value: 'abc' }],
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
      key: 'name',
      type: '=',
      label: 'name.label',
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
