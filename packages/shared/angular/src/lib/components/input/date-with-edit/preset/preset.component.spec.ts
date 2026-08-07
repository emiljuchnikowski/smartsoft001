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

import { InputDateWithEditPresetComponent } from './preset.component';
import { InputOptions } from '../../../../models';
import { IModelLabelProvider } from '../../../../providers';

@Model({})
class DateWithEditModel {
  @Field({ type: FieldType.dateWithEdit })
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
    <smart-input-date-with-edit-preset
      [options]="options"
      [fieldOptions]="fieldOptions"
      [class]="cssClass"
    ></smart-input-date-with-edit-preset>
  `,
  imports: [InputDateWithEditPresetComponent],
})
class TestHostComponent {
  options: InputOptions<any> | undefined = undefined;
  fieldOptions: any = undefined;
  cssClass = '';
}

function buildOptions(
  control: UntypedFormControl,
): InputOptions<DateWithEditModel> {
  new UntypedFormGroup({ birthDate: control });
  return {
    control,
    fieldKey: 'birthDate',
    model: new DateWithEditModel(),
    treeLevel: 0,
  };
}

describe('@smartsoft001/shared-angular: InputDateWithEditPresetComponent', () => {
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

  it('should render the <smart-date-edit> widget when control is present', () => {
    const control = new UntypedFormControl('');
    host.options = buildOptions(control);
    fixture.detectChanges();

    const el = (fixture.nativeElement as HTMLElement).querySelector(
      'smart-date-edit',
    );

    expect(el).toBeTruthy();
  });

  it('should render the date-edit widget in the preset variant', () => {
    const control = new UntypedFormControl('');
    host.options = buildOptions(control);
    fixture.detectChanges();

    const el = fixture.debugElement.query(
      (d) => d.nativeElement?.tagName?.toLowerCase() === 'smart-date-edit',
    );

    expect(el).toBeTruthy();
    expect(el.componentInstance.variant()).toBe('preset');
  });

  it('should apply translated Preline label classes', () => {
    const control = new UntypedFormControl('');
    host.options = buildOptions(control);
    fixture.detectChanges();

    const label = (fixture.nativeElement as HTMLElement).querySelector('label');

    expect(label?.className).toContain('smart:mb-2');
    expect(label?.className).toContain('smart:text-sm');
    expect(label?.className).toContain('smart:text-gray-900');
    expect(label?.className).toContain('smart:dark:text-white');
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

  it('should merge external class input and forward it to the date-edit widget', () => {
    const control = new UntypedFormControl('');
    host.options = buildOptions(control);
    host.cssClass = 'extra-user-class';
    fixture.detectChanges();

    const el = fixture.debugElement.query(
      (d) => d.nativeElement?.tagName?.toLowerCase() === 'smart-date-edit',
    );

    expect(el).toBeTruthy();
    expect(el.componentInstance.cssClass()).toContain('extra-user-class');
    expect(el.componentInstance.cssClass()).toContain('smart:block');
  });

  it('should destroy without throwing (ngOnDestroy cleanup)', () => {
    const control = new UntypedFormControl('');
    host.options = buildOptions(control);
    fixture.detectChanges();

    expect(() => fixture.destroy()).not.toThrow();
  });
});
