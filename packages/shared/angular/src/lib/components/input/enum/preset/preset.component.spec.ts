import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { Field, FieldType, Model } from '@smartsoft001/models';

import { InputEnumPresetComponent } from './preset.component';
import { InputOptions } from '../../../../models';
import {
  IModelLabelProvider,
  MODEL_POSSIBILITIES_PROVIDER,
} from '../../../../providers';

@Model({})
class EnumModel {
  @Field({
    type: FieldType.enum,
    possibilities: { Active: 1, Inactive: 2, Pending: 3 },
  })
  status = 1;
}

class MockModelLabelProvider extends IModelLabelProvider {
  get() {
    return signal('Mock Label');
  }
}

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-input-enum-preset
      [options]="options"
      [fieldOptions]="fieldOptions"
      [class]="cssClass"
    ></smart-input-enum-preset>
  `,
  imports: [InputEnumPresetComponent],
})
class TestHostComponent {
  options: InputOptions<any> | undefined = undefined;
  fieldOptions: any = undefined;
  cssClass = '';
}

function buildOptions(control: UntypedFormControl): InputOptions<EnumModel> {
  new UntypedFormGroup({ status: control });
  return {
    control,
    fieldKey: 'status',
    model: new EnumModel(),
    treeLevel: 0,
    possibilities: signal([
      { id: 1, text: 'Active', checked: false },
      { id: 2, text: 'Inactive', checked: false },
      { id: 3, text: 'Pending', checked: false },
    ]),
  };
}

describe('@smartsoft001/shared-angular: InputEnumPresetComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestHostComponent,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: IModelLabelProvider, useClass: MockModelLabelProvider },
        { provide: MODEL_POSSIBILITIES_PROVIDER, useValue: null },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  it('should render a select when control is present', () => {
    const control = new UntypedFormControl(1);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const select = (fixture.nativeElement as HTMLElement).querySelector(
      'select[data-role="select"]',
    );

    expect(select).toBeTruthy();
  });

  it('should render one option per possibilities entry', () => {
    const control = new UntypedFormControl(1);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const options = (fixture.nativeElement as HTMLElement).querySelectorAll(
      'option',
    );

    expect(options.length).toBe(3);
  });

  it('should apply Preline select classes to the select element', () => {
    const control = new UntypedFormControl(1);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const select = (fixture.nativeElement as HTMLElement).querySelector(
      'select',
    ) as HTMLSelectElement;

    expect(select.className).toContain('smart:rounded-lg');
    expect(select.className).toContain('smart:dark:bg-gray-800');
  });

  it('should render label with model label text', () => {
    const control = new UntypedFormControl(1);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const label = (fixture.nativeElement as HTMLElement).querySelector(
      'label[data-role="label"]',
    ) as HTMLLabelElement;

    expect(label).toBeTruthy();
    expect(label.textContent).toContain('Mock Label');
  });

  it('should render required asterisk when control has Validators.required', () => {
    const control = new UntypedFormControl(1, Validators.required);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const asterisk = (fixture.nativeElement as HTMLElement).querySelector(
      'label span',
    ) as HTMLElement;

    expect(asterisk).toBeTruthy();
    expect(asterisk.textContent).toContain('*');
  });

  it('should not render required asterisk when control is not required', () => {
    const control = new UntypedFormControl(1);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const asterisk = (fixture.nativeElement as HTMLElement).querySelector(
      'label span',
    );

    expect(asterisk).toBeFalsy();
  });

  it('should merge external class input into the select class attribute', () => {
    const control = new UntypedFormControl(1);
    host.options = buildOptions(control);
    host.cssClass = 'extra-user-class';
    fixture.detectChanges();

    const select = (fixture.nativeElement as HTMLElement).querySelector(
      'select',
    ) as HTMLSelectElement;

    expect(select.className).toContain('extra-user-class');
    expect(select.className).toContain('smart:rounded-lg');
  });

  it('should update control.value when an option is selected', () => {
    const control = new UntypedFormControl(1);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const select = (fixture.nativeElement as HTMLElement).querySelector(
      'select',
    ) as HTMLSelectElement;
    select.value = select.options[1].value;
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(control.value).toBe(2);
  });
});

describe('@smartsoft001/shared-angular: InputEnumPresetComponent (with a possibilities provider)', () => {
  const provider = { get: jest.fn() };

  function texts(fixture: ComponentFixture<TestHostComponent>): string[] {
    return Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('option'),
    ).map((option) => option.textContent?.trim() ?? '');
  }

  beforeEach(async () => {
    provider.get.mockReset();

    await TestBed.configureTestingModule({
      imports: [
        TestHostComponent,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: IModelLabelProvider, useClass: MockModelLabelProvider },
        { provide: MODEL_POSSIBILITIES_PROVIDER, useValue: provider },
      ],
    }).compileComponents();
  });

  afterEach(() => jest.useRealTimers());

  it('should render the possibilities of the provider over the input options', () => {
    provider.get.mockReturnValue(
      signal([{ id: 9, text: 'From provider', checked: false }]),
    );
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.options = buildOptions(new UntypedFormControl(1));

    fixture.detectChanges();

    expect(texts(fixture)).toEqual(['From provider']);
    expect(provider.get).toHaveBeenCalledWith({
      type: EnumModel,
      key: 'status',
      instance: { status: 1 },
    });
  });

  it('should render the input options while the provider has no possibilities', () => {
    provider.get.mockReturnValue(signal(null));
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.options = buildOptions(new UntypedFormControl(1));

    fixture.detectChanges();

    expect(texts(fixture)).toEqual(['Active', 'Inactive', 'Pending']);
  });

  it('should ask the provider again 500 ms after the form value changed', () => {
    jest.useFakeTimers();
    provider.get.mockImplementation(
      ({ instance }: { instance: { status: number } }) =>
        signal([
          {
            id: 9,
            text: instance.status === 2 ? 'From B' : 'From A',
            checked: false,
          },
        ]),
    );
    const control = new UntypedFormControl(1);
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.options = buildOptions(control);
    fixture.detectChanges();

    control.setValue(2);
    jest.advanceTimersByTime(500);
    fixture.detectChanges();

    expect(texts(fixture)).toEqual(['From B']);
  });

  it('should fall back to the object map of the model possibilities', () => {
    provider.get.mockReturnValue(signal(null));
    const control = new UntypedFormControl(1);
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.options = {
      ...buildOptions(control),
      possibilities: undefined,
    };
    fixture.detectChanges();
    const select = (fixture.nativeElement as HTMLElement).querySelector(
      'select',
    ) as HTMLSelectElement;

    select.value = select.options[2].value;
    select.dispatchEvent(new Event('change'));

    expect(texts(fixture)).toEqual(['Active', 'Inactive', 'Pending']);
    expect(control.value).toBe(3);
  });
});
