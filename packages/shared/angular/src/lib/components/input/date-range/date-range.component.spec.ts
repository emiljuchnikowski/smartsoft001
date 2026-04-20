import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { Field, FieldType, Model } from '@smartsoft001/models';

import { InputDateRangeComponent } from './date-range.component';
import { InputOptions } from '../../../models';
import { IModelLabelProvider } from '../../../providers';

@Model({})
class DateRangeModel {
  @Field({ type: FieldType.dateRange })
  range: any = undefined;
}

class MockModelLabelProvider extends IModelLabelProvider {
  get() {
    return signal('Mock Label');
  }
}

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-input-date-range
      [options]="options"
      [fieldOptions]="fieldOptions"
      [class]="cssClass"
    ></smart-input-date-range>
  `,
  imports: [InputDateRangeComponent],
})
class TestHostComponent {
  options: InputOptions<any> | undefined = undefined;
  fieldOptions: any = undefined;
  cssClass = '';
}

function buildOptions(
  control: UntypedFormControl,
): InputOptions<DateRangeModel> {
  new UntypedFormGroup({ range: control });
  return {
    control,
    fieldKey: 'range',
    model: new DateRangeModel(),
    treeLevel: 0,
  };
}

describe('@smartsoft001/shared-angular: InputDateRangeComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestHostComponent,
        ReactiveFormsModule,
        FormsModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: IModelLabelProvider, useClass: MockModelLabelProvider },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  it('should render <smart-date-range> when control is present', () => {
    const control = new UntypedFormControl(undefined);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const el = fixture.nativeElement.querySelector('smart-date-range');

    expect(el).toBeTruthy();
  });

  it('should render label with model label text', () => {
    const control = new UntypedFormControl(undefined);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('label');

    expect(label).toBeTruthy();
    expect(label.textContent).toContain('Mock Label');
  });

  it('should render required asterisk when control has Validators.required', () => {
    const control = new UntypedFormControl(undefined, Validators.required);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const asterisk = fixture.nativeElement.querySelector('label span');

    expect(asterisk).toBeTruthy();
    expect(asterisk.textContent).toContain('*');
  });

  it('should bind control value to <smart-date-range> ngModel', async () => {
    const value = { dateFrom: new Date(), dateTo: new Date() };
    const control = new UntypedFormControl(value);
    host.options = buildOptions(control);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const el = fixture.debugElement.query(
      (d) => d.nativeElement?.tagName?.toLowerCase() === 'smart-date-range',
    );

    expect(el).toBeTruthy();
    expect(el.componentInstance.ngModel()).toEqual(value);
  });

  it('should merge external class input and forward it to the <smart-date-range> widget', () => {
    const control = new UntypedFormControl(undefined);
    host.options = buildOptions(control);
    host.cssClass = 'extra-user-class';
    fixture.detectChanges();

    const el = fixture.debugElement.query(
      (d) => d.nativeElement?.tagName?.toLowerCase() === 'smart-date-range',
    );

    expect(el).toBeTruthy();
    expect(el.componentInstance.cssClass()).toContain('extra-user-class');
    expect(el.componentInstance.cssClass()).toContain('smart:block');
  });
});
