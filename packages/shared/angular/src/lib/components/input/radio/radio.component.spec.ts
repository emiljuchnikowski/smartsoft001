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
