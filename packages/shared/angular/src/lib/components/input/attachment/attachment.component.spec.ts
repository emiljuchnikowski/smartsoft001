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

import { InputAttachmentComponent } from './attachment.component';
import { InputOptions } from '../../../models';
import { IModelLabelProvider } from '../../../providers';
import { FileService, ToastService } from '../../../services';

@Model({})
class AttachmentModel {
  @Field({ type: FieldType.attachment })
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
    <smart-input-attachment
      [options]="options"
      [fieldOptions]="fieldOptions"
      [class]="cssClass"
    ></smart-input-attachment>
  `,
  imports: [InputAttachmentComponent],
})
class TestHostComponent {
  options: InputOptions<any> | undefined = undefined;
  fieldOptions: any = undefined;
  cssClass = '';
}

function buildOptions(
  control: UntypedFormControl,
): InputOptions<AttachmentModel> {
  new UntypedFormGroup({ value: control });
  return {
    control,
    fieldKey: 'value',
    model: new AttachmentModel(),
    treeLevel: 0,
  };
}

describe('@smartsoft001/shared-angular: InputAttachmentComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  const fileServiceMock = {
    upload: jest.fn(),
    download: jest.fn(),
    getUrl: jest.fn(),
    delete: jest.fn(),
  };

  const toastServiceMock = {
    error: jest.fn(),
    info: jest.fn(),
    addLockError: jest.fn(),
    removeLockError: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestHostComponent,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: IModelLabelProvider, useClass: MockModelLabelProvider },
        { provide: FileService, useValue: fileServiceMock },
        { provide: ToastService, useValue: toastServiceMock },
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

  it('should render ONE smart-button when control.value is null', () => {
    const control = new UntypedFormControl(null);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const smartButtons = fixture.nativeElement.querySelectorAll('smart-button');

    expect(smartButtons.length).toBe(1);
  });

  it('should render THREE smart-buttons when control.value is set', () => {
    const control = new UntypedFormControl({ id: '1', fileName: 'doc.pdf' });
    host.options = buildOptions(control);
    fixture.detectChanges();

    const smartButtons = fixture.nativeElement.querySelectorAll('smart-button');

    expect(smartButtons.length).toBe(3);
  });

  it('should render the file name span when control.value is set', () => {
    const control = new UntypedFormControl({ id: '1', fileName: 'doc.pdf' });
    host.options = buildOptions(control);
    fixture.detectChanges();

    const spans = fixture.nativeElement.querySelectorAll('span');
    const nameSpan = Array.from(spans).find((s: any) =>
      (s.textContent as string).includes('doc.pdf'),
    ) as HTMLElement | undefined;

    expect(nameSpan).toBeTruthy();
    expect(nameSpan?.textContent).toContain('doc.pdf');
  });

  it('should render the progress bar when loading signal is true', () => {
    const control = new UntypedFormControl(null);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const component = fixture.debugElement.query(
      By.directive(InputAttachmentComponent),
    ).componentInstance as InputAttachmentComponent<AttachmentModel>;
    component.loading.set(true);
    fixture.detectChanges();

    const progressBar = fixture.nativeElement.querySelector(
      'smart-input-attachment > div > div',
    );

    expect(progressBar).toBeTruthy();
  });

  it('should set accept attribute on the hidden file input from fieldOptions.possibilities', () => {
    const control = new UntypedFormControl(null);
    host.options = buildOptions(control);
    host.fieldOptions = { possibilities: '.pdf,.doc' };
    fixture.detectChanges();

    const fileInput = fixture.nativeElement.querySelector('input[type="file"]');

    expect(fileInput).toBeTruthy();
    expect(fileInput.getAttribute('accept')).toBe('.pdf,.doc');
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
      'smart-input-attachment > div',
    );

    expect(groupDiv).toBeTruthy();
    expect(groupDiv.className).toContain('extra-user-class');
    expect(groupDiv.className).toContain('smart:flex');
  });
});
