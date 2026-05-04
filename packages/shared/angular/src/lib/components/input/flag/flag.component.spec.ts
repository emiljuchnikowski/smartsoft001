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

import { InputFlagComponent } from './flag.component';
import { InputOptions } from '../../../models';
import { IModelLabelProvider } from '../../../providers';

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
    <smart-input-flag
      [options]="options"
      [fieldOptions]="fieldOptions"
      [class]="cssClass"
    ></smart-input-flag>
  `,
  imports: [InputFlagComponent],
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

describe('@smartsoft001/shared-angular: InputFlagComponent', () => {
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

    const input = fixture.nativeElement.querySelector('input[type="checkbox"]');

    expect(input).toBeTruthy();
  });

  it('should render label with model label text', () => {
    const control = new UntypedFormControl(false);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('label');

    expect(label).toBeTruthy();
    expect(label.textContent).toContain('Mock Label');
  });

  it('should render required asterisk when control has Validators.required', () => {
    const control = new UntypedFormControl(false, Validators.required);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const asterisk = fixture.nativeElement.querySelector('label span');

    expect(asterisk).toBeTruthy();
    expect(asterisk.textContent).toContain('*');
  });

  it('should merge external class input into the checkbox input class attribute', () => {
    const control = new UntypedFormControl(false);
    host.options = buildOptions(control);
    host.cssClass = 'extra-user-class';
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[type="checkbox"]');

    expect(input.className).toContain('extra-user-class');
    expect(input.className).toContain('smart:h-4');
  });

  it('should reflect control.value on the checkbox (setValue(true) -> checked)', () => {
    const control = new UntypedFormControl(false);
    host.options = buildOptions(control);
    fixture.detectChanges();

    control.setValue(true);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[type="checkbox"]');

    expect(input.checked).toBe(true);
  });

  it('should update control.value when the checkbox is toggled', () => {
    const control = new UntypedFormControl(false);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[type="checkbox"]');
    input.checked = true;
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(control.value).toBe(true);
  });
});
