import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ReactiveFormsModule,
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { Field, FieldType, Model } from '@smartsoft001/models';

import { InputArrayComponent } from './array.component';
import { FormFactory } from '../../../factories';
import { InputOptions } from '../../../models';
import { IModelLabelProvider } from '../../../providers';
import { FORM_COMPONENT_TOKEN } from '../../../shared.inectors';

@Model({})
class ArrayChildModel {
  @Field({})
  name = '';
}

@Model({})
class ArrayParentModel {
  @Field({ type: FieldType.array, classType: ArrayChildModel })
  items: ArrayChildModel[] = [];
}

class MockModelLabelProvider extends IModelLabelProvider {
  get() {
    return signal('Mock Label');
  }
}

@Component({
  selector: 'smart-dummy-form',
  template: '',
})
class DummyFormComponent {}

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-input-array
      [options]="options"
      [fieldOptions]="fieldOptions"
      [class]="cssClass"
    ></smart-input-array>
  `,
  imports: [InputArrayComponent],
})
class TestHostComponent {
  options: InputOptions<any> | undefined = undefined;
  fieldOptions: any = undefined;
  cssClass = '';
}

function buildOptions(
  control: UntypedFormArray,
): InputOptions<ArrayParentModel> {
  new UntypedFormGroup({ items: control });
  return {
    control,
    fieldKey: 'items',
    model: new ArrayParentModel(),
    treeLevel: 0,
  };
}

describe('@smartsoft001/shared-angular: InputArrayComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestHostComponent,
        DummyFormComponent,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: IModelLabelProvider, useClass: MockModelLabelProvider },
        { provide: FORM_COMPONENT_TOKEN, useValue: DummyFormComponent },
        {
          provide: FormFactory,
          useValue: {
            create: jest.fn().mockResolvedValue(new UntypedFormControl()),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  it('should render label with Mock Label when control is present', () => {
    const control = new UntypedFormArray([]);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('label');

    expect(label).toBeTruthy();
    expect(label.textContent).toContain('Mock Label');
  });

  it('should render the smart-button add button when possibilities.static is undefined', () => {
    const control = new UntypedFormArray([]);
    host.options = buildOptions(control);
    host.fieldOptions = { possibilities: {} };
    fixture.detectChanges();

    const smartButton = fixture.nativeElement.querySelector('smart-button');

    expect(smartButton).toBeTruthy();
  });

  it('should NOT render the smart-button add button when possibilities.static is true', () => {
    const control = new UntypedFormArray([]);
    host.options = buildOptions(control);
    host.fieldOptions = { possibilities: { static: true } };
    fixture.detectChanges();

    const smartButton = fixture.nativeElement.querySelector('smart-button');

    expect(smartButton).toBeFalsy();
  });

  it('should merge external class input into the group wrapper', () => {
    const control = new UntypedFormArray([]);
    host.options = buildOptions(control);
    host.cssClass = 'extra-user-class';
    fixture.detectChanges();

    const wrapper = fixture.nativeElement.querySelector(
      'smart-input-array > div',
    );

    expect(wrapper.className).toContain('extra-user-class');
    expect(wrapper.className).toContain('smart:mt-2');
  });
});
