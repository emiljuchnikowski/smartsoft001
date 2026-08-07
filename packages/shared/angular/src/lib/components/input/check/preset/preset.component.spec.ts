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

import { InputCheckPresetComponent } from './preset.component';
import { InputOptions } from '../../../../models';
import {
  IModelLabelProvider,
  MODEL_POSSIBILITIES_PROVIDER,
} from '../../../../providers';

@Model({})
class CheckModel {
  @Field({ type: FieldType.check })
  tags: any[] = [];
}

class MockModelLabelProvider extends IModelLabelProvider {
  get() {
    return signal('Mock Label');
  }
}

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-input-check-preset
      [options]="options"
      [fieldOptions]="fieldOptions"
      [class]="cssClass"
    ></smart-input-check-preset>
  `,
  imports: [InputCheckPresetComponent],
})
class TestHostComponent {
  options: InputOptions<any> | undefined = undefined;
  fieldOptions: any = undefined;
  cssClass = '';
}

function buildOptions(control: UntypedFormControl): InputOptions<CheckModel> {
  new UntypedFormGroup({ tags: control });
  return {
    control,
    fieldKey: 'tags',
    model: new CheckModel(),
    treeLevel: 0,
    possibilities: signal([
      { id: 'a', text: 'Alpha', checked: false },
      { id: 'b', text: 'Beta', checked: false },
      { id: 'c', text: 'Gamma', checked: false },
    ]),
  };
}

describe('@smartsoft001/shared-angular: InputCheckPresetComponent', () => {
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
        { provide: MODEL_POSSIBILITIES_PROVIDER, useValue: null },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  it('should render fieldset with legend label when control is present', () => {
    const control = new UntypedFormControl([]);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const fieldset = el.querySelector('fieldset');
    const legend = el.querySelector('legend');

    expect(fieldset).toBeTruthy();
    expect(legend?.textContent).toContain('Mock Label');
  });

  it('should render a checkbox per possibilities entry', () => {
    const control = new UntypedFormControl([]);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const checkboxes = (fixture.nativeElement as HTMLElement).querySelectorAll(
      'input[type="checkbox"]',
    );

    expect(checkboxes.length).toBe(3);
  });

  it('should apply the Preline default-checkbox classes to inputs', () => {
    const control = new UntypedFormControl([]);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const checkbox = (fixture.nativeElement as HTMLElement).querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;

    expect(checkbox.className).toContain('smart:size-4');
    expect(checkbox.className).toContain('smart:rounded-sm');
    expect(checkbox.className).toContain('smart:checked:bg-blue-700');
    expect(checkbox.className).toContain('smart:dark:checked:bg-blue-600');
  });

  it('should render required asterisk when control has Validators.required', () => {
    const control = new UntypedFormControl([], Validators.required);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const asterisk = (fixture.nativeElement as HTMLElement).querySelector(
      'legend span',
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
      '[data-role="check-group"]',
    ) as HTMLElement;

    expect(container.className).toContain('extra-user-class');
    expect(container.className).toContain('smart:mt-2');
  });

  it('should update control.value when a checkbox is toggled', () => {
    const control = new UntypedFormControl([]);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const checkboxes = (fixture.nativeElement as HTMLElement).querySelectorAll(
      'input[type="checkbox"]',
    );
    (checkboxes[0] as HTMLInputElement).dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(control.value).toEqual(['a']);
  });
});
