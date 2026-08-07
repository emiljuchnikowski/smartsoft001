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

import { InputPasswordPresetComponent } from './preset.component';
import { InputOptions } from '../../../../models';
import { IModelLabelProvider } from '../../../../providers';

@Model({})
class PasswordModel {
  @Field({ type: FieldType.password })
  password = '';
}

class MockModelLabelProvider extends IModelLabelProvider {
  get() {
    return signal('Mock Label');
  }
}

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-input-password-preset
      [options]="options"
      [fieldOptions]="fieldOptions"
      [class]="cssClass"
    ></smart-input-password-preset>
  `,
  imports: [InputPasswordPresetComponent],
})
class TestHostComponent {
  options: InputOptions<any> | undefined = undefined;
  fieldOptions: any = undefined;
  cssClass = '';
}

function buildOptions(
  control: UntypedFormControl,
): InputOptions<PasswordModel> {
  new UntypedFormGroup({ password: control });
  return {
    control,
    fieldKey: 'password',
    model: new PasswordModel(),
    treeLevel: 0,
  };
}

describe('@smartsoft001/shared-angular: InputPasswordPresetComponent', () => {
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

  it('should render input element with type="password"', () => {
    const control = new UntypedFormControl('');
    host.options = buildOptions(control);
    fixture.detectChanges();

    const input = (fixture.nativeElement as HTMLElement).querySelector('input');

    expect(input?.getAttribute('type')).toBe('password');
  });

  it('should apply Preline input classes', () => {
    const control = new UntypedFormControl('');
    host.options = buildOptions(control);
    fixture.detectChanges();

    const input = (fixture.nativeElement as HTMLElement).querySelector('input');

    expect(input?.className).toContain('smart:py-2.5');
    expect(input?.className).toContain('smart:rounded-md');
    expect(input?.className).toContain('smart:focus:ring-blue-600');
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

  it('should merge external class input into the input element class attribute', () => {
    const control = new UntypedFormControl('');
    host.options = buildOptions(control);
    host.cssClass = 'extra-user-class';
    fixture.detectChanges();

    const input = (fixture.nativeElement as HTMLElement).querySelector('input');

    expect(input?.className).toContain('extra-user-class');
    expect(input?.className).toContain('smart:block');
  });

  it('should render the strength meter when fieldOptions.possibilities.strength is true', () => {
    const control = new UntypedFormControl('');
    host.options = buildOptions(control);
    host.fieldOptions = { possibilities: { strength: true } };
    fixture.detectChanges();

    const meter = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="strength-meter"]',
    );
    const bars = (fixture.nativeElement as HTMLElement).querySelectorAll(
      '[data-role="strength-bar"]',
    );

    expect(meter).toBeTruthy();
    expect(bars.length).toBe(5);
  });

  it('should not render the strength meter when strength is absent', () => {
    const control = new UntypedFormControl('');
    host.options = buildOptions(control);
    host.fieldOptions = {};
    fixture.detectChanges();

    const meter = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="strength-meter"]',
    );

    expect(meter).toBeFalsy();
  });

  it('should mark all five rules as passed for a strong password', () => {
    const control = new UntypedFormControl('Abcdef1!');
    host.options = buildOptions(control);
    host.fieldOptions = { possibilities: { strength: true } };
    fixture.detectChanges();

    const preset = fixture.debugElement.children[0]
      .componentInstance as InputPasswordPresetComponent<PasswordModel>;

    expect(preset.passedCount()).toBe(5);
    expect(preset.accepted()).toBe(true);
    expect(preset.levelText()).toBe('Super Strong');
  });

  it('should set a passwordStrength error when the value is too weak', () => {
    const control = new UntypedFormControl('abc');
    host.options = buildOptions(control);
    host.fieldOptions = { possibilities: { strength: true } };
    fixture.detectChanges();

    expect(control.errors?.['passwordStrength']).toBe(true);
  });
});
