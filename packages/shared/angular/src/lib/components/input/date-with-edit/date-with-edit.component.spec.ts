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

import { InputDateWithEditComponent } from './date-with-edit.component';
import { InputOptions } from '../../../models';
import { IModelLabelProvider } from '../../../providers';

@Model({})
class DateWithEditModel {
  @Field({ type: FieldType.date })
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
    <smart-input-date-with-edit
      [options]="options"
      [fieldOptions]="fieldOptions"
      [class]="cssClass"
    ></smart-input-date-with-edit>
  `,
  imports: [InputDateWithEditComponent],
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

describe('@smartsoft001/shared-angular: InputDateWithEditComponent', () => {
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

  it('should render <smart-date-edit> when control is present', () => {
    const control = new UntypedFormControl('');
    host.options = buildOptions(control);
    fixture.detectChanges();

    const el = fixture.nativeElement.querySelector('smart-date-edit');

    expect(el).toBeTruthy();
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

  it('should merge external class input and forward it to the <smart-date-edit> widget', () => {
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
