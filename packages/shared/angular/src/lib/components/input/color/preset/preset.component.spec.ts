import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

import { Field, FieldType, Model } from '@smartsoft001/models';

import { InputColorPresetComponent } from './preset.component';
import { InputOptions } from '../../../../models';
import { IModelLabelProvider } from '../../../../providers';

@Model({})
class ColorModel {
  @Field({ type: FieldType.color })
  color = '';
}

class MockModelLabelProvider extends IModelLabelProvider {
  get() {
    return signal('Mock Label');
  }
}

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-input-color-preset
      [options]="options"
      [fieldOptions]="fieldOptions"
      [class]="cssClass"
    ></smart-input-color-preset>
  `,
  imports: [InputColorPresetComponent],
})
class TestHostComponent {
  options: InputOptions<any> | undefined = undefined;
  fieldOptions: any = undefined;
  cssClass = '';
}

function buildOptions(control: UntypedFormControl): InputOptions<ColorModel> {
  new UntypedFormGroup({ color: control });
  return {
    control,
    fieldKey: 'color',
    model: new ColorModel(),
    treeLevel: 0,
  };
}

describe('@smartsoft001/shared-angular: InputColorPresetComponent', () => {
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

  it('should render native color input when control is present', () => {
    const control = new UntypedFormControl('#ff0000');
    host.options = buildOptions(control);
    fixture.detectChanges();

    const input = (fixture.nativeElement as HTMLElement).querySelector(
      'input[type="color"]',
    );

    expect(input).toBeTruthy();
  });

  it('should apply Preline preset classes to the styled color frame', () => {
    const control = new UntypedFormControl('#ff0000');
    host.options = buildOptions(control);
    fixture.detectChanges();

    const frame = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="color-frame"]',
    );

    expect(frame?.className).toContain('smart:rounded-lg');
    expect(frame?.className).toContain('smart:border-gray-200');
    expect(frame?.className).toContain('smart:dark:bg-gray-800');
  });

  it('should render the swatch preview reflecting the current color', () => {
    const control = new UntypedFormControl('#ff0000');
    host.options = buildOptions(control);
    fixture.detectChanges();

    const swatch = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="swatch"]',
    ) as HTMLElement | null;

    expect(swatch).toBeTruthy();
    expect(swatch?.style.background).toContain('rgb(255, 0, 0)');
  });

  it('should render label with model label text', () => {
    const control = new UntypedFormControl('');
    host.options = buildOptions(control);
    fixture.detectChanges();

    const label = (fixture.nativeElement as HTMLElement).querySelector('label');

    expect(label).toBeTruthy();
    expect(label?.textContent).toContain('Mock Label');
  });

  it('should render required asterisk when control is required', () => {
    const control = new UntypedFormControl('', Validators.required);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const asterisk = (fixture.nativeElement as HTMLElement).querySelector(
      'label span',
    );

    expect(asterisk).toBeTruthy();
    expect(asterisk?.textContent).toContain('*');
  });

  it('should update control value when a color is selected', () => {
    const control = new UntypedFormControl('');
    host.options = buildOptions(control);
    fixture.detectChanges();

    const component = fixture.debugElement.query(
      By.directive(InputColorPresetComponent),
    ).componentInstance as InputColorPresetComponent<ColorModel>;
    component.selectColor('#00ff00');

    expect(control.value).toBe('#00ff00');
  });

  it('should clear the control value when clear is invoked', () => {
    const control = new UntypedFormControl('#123456');
    host.options = buildOptions(control);
    fixture.detectChanges();

    const component = fixture.debugElement.query(
      By.directive(InputColorPresetComponent),
    ).componentInstance as InputColorPresetComponent<ColorModel>;
    component.clear();

    expect(control.value).toBeNull();
  });

  it('should merge external class into the color frame', () => {
    const control = new UntypedFormControl('');
    host.options = buildOptions(control);
    host.cssClass = 'extra-user-class';
    fixture.detectChanges();

    const frame = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="color-frame"]',
    );

    expect(frame?.className).toContain('extra-user-class');
    expect(frame?.className).toContain('smart:flex');
  });
});
