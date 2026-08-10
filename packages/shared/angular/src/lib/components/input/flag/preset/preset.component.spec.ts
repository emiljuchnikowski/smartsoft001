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

import { InputFlagPresetComponent } from './preset.component';
import { InputOptions } from '../../../../models';
import { IModelLabelProvider } from '../../../../providers';

@Model({})
class FlagModel {
  @Field({ type: FieldType.flag })
  active = false;
}

class MockModelLabelProvider extends IModelLabelProvider {
  get() {
    return signal('Mock Label');
  }
}

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-input-flag-preset
      [options]="options"
      [fieldOptions]="fieldOptions"
      [class]="cssClass"
    ></smart-input-flag-preset>
  `,
  imports: [InputFlagPresetComponent],
})
class TestHostComponent {
  options: InputOptions<any> | undefined = undefined;
  fieldOptions: any = undefined;
  cssClass = '';
}

function buildOptions(control: UntypedFormControl): InputOptions<FlagModel> {
  new UntypedFormGroup({ active: control });
  return {
    control,
    fieldKey: 'active',
    model: new FlagModel(),
    treeLevel: 0,
  };
}

describe('@smartsoft001/shared-angular: InputFlagPresetComponent', () => {
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

  it('should render checkbox input when control is present', () => {
    const control = new UntypedFormControl(false);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const input = (fixture.nativeElement as HTMLElement).querySelector(
      'input[type="checkbox"]',
    );

    expect(input).toBeTruthy();
  });

  it('should apply Preline preset classes to the checkbox', () => {
    const control = new UntypedFormControl(false);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const input = (fixture.nativeElement as HTMLElement).querySelector(
      'input[type="checkbox"]',
    );

    expect(input?.className).toContain('smart:rounded-sm');
    expect(input?.className).toContain('smart:border-gray-200');
    expect(input?.className).toContain('smart:checked:bg-blue-700');
  });

  it('should render label with model label text', () => {
    const control = new UntypedFormControl(false);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const label = (fixture.nativeElement as HTMLElement).querySelector('label');

    expect(label).toBeTruthy();
    expect(label?.textContent).toContain('Mock Label');
  });

  it('should render required asterisk when control has Validators.required', () => {
    const control = new UntypedFormControl(false, Validators.required);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const asterisk = (fixture.nativeElement as HTMLElement).querySelector(
      'label span',
    );

    expect(asterisk).toBeTruthy();
    expect(asterisk?.textContent).toContain('*');
  });

  it('should reflect control.value on the checkbox (setValue(true) -> checked)', () => {
    const control = new UntypedFormControl(false);
    host.options = buildOptions(control);
    fixture.detectChanges();

    control.setValue(true);
    fixture.detectChanges();

    const input = (fixture.nativeElement as HTMLElement).querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement | null;

    expect(input?.checked).toBe(true);
  });

  it('should update control.value when the checkbox is toggled', () => {
    const control = new UntypedFormControl(false);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const input = (fixture.nativeElement as HTMLElement).querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(control.value).toBe(true);
  });

  it('should merge external class into the checkbox class attribute', () => {
    const control = new UntypedFormControl(false);
    host.options = buildOptions(control);
    host.cssClass = 'extra-user-class';
    fixture.detectChanges();

    const input = (fixture.nativeElement as HTMLElement).querySelector(
      'input[type="checkbox"]',
    );

    expect(input?.className).toContain('extra-user-class');
    expect(input?.className).toContain('smart:size-4');
  });
});
