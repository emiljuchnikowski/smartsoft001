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

import { InputFileComponent } from './file.component';
import { InputOptions } from '../../../models';
import { IModelLabelProvider } from '../../../providers';

@Model({})
class FileModel {
  @Field({ type: FieldType.file })
  value: any = null;
}

class MockModelLabelProvider extends IModelLabelProvider {
  get() {
    return signal('Mock Label');
  }
}

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-input-file
      [options]="options"
      [fieldOptions]="fieldOptions"
      [class]="cssClass"
    ></smart-input-file>
  `,
  imports: [InputFileComponent],
})
class TestHostComponent {
  options: InputOptions<any> | undefined = undefined;
  fieldOptions: any = undefined;
  cssClass = '';
}

function buildOptions(control: UntypedFormControl): InputOptions<FileModel> {
  new UntypedFormGroup({ value: control });
  return {
    control,
    fieldKey: 'value',
    model: new FileModel(),
    treeLevel: 0,
  };
}

describe('@smartsoft001/shared-angular: InputFileComponent', () => {
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

  it('should render label with Mock Label when control is present', () => {
    const control = new UntypedFormControl(null);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('label');

    expect(label).toBeTruthy();
    expect(label.textContent).toContain('Mock Label');
  });

  it('should render smart-button for add/change', () => {
    const control = new UntypedFormControl(null);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const smartButton = fixture.nativeElement.querySelector('smart-button');

    expect(smartButton).toBeTruthy();
  });

  it('should not render file name span when control.value is null', () => {
    const control = new UntypedFormControl(null);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const nameSpan = fixture.nativeElement.querySelector(
      'div > span:not(label span)',
    );

    expect(nameSpan).toBeFalsy();
  });

  it('should render file name span with .name when control.value has name', () => {
    const control = new UntypedFormControl({ name: 'x.pdf' });
    host.options = buildOptions(control);
    fixture.detectChanges();

    const spans = fixture.nativeElement.querySelectorAll('span');
    const nameSpan = Array.from(spans).find((s: any) =>
      (s.textContent as string).includes('x.pdf'),
    ) as HTMLElement | undefined;

    expect(nameSpan).toBeTruthy();
    expect(nameSpan?.textContent).toContain('x.pdf');
  });

  it('should set accept attribute on the hidden file input from fieldOptions.possibilities', () => {
    const control = new UntypedFormControl(null);
    host.options = buildOptions(control);
    host.fieldOptions = { possibilities: 'application/pdf' };
    fixture.detectChanges();

    const fileInput = fixture.nativeElement.querySelector('input[type="file"]');

    expect(fileInput).toBeTruthy();
    expect(fileInput.getAttribute('accept')).toBe('application/pdf');
  });

  it('should render required asterisk when control has Validators.required', () => {
    const control = new UntypedFormControl(null, Validators.required);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const asterisk = fixture.nativeElement.querySelector('label span');

    expect(asterisk).toBeTruthy();
    expect(asterisk.textContent).toContain('*');
  });

  it('should merge external class input into the group wrapper', () => {
    const control = new UntypedFormControl(null);
    host.options = buildOptions(control);
    host.cssClass = 'extra-user-class';
    fixture.detectChanges();

    const groupDiv = fixture.nativeElement.querySelector(
      'smart-input-file > div',
    );

    expect(groupDiv).toBeTruthy();
    expect(groupDiv.className).toContain('extra-user-class');
    expect(groupDiv.className).toContain('smart:flex');
  });

  it('changeListener should update control value when a file is selected', () => {
    const control = new UntypedFormControl(null);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const component = fixture.debugElement.query(
      By.directive(InputFileComponent),
    ).componentInstance as InputFileComponent<FileModel>;
    const file = new File(['x'], 'test.txt');
    const event: any = { target: { files: [file], type: 'file' } };

    component.changeListener(event);

    expect(control.value).toBeTruthy();
    expect(control.value.name).toBe('test.txt');
  });
});
