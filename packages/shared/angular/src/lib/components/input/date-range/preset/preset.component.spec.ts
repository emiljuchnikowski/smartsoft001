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

import { InputDateRangePresetComponent } from './preset.component';
import { InputOptions } from '../../../../models';
import { IModelLabelProvider } from '../../../../providers';

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
    <smart-input-date-range-preset
      [options]="options"
      [fieldOptions]="fieldOptions"
      [class]="cssClass"
    ></smart-input-date-range-preset>
  `,
  imports: [InputDateRangePresetComponent],
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

function getStart(fixture: ComponentFixture<TestHostComponent>) {
  return (fixture.nativeElement as HTMLElement).querySelector(
    '[data-role="date-range-start"]',
  ) as HTMLInputElement;
}

function getEnd(fixture: ComponentFixture<TestHostComponent>) {
  return (fixture.nativeElement as HTMLElement).querySelector(
    '[data-role="date-range-end"]',
  ) as HTMLInputElement;
}

describe('@smartsoft001/shared-angular: InputDateRangePresetComponent', () => {
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

  it('should render start and end date inputs when control is present', () => {
    const control = new UntypedFormControl(undefined);
    host.options = buildOptions(control);
    fixture.detectChanges();

    expect(getStart(fixture)).toBeTruthy();
    expect(getEnd(fixture)).toBeTruthy();
  });

  it('should render two inputs both with type="date"', () => {
    const control = new UntypedFormControl(undefined);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const inputs = (fixture.nativeElement as HTMLElement).querySelectorAll(
      'input',
    );

    expect(inputs.length).toBe(2);
    expect(getStart(fixture).getAttribute('type')).toBe('date');
    expect(getEnd(fixture).getAttribute('type')).toBe('date');
  });

  it('should apply translated Preline input classes', () => {
    const control = new UntypedFormControl(undefined);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const input = getStart(fixture);

    expect(input.className).toContain('smart:rounded-lg');
    expect(input.className).toContain('smart:bg-white');
    expect(input.className).toContain('smart:dark:bg-gray-800');
    expect(input.className).toContain('smart:focus:border-blue-700');
  });

  it('should render label with model label text', () => {
    const control = new UntypedFormControl(undefined);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const label = (fixture.nativeElement as HTMLElement).querySelector('label');

    expect(label).toBeTruthy();
    expect(label?.textContent).toContain('Mock Label');
  });

  it('should render required asterisk when control has Validators.required', () => {
    const control = new UntypedFormControl(undefined, Validators.required);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const asterisk = (fixture.nativeElement as HTMLElement).querySelector(
      'label span',
    );

    expect(asterisk).toBeTruthy();
    expect(asterisk?.textContent).toContain('*');
  });

  it('should not render required asterisk when control is not required', () => {
    const control = new UntypedFormControl(undefined);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const asterisk = (fixture.nativeElement as HTMLElement).querySelector(
      'label span',
    );

    expect(asterisk).toBeFalsy();
  });

  it('should populate inputs from the control value', () => {
    const control = new UntypedFormControl({
      start: '2026-01-01',
      end: '2026-02-01',
    });
    host.options = buildOptions(control);
    fixture.detectChanges();

    expect(getStart(fixture).value).toBe('2026-01-01');
    expect(getEnd(fixture).value).toBe('2026-02-01');
  });

  it('should update the control value when the start input changes', () => {
    const control = new UntypedFormControl(undefined);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const start = getStart(fixture);
    start.value = '2026-03-10';
    start.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(control.value).toEqual({ start: '2026-03-10', end: '' });
    expect(control.dirty).toBe(true);
  });

  it('should keep the existing start when the end input changes', () => {
    const control = new UntypedFormControl({ start: '2026-03-10', end: '' });
    host.options = buildOptions(control);
    fixture.detectChanges();

    const end = getEnd(fixture);
    end.value = '2026-03-20';
    end.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(control.value).toEqual({ start: '2026-03-10', end: '2026-03-20' });
  });

  it('should reset the control value to null when both inputs are cleared', () => {
    const control = new UntypedFormControl({
      start: '2026-03-10',
      end: '2026-03-20',
    });
    host.options = buildOptions(control);
    fixture.detectChanges();

    const start = getStart(fixture);
    start.value = '';
    start.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    const end = getEnd(fixture);
    end.value = '';
    end.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(control.value).toBeNull();
  });

  it('should merge external class input into the wrapper class attribute', () => {
    const control = new UntypedFormControl(undefined);
    host.options = buildOptions(control);
    host.cssClass = 'extra-user-class';
    fixture.detectChanges();

    const wrapper = (fixture.nativeElement as HTMLElement).querySelector(
      'div',
    ) as HTMLElement;

    expect(wrapper.className).toContain('extra-user-class');
    expect(wrapper.className).toContain('smart:flex');
  });
});
