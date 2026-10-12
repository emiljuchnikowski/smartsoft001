import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { Field, FieldType, Model } from '@smartsoft001/models';

import { InputRadioComponent } from './radio.component';
import { InputOptions } from '../../../models';
import {
  IModelLabelProvider,
  MODEL_POSSIBILITIES_PROVIDER,
} from '../../../providers';

@Model({})
class RadioModel {
  @Field({
    type: FieldType.radio,
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
    <smart-input-radio
      [options]="options"
      [fieldOptions]="fieldOptions"
      [class]="cssClass"
    ></smart-input-radio>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputRadioComponent],
})
class TestHostComponent {
  options: InputOptions<any> | undefined = undefined;
  fieldOptions: any = undefined;
  cssClass = '';
}

function buildOptions(control: UntypedFormControl): InputOptions<RadioModel> {
  new UntypedFormGroup({ status: control });
  return {
    control,
    fieldKey: 'status',
    model: new RadioModel(),
    treeLevel: 0,
    possibilities: signal([
      { id: 1, text: 'Active', checked: false },
      { id: 2, text: 'Inactive', checked: false },
      { id: 3, text: 'Pending', checked: false },
    ]),
  };
}

describe('@smartsoft001/shared-angular: InputRadioComponent', () => {
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

  it('should render fieldset when control is present', () => {
    const control = new UntypedFormControl(1);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const fieldset = fixture.nativeElement.querySelector('fieldset');

    expect(fieldset).toBeTruthy();
  });

  it('should render a radio input per possibilities entry', () => {
    const control = new UntypedFormControl(1);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const radios = fixture.nativeElement.querySelectorAll(
      'input[type="radio"]',
    );

    expect(radios.length).toBe(3);
  });

  it('should render legend with model label text', () => {
    const control = new UntypedFormControl(1);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const legend = fixture.nativeElement.querySelector('legend');

    expect(legend).toBeTruthy();
    expect(legend.textContent).toContain('Mock Label');
  });

  it('should render required asterisk when control has Validators.required', () => {
    const control = new UntypedFormControl(1, Validators.required);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const asterisk = fixture.nativeElement.querySelector('legend span');

    expect(asterisk).toBeTruthy();
    expect(asterisk.textContent).toContain('*');
  });

  it('should merge external class into the group container', () => {
    const control = new UntypedFormControl(1);
    host.options = buildOptions(control);
    host.cssClass = 'extra-user-class';
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector(
      'fieldset > div',
    ) as HTMLElement;

    expect(container.className).toContain('extra-user-class');
    expect(container.className).toContain('smart:mt-2');
  });

  it('should update control.value when a radio is selected', () => {
    const control = new UntypedFormControl(1);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const radios = fixture.nativeElement.querySelectorAll(
      'input[type="radio"]',
    ) as NodeListOf<HTMLInputElement>;
    radios[1].checked = true;
    radios[1].dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(control.value).toBe(2);
  });
});

describe('@smartsoft001/shared-angular: InputRadioComponent (no possibilities provider)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestHostComponent,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: IModelLabelProvider, useClass: MockModelLabelProvider },
        // NOTE: MODEL_POSSIBILITIES_PROVIDER intentionally NOT provided.
      ],
    }).compileComponents();
  });

  it('should create without MODEL_POSSIBILITIES_PROVIDER provided', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    const control = new UntypedFormControl(1);
    fixture.componentInstance.options = buildOptions(control);

    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should expose getPossibilitiesFromProvider() returning a null signal', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    const control = new UntypedFormControl(1);
    fixture.componentInstance.options = buildOptions(control);
    fixture.detectChanges();

    const radio = fixture.debugElement.children[0]
      .componentInstance as InputRadioComponent<any> & {
      getPossibilitiesFromProvider: () => { (): unknown };
    };

    expect(radio.getPossibilitiesFromProvider()()).toBeNull();
  });
});

describe('@smartsoft001/shared-angular: InputRadioComponent (with a possibilities provider)', () => {
  const provider = { get: jest.fn() };

  function texts(fixture: ComponentFixture<TestHostComponent>): string[] {
    return Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('label span'),
    ).map((span) => span.textContent?.trim() ?? '');
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
      type: RadioModel,
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

  it('should render the possibilities the provider sets later', () => {
    const fromProvider = signal<
      { id: number; text: string; checked: boolean }[] | null
    >(null);
    provider.get.mockReturnValue(fromProvider);
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.options = buildOptions(new UntypedFormControl(1));
    fixture.detectChanges();

    fromProvider.set([{ id: 9, text: 'Loaded', checked: false }]);
    fixture.detectChanges();

    expect(texts(fixture)).toEqual(['Loaded']);
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
    expect(provider.get).toHaveBeenLastCalledWith(
      expect.objectContaining({ instance: { status: 2 } }),
    );
  });

  it('should keep the list of the provider until it answers again', () => {
    jest.useFakeTimers();
    const next = signal<
      { id: number; text: string; checked: boolean }[] | null
    >(null);
    provider.get
      .mockReturnValueOnce(signal([{ id: 9, text: 'First', checked: false }]))
      .mockReturnValueOnce(next);
    const control = new UntypedFormControl(1);
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.options = buildOptions(control);
    fixture.detectChanges();
    control.setValue(2);
    jest.advanceTimersByTime(500);
    fixture.detectChanges();
    const whileAsking = texts(fixture);

    next.set([{ id: 9, text: 'Second', checked: false }]);
    fixture.detectChanges();

    expect(whileAsking).toEqual(['First']);
    expect(texts(fixture)).toEqual(['Second']);
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
    const radios = (fixture.nativeElement as HTMLElement).querySelectorAll(
      'input[type="radio"]',
    ) as NodeListOf<HTMLInputElement>;

    radios[1].checked = true;
    radios[1].dispatchEvent(new Event('change'));

    expect(texts(fixture)).toEqual(['Active', 'Inactive', 'Pending']);
    expect(control.value).toBe(2);
  });
});
