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

import { InputEnumComponent } from './enum.component';
import { InputOptions } from '../../../models';
import { IModelLabelProvider } from '../../../providers';

enum StatusEnum {
  Active = 'Active',
  Inactive = 'Inactive',
  Pending = 'Pending',
}

@Model({})
class EnumModel {
  @Field({ type: FieldType.enum, possibilities: StatusEnum })
  status: StatusEnum[] = [];
}

class MockModelLabelProvider extends IModelLabelProvider {
  get() {
    return signal('Mock Label');
  }
}

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-input-enum
      [options]="options"
      [fieldOptions]="fieldOptions"
      [class]="cssClass"
    ></smart-input-enum>
  `,
  imports: [InputEnumComponent],
})
class TestHostComponent {
  options: InputOptions<any> | undefined = undefined;
  fieldOptions: any = { possibilities: StatusEnum };
  cssClass = '';
}

function buildOptions(control: UntypedFormControl): InputOptions<EnumModel> {
  new UntypedFormGroup({ status: control });
  return {
    control,
    fieldKey: 'status',
    model: new EnumModel(),
    treeLevel: 0,
  };
}

describe('@smartsoft001/shared-angular: InputEnumComponent', () => {
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

  it('should render fieldset when control is present', () => {
    const control = new UntypedFormControl([]);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const fieldset = fixture.nativeElement.querySelector('fieldset');

    expect(fieldset).toBeTruthy();
  });

  it('should render a checkbox per enum value', () => {
    const control = new UntypedFormControl([]);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const checkboxes = fixture.nativeElement.querySelectorAll(
      'input[type="checkbox"]',
    );

    expect(checkboxes.length).toBe(3);
  });

  it('should render legend with model label text', () => {
    const control = new UntypedFormControl([]);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const legend = fixture.nativeElement.querySelector('legend');

    expect(legend).toBeTruthy();
    expect(legend.textContent).toContain('Mock Label');
  });

  it('should render required asterisk when control has Validators.required', () => {
    const control = new UntypedFormControl([], Validators.required);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const asterisk = fixture.nativeElement.querySelector('legend span');

    expect(asterisk).toBeTruthy();
    expect(asterisk.textContent).toContain('*');
  });

  it('should merge external class into the group container', () => {
    const control = new UntypedFormControl([]);
    host.options = buildOptions(control);
    host.cssClass = 'extra-user-class';
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector(
      'fieldset > div',
    ) as HTMLElement;

    expect(container.className).toContain('extra-user-class');
    expect(container.className).toContain('smart:mt-2');
  });
});
