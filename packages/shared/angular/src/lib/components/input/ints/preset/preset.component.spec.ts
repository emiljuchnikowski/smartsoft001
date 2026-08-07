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

import { InputIntsPresetComponent } from './preset.component';
import { InputOptions } from '../../../../models';
import { IModelLabelProvider } from '../../../../providers';

@Model({})
class IntsModel {
  @Field({ type: FieldType.ints })
  values: number[] = [];
}

class MockModelLabelProvider extends IModelLabelProvider {
  get() {
    return signal('Mock Label');
  }
}

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-input-ints-preset
      [options]="options"
      [fieldOptions]="fieldOptions"
      [class]="cssClass"
    ></smart-input-ints-preset>
  `,
  imports: [InputIntsPresetComponent],
})
class TestHostComponent {
  options: InputOptions<any> | undefined = undefined;
  fieldOptions: any = undefined;
  cssClass = '';
}

function buildOptions(control: UntypedFormControl): InputOptions<IntsModel> {
  new UntypedFormGroup({ values: control });
  return {
    control,
    fieldKey: 'values',
    model: new IntsModel(),
    treeLevel: 0,
  };
}

describe('@smartsoft001/shared-angular: InputIntsPresetComponent', () => {
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

  it('should render number inputs when control is present', () => {
    const control = new UntypedFormControl([1, 2]);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const inputs = (fixture.nativeElement as HTMLElement).querySelectorAll(
      'input[type="number"]',
    );

    expect(inputs.length).toBeGreaterThanOrEqual(2);
  });

  it('should apply the Preline number-input look to each row', () => {
    const control = new UntypedFormControl([1]);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const group = (fixture.nativeElement as HTMLElement).querySelector(
      'label + div > div > div',
    ) as HTMLElement;

    expect(group.className).toContain('smart:bg-white');
    expect(group.className).toContain('smart:rounded-lg');
    expect(group.className).toContain('smart:border-gray-200');
  });

  it('should render decrease and increase step buttons per row', () => {
    const control = new UntypedFormControl([5]);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const decrease = (fixture.nativeElement as HTMLElement).querySelector(
      'button[aria-label="Decrease"]',
    );
    const increase = (fixture.nativeElement as HTMLElement).querySelector(
      'button[aria-label="Increase"]',
    );

    expect(decrease).toBeTruthy();
    expect(increase).toBeTruthy();
  });

  it('should increment the control value when the increase button is clicked', () => {
    const control = new UntypedFormControl([5]);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const increase = (fixture.nativeElement as HTMLElement).querySelector(
      'button[aria-label="Increase"]',
    ) as HTMLButtonElement;
    increase.click();
    fixture.detectChanges();

    expect(control.value).toEqual([6]);
  });

  it('should decrement the control value when the decrease button is clicked', () => {
    const control = new UntypedFormControl([5]);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const decrease = (fixture.nativeElement as HTMLElement).querySelector(
      'button[aria-label="Decrease"]',
    ) as HTMLButtonElement;
    decrease.click();
    fixture.detectChanges();

    expect(control.value).toEqual([4]);
  });

  it('should remove a value when its remove button is clicked', () => {
    const control = new UntypedFormControl([1, 2]);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const remove = (fixture.nativeElement as HTMLElement).querySelector(
      'button[aria-label="Remove"]',
    ) as HTMLButtonElement;
    remove.click();
    fixture.detectChanges();

    expect(control.value).toEqual([2]);
  });

  it('should render label with model label text', () => {
    const control = new UntypedFormControl([]);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const label = (fixture.nativeElement as HTMLElement).querySelector('label');

    expect(label).toBeTruthy();
    expect(label?.textContent).toContain('Mock Label');
  });

  it('should render required asterisk when control is required', () => {
    const control = new UntypedFormControl([], Validators.required);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const asterisk = (fixture.nativeElement as HTMLElement).querySelector(
      'label span',
    );

    expect(asterisk).toBeTruthy();
    expect(asterisk?.textContent).toContain('*');
  });

  it('should merge external class into the group container', () => {
    const control = new UntypedFormControl([]);
    host.options = buildOptions(control);
    host.cssClass = 'extra-user-class';
    fixture.detectChanges();

    const container = (fixture.nativeElement as HTMLElement).querySelector(
      'label + div',
    ) as HTMLElement;

    expect(container.className).toContain('extra-user-class');
  });
});
