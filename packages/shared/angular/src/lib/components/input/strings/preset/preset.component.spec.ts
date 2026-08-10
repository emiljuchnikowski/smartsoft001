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

import { InputStringsPresetComponent } from './preset.component';
import { InputOptions } from '../../../../models';
import { IModelLabelProvider } from '../../../../providers';

@Model({})
class StringsModel {
  @Field({ type: FieldType.strings })
  tags: string[] = [];
}

class MockModelLabelProvider extends IModelLabelProvider {
  get() {
    return signal('Mock Label');
  }
}

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-input-strings-preset
      [options]="options"
      [fieldOptions]="fieldOptions"
      [class]="cssClass"
    ></smart-input-strings-preset>
  `,
  imports: [InputStringsPresetComponent],
})
class TestHostComponent {
  options: InputOptions<any> | undefined = undefined;
  fieldOptions: any = undefined;
  cssClass = '';
}

function buildOptions(control: UntypedFormControl): InputOptions<StringsModel> {
  new UntypedFormGroup({ tags: control });
  return {
    control,
    fieldKey: 'tags',
    model: new StringsModel(),
    treeLevel: 0,
  };
}

describe('@smartsoft001/shared-angular: InputStringsPresetComponent', () => {
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

  it('should render the add input when control is present', () => {
    const control = new UntypedFormControl([]);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const input = (fixture.nativeElement as HTMLElement).querySelector(
      'input[data-role="add-input"]',
    );

    expect(input).toBeTruthy();
  });

  it('should render a chip for each existing value', () => {
    const control = new UntypedFormControl(['alpha', 'beta', 'gamma']);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const chips = (fixture.nativeElement as HTMLElement).querySelectorAll(
      '[data-role="chip"]',
    );

    expect(chips.length).toBe(3);
    expect(chips[0].textContent).toContain('alpha');
  });

  it('should apply Preline soft-badge classes to chips', () => {
    const control = new UntypedFormControl(['alpha']);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const chip = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="chip"]',
    ) as HTMLElement;

    expect(chip.className).toContain('smart:rounded-full');
    expect(chip.className).toContain('smart:bg-gray-100');
    expect(chip.className).toContain('smart:dark:bg-gray-500/20');
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

  it('should add a value to the control when the add input has text and is committed', () => {
    const control = new UntypedFormControl([]);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const input = (fixture.nativeElement as HTMLElement).querySelector(
      'input[data-role="add-input"]',
    ) as HTMLInputElement;
    input.value = 'new-tag';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(control.value).toEqual(['new-tag']);

    const chips = (fixture.nativeElement as HTMLElement).querySelectorAll(
      '[data-role="chip"]',
    );
    expect(chips.length).toBe(1);
  });

  it('should not add empty/whitespace values', () => {
    const control = new UntypedFormControl([]);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const input = (fixture.nativeElement as HTMLElement).querySelector(
      'input[data-role="add-input"]',
    ) as HTMLInputElement;
    input.value = '   ';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(control.value).toEqual([]);
  });

  it('should remove a value when its remove button is clicked', () => {
    const control = new UntypedFormControl(['alpha', 'beta']);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const removeButtons = (
      fixture.nativeElement as HTMLElement
    ).querySelectorAll('[data-role="remove"]');
    (removeButtons[0] as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(control.value).toEqual(['beta']);
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
