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

import { InputPasswordComponent } from './password.component';
import { InputOptions } from '../../../models';
import { IModelLabelProvider } from '../../../providers';

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
    <smart-input-password
      [options]="options"
      [fieldOptions]="fieldOptions"
      [class]="cssClass"
    ></smart-input-password>
  `,
  imports: [InputPasswordComponent],
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

describe('@smartsoft001/shared-angular: InputPasswordComponent', () => {
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

    const input = fixture.nativeElement.querySelector('input');

    expect(input).toBeTruthy();
  });

  it('should render input element with type="password"', () => {
    const control = new UntypedFormControl('');
    host.options = buildOptions(control);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input');

    expect(input.getAttribute('type')).toBe('password');
  });

  it('should render label with model label text', () => {
    const control = new UntypedFormControl('');
    host.options = buildOptions(control);
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('label');

    expect(label).toBeTruthy();
    expect(label.textContent).toContain('Mock Label');
  });

  it('should render required asterisk when control has Validators.required', () => {
    const control = new UntypedFormControl('', Validators.required);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const asterisk = fixture.nativeElement.querySelector('label span');

    expect(asterisk).toBeTruthy();
    expect(asterisk.textContent).toContain('*');
  });

  it('should not render required asterisk when control is not required', () => {
    const control = new UntypedFormControl('');
    host.options = buildOptions(control);
    fixture.detectChanges();

    const asterisk = fixture.nativeElement.querySelector('label span');

    expect(asterisk).toBeFalsy();
  });

  it('should merge external class input into the input element class attribute', () => {
    const control = new UntypedFormControl('');
    host.options = buildOptions(control);
    host.cssClass = 'extra-user-class';
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input');

    expect(input.className).toContain('extra-user-class');
    expect(input.className).toContain('smart:block');
  });

  it('should render <smart-password-strength> when fieldOptions.possibilities.strength is true', () => {
    const control = new UntypedFormControl('');
    host.options = buildOptions(control);
    host.fieldOptions = { possibilities: { strength: true } };
    fixture.detectChanges();

    const strength = fixture.nativeElement.querySelector(
      'smart-password-strength',
    );

    expect(strength).toBeTruthy();
  });

  it('should not render <smart-password-strength> when fieldOptions.possibilities.strength is absent', () => {
    const control = new UntypedFormControl('');
    host.options = buildOptions(control);
    host.fieldOptions = {};
    fixture.detectChanges();

    const strength = fixture.nativeElement.querySelector(
      'smart-password-strength',
    );

    expect(strength).toBeFalsy();
  });
});
