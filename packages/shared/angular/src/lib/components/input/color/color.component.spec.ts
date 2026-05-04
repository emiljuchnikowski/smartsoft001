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

import { InputColorComponent } from './color.component';
import { InputOptions } from '../../../models';
import { IModelLabelProvider } from '../../../providers';

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
    <smart-input-color
      [options]="options"
      [fieldOptions]="fieldOptions"
      [class]="cssClass"
    ></smart-input-color>
  `,
  imports: [InputColorComponent],
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

describe('@smartsoft001/shared-angular: InputColorComponent', () => {
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

  it('should render color input when control is present', () => {
    const control = new UntypedFormControl('#ff0000');
    host.options = buildOptions(control);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[type="color"]');

    expect(input).toBeTruthy();
  });

  it('should render label with model label text', () => {
    const control = new UntypedFormControl('');
    host.options = buildOptions(control);
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('label');

    expect(label).toBeTruthy();
    expect(label.textContent).toContain('Mock Label');
  });

  it('should render required asterisk when control is required', () => {
    const control = new UntypedFormControl('', Validators.required);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const asterisk = fixture.nativeElement.querySelector('label span');

    expect(asterisk).toBeTruthy();
    expect(asterisk.textContent).toContain('*');
  });

  it('should merge external class into the group container', () => {
    const control = new UntypedFormControl('');
    host.options = buildOptions(control);
    host.cssClass = 'extra-user-class';
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector(
      'label + div',
    ) as HTMLElement;

    expect(container.className).toContain('extra-user-class');
  });
});
