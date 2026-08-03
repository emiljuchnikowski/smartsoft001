import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormControl } from '@angular/forms';
import { provideTranslateService } from '@ngx-translate/core';

import {
  InputOptions,
  IModelLabelProvider,
  MODEL_POSSIBILITIES_PROVIDER,
} from '@smartsoft001/angular';
import { IModelFilter } from '@smartsoft001/models';

import { FilterRadioComponent } from './radio.component';
import { CrudFacade } from '../../../+state/crud.facade';
import { CrudConfig } from '../../../crud.config';
import { ICrudFilter } from '../../../models';

class SomeModel {
  status?: number;
}

// smart-input-radio renders its label via ModelLabelPipe, whose fallback path
// (`toSignal(translateService.instant(...))`) throws NG0602 inside the OnPush
// reactive context. Registering an IModelLabelProvider short-circuits before
// that fallback, which is how the shared component is meant to be consumed.
class MockModelLabelProvider extends IModelLabelProvider {
  override get() {
    return signal('Mock Label');
  }
}

describe('crud-shell-angular: FilterRadioComponent', () => {
  function setup() {
    const facadeMock = { read: jest.fn() };

    TestBed.configureTestingModule({
      imports: [FilterRadioComponent],
      providers: [
        { provide: CrudFacade, useValue: facadeMock },
        provideTranslateService(),
        { provide: CrudConfig, useValue: { type: SomeModel } },
        { provide: IModelLabelProvider, useClass: MockModelLabelProvider },
        { provide: MODEL_POSSIBILITIES_PROVIDER, useValue: null },
      ],
    });

    const fixture: ComponentFixture<FilterRadioComponent<any>> =
      TestBed.createComponent(FilterRadioComponent);
    return fixture;
  }

  function buildItem(): IModelFilter {
    return {
      key: 'status',
      type: '=',
      label: 'status.label',
      possibilities: signal([
        { id: 1, text: 'a' },
        { id: 2, text: 'b' },
      ]),
    } as unknown as IModelFilter;
  }

  it('should render a smart-input-radio element', () => {
    // Arrange
    const fixture = setup();
    fixture.componentRef.setInput('item', buildItem());

    // Act
    fixture.detectChanges();

    // Assert
    const input = fixture.nativeElement.querySelector('smart-input-radio');
    expect(input).toBeTruthy();
  });

  it('should pass input options carrying the built control with the item key and a model instance', () => {
    // Arrange
    const fixture = setup();
    fixture.componentRef.setInput('item', buildItem());

    // Act
    fixture.detectChanges();

    // Assert
    const options =
      fixture.componentInstance.inputOptions() as InputOptions<any>;
    expect(options.fieldKey).toBe('status');
    expect(options.model).toBeInstanceOf(SomeModel);
    expect(options.control).toBeInstanceOf(UntypedFormControl);
  });

  it('should populate input options possibilities from the item possibilities', () => {
    // Arrange
    const fixture = setup();
    fixture.componentRef.setInput('item', buildItem());

    // Act
    fixture.detectChanges();

    // Assert
    const options =
      fixture.componentInstance.inputOptions() as InputOptions<any>;
    expect(options.possibilities?.()).toEqual([
      { id: 1, text: 'a', checked: false },
      { id: 2, text: 'b', checked: false },
    ]);
  });

  it('should render one radio input per possibility', () => {
    // Arrange
    const fixture = setup();
    fixture.componentRef.setInput('item', buildItem());

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
    const filter: ICrudFilter = {
      query: [{ key: 'status', type: '=', value: 1 }],
    };
    fixture.componentRef.setInput('item', buildItem());
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
    const filter: ICrudFilter = { query: [] };
    fixture.componentRef.setInput('item', buildItem());
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
