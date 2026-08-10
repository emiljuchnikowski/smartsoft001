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

import { InputDatePresetComponent } from './preset.component';
import { InputOptions } from '../../../../models';
import { IModelLabelProvider } from '../../../../providers';

@Model({})
class DateModel {
  @Field({ type: FieldType.date })
  birthDate = '';
}

class MockModelLabelProvider extends IModelLabelProvider {
  get() {
    return signal('Mock Label');
  }
}

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-input-date-preset
      [options]="options"
      [fieldOptions]="fieldOptions"
      [class]="cssClass"
    ></smart-input-date-preset>
  `,
  imports: [InputDatePresetComponent],
})
class TestHostComponent {
  options: InputOptions<any> | undefined = undefined;
  fieldOptions: any = undefined;
  cssClass = '';
}

function buildOptions(control: UntypedFormControl): InputOptions<DateModel> {
  new UntypedFormGroup({ birthDate: control });
  return {
    control,
    fieldKey: 'birthDate',
    model: new DateModel(),
    treeLevel: 0,
  };
}

describe('@smartsoft001/shared-angular: InputDatePresetComponent', () => {
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
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  it('should render input when control is present', () => {
    const control = new UntypedFormControl('');
    host.options = buildOptions(control);
    fixture.detectChanges();

    const input = (fixture.nativeElement as HTMLElement).querySelector('input');

    expect(input).toBeTruthy();
  });

  it('should render input element with type="date"', () => {
    const control = new UntypedFormControl('');
    host.options = buildOptions(control);
    fixture.detectChanges();

    const input = (fixture.nativeElement as HTMLElement).querySelector('input');

    expect(input?.getAttribute('type')).toBe('date');
  });

  it('should apply translated Preline input classes', () => {
    const control = new UntypedFormControl('');
    host.options = buildOptions(control);
    fixture.detectChanges();

    const input = (fixture.nativeElement as HTMLElement).querySelector('input');

    expect(input?.className).toContain('smart:rounded-lg');
    expect(input?.className).toContain('smart:bg-white');
    expect(input?.className).toContain('smart:dark:bg-gray-800');
    expect(input?.className).toContain('smart:focus:border-blue-700');
  });

  it('should render label with model label text', () => {
    const control = new UntypedFormControl('');
    host.options = buildOptions(control);
    fixture.detectChanges();

    const label = (fixture.nativeElement as HTMLElement).querySelector('label');

    expect(label).toBeTruthy();
    expect(label?.textContent).toContain('Mock Label');
  });

  it('should render required asterisk when control has Validators.required', () => {
    const control = new UntypedFormControl('', Validators.required);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const asterisk = (fixture.nativeElement as HTMLElement).querySelector(
      'label span',
    );

    expect(asterisk).toBeTruthy();
    expect(asterisk?.textContent).toContain('*');
  });

  it('should not render required asterisk when control is not required', () => {
    const control = new UntypedFormControl('');
    host.options = buildOptions(control);
    fixture.detectChanges();

    const asterisk = (fixture.nativeElement as HTMLElement).querySelector(
      'label span',
    );

    expect(asterisk).toBeFalsy();
  });

  it('should bind the form control value to the input', () => {
    const control = new UntypedFormControl('2026-06-26');
    host.options = buildOptions(control);
    fixture.detectChanges();

    const input = (fixture.nativeElement as HTMLElement).querySelector(
      'input',
    ) as HTMLInputElement;

    expect(input.value).toBe('2026-06-26');
  });

  it('should merge external class input into the input element class attribute', () => {
    const control = new UntypedFormControl('');
    host.options = buildOptions(control);
    host.cssClass = 'extra-user-class';
    fixture.detectChanges();

    const input = (fixture.nativeElement as HTMLElement).querySelector('input');

    expect(input?.className).toContain('extra-user-class');
    expect(input?.className).toContain('smart:block');
  });

  it('should render a single input element', () => {
    const control = new UntypedFormControl('');
    host.options = buildOptions(control);
    fixture.detectChanges();

    const inputs = (fixture.nativeElement as HTMLElement).querySelectorAll(
      'input',
    );

    expect(inputs.length).toBe(1);
  });
});
