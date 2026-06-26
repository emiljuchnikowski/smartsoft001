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

import { InputLongTextPresetComponent } from './preset.component';
import { InputOptions } from '../../../../models';
import { IModelLabelProvider } from '../../../../providers';

@Model({})
class LongTextModel {
  @Field({ type: FieldType.longText })
  description = '';
}

class MockModelLabelProvider extends IModelLabelProvider {
  get() {
    return signal('Mock Label');
  }
}

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-input-long-text-preset
      [options]="options"
      [fieldOptions]="fieldOptions"
      [class]="cssClass"
    ></smart-input-long-text-preset>
  `,
  imports: [InputLongTextPresetComponent],
})
class TestHostComponent {
  options: InputOptions<any> | undefined = undefined;
  fieldOptions: any = undefined;
  cssClass = '';
}

function buildOptions(
  control: UntypedFormControl,
): InputOptions<LongTextModel> {
  new UntypedFormGroup({ description: control });
  return {
    control,
    fieldKey: 'description',
    model: new LongTextModel(),
    treeLevel: 0,
  };
}

describe('@smartsoft001/shared-angular: InputLongTextPresetComponent', () => {
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

  it('should render a textarea when control is present', () => {
    const control = new UntypedFormControl('');
    host.options = buildOptions(control);
    fixture.detectChanges();

    const textarea = (fixture.nativeElement as HTMLElement).querySelector(
      'textarea',
    );

    expect(textarea).toBeTruthy();
  });

  it('should render label with model label text', () => {
    const control = new UntypedFormControl('');
    host.options = buildOptions(control);
    fixture.detectChanges();

    const label = (fixture.nativeElement as HTMLElement).querySelector('label');

    expect(label).toBeTruthy();
    expect(label?.textContent).toContain('Mock Label');
  });

  it('should apply Preline textarea classes', () => {
    const control = new UntypedFormControl('');
    host.options = buildOptions(control);
    fixture.detectChanges();

    const textarea = (fixture.nativeElement as HTMLElement).querySelector(
      'textarea',
    ) as HTMLTextAreaElement;

    expect(textarea.className).toContain('smart:w-full');
    expect(textarea.className).toContain('smart:rounded-lg');
    expect(textarea.className).toContain('smart:dark:bg-gray-800');
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

  it('should merge external class input into the textarea class attribute', () => {
    const control = new UntypedFormControl('');
    host.options = buildOptions(control);
    host.cssClass = 'extra-user-class';
    fixture.detectChanges();

    const textarea = (fixture.nativeElement as HTMLElement).querySelector(
      'textarea',
    ) as HTMLTextAreaElement;

    expect(textarea.className).toContain('extra-user-class');
  });

  it('should reflect the form control value in the textarea', () => {
    const control = new UntypedFormControl('hello world');
    host.options = buildOptions(control);
    fixture.detectChanges();

    const textarea = (fixture.nativeElement as HTMLElement).querySelector(
      'textarea',
    ) as HTMLTextAreaElement;

    expect(textarea.value).toBe('hello world');
  });
});
