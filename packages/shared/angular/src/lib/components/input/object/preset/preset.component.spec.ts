import { Component, Input, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicComponentInjectorToken } from 'ng-dynamic-component';

import { Field, FieldType, Model } from '@smartsoft001/models';

import { InputObjectPresetComponent } from './preset.component';
import { InputOptions } from '../../../../models';
import { IModelLabelProvider } from '../../../../providers';
import { FORM_COMPONENT_TOKEN } from '../../../../shared.inectors';

@Component({
  selector: 'smart-stub-form',
  template: `<div data-role="stub-form">stub-form</div>`,
})
class StubFormComponent {
  @Input() options: any;
}

@Model({})
class ChildModel {
  @Field({ type: FieldType.text })
  name = '';
}

@Model({})
class ObjectModel {
  @Field({ type: FieldType.object })
  child: ChildModel = new ChildModel();
}

class MockModelLabelProvider extends IModelLabelProvider {
  get() {
    return signal('Mock Label');
  }
}

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-input-object-preset
      [options]="options"
      [fieldOptions]="fieldOptions"
      [class]="cssClass"
    ></smart-input-object-preset>
  `,
  imports: [InputObjectPresetComponent],
})
class TestHostComponent {
  options: InputOptions<any> | undefined = undefined;
  fieldOptions: any = undefined;
  cssClass = '';
}

function buildOptions(control: UntypedFormControl): InputOptions<ObjectModel> {
  new UntypedFormGroup({ child: control });
  return {
    control,
    fieldKey: 'child',
    model: new ObjectModel(),
    treeLevel: 0,
  };
}

describe('@smartsoft001/shared-angular: InputObjectPresetComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestHostComponent,
        StubFormComponent,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: IModelLabelProvider, useClass: MockModelLabelProvider },
        { provide: FORM_COMPONENT_TOKEN, useValue: StubFormComponent },
        // ng-dynamic-component's IoService needs this token; a null componentRef
        // is a safe no-op stub for the isolated component test.
        {
          provide: DynamicComponentInjectorToken,
          useValue: { componentRef: null },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  it('should render label with model label text', () => {
    const control = new UntypedFormControl(null);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const label = (fixture.nativeElement as HTMLElement).querySelector('label');

    expect(label).toBeTruthy();
    expect(label?.textContent).toContain('Mock Label');
  });

  it('should apply Preline preset classes to the styled object frame', () => {
    const control = new UntypedFormControl(null);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const frame = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="object-frame"]',
    );

    expect(frame?.className).toContain('smart:rounded-lg');
    expect(frame?.className).toContain('smart:border-gray-200');
    expect(frame?.className).toContain('smart:dark:bg-gray-800');
  });

  it('should render the projected nested form component', () => {
    const control = new UntypedFormControl(null);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const nested = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="stub-form"]',
    );

    expect(nested).toBeTruthy();
  });

  it('should render required asterisk when control has Validators.required', () => {
    const control = new UntypedFormControl(null, Validators.required);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const asterisk = (fixture.nativeElement as HTMLElement).querySelector(
      'label span',
    );

    expect(asterisk).toBeTruthy();
    expect(asterisk?.textContent).toContain('*');
  });

  it('should merge external class into the object frame', () => {
    const control = new UntypedFormControl(null);
    host.options = buildOptions(control);
    host.cssClass = 'extra-user-class';
    fixture.detectChanges();

    const frame = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="object-frame"]',
    );

    expect(frame?.className).toContain('extra-user-class');
    expect(frame?.className).toContain('smart:p-4');
  });
});
