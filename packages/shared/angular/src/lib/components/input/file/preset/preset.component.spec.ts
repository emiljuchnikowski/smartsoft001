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

import { InputFilePresetComponent } from './preset.component';
import { InputOptions } from '../../../../models';
import { IModelLabelProvider } from '../../../../providers';
import { FileService, ToastService } from '../../../../services';

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
    <smart-input-file-preset
      [options]="options"
      [fieldOptions]="fieldOptions"
      [class]="cssClass"
    ></smart-input-file-preset>
  `,
  imports: [InputFilePresetComponent],
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

describe('@smartsoft001/shared-angular: InputFilePresetComponent', () => {
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

    const label = (fixture.nativeElement as HTMLElement).querySelector('label');

    expect(label).toBeTruthy();
    expect(label?.textContent).toContain('Mock Label');
  });

  it('should render the styled native file input with Preline classes', () => {
    const control = new UntypedFormControl(null);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const fileInput = (fixture.nativeElement as HTMLElement).querySelector(
      'input[type="file"]',
    ) as HTMLInputElement | null;

    expect(fileInput).toBeTruthy();
    expect(fileInput?.className).toContain('smart:block');
    expect(fileInput?.className).toContain('smart:w-full');
    expect(fileInput?.className).toContain('smart:rounded-lg');
    expect(fileInput?.className).toContain('smart:file:py-3');
  });

  it('should set accept attribute on the file input from fieldOptions.possibilities', () => {
    const control = new UntypedFormControl(null);
    host.options = buildOptions(control);
    host.fieldOptions = { possibilities: '.pdf,.doc' };
    fixture.detectChanges();

    const fileInput = (fixture.nativeElement as HTMLElement).querySelector(
      'input[type="file"]',
    );

    expect(fileInput?.getAttribute('accept')).toBe('.pdf,.doc');
  });

  it('should render required asterisk when control has Validators.required', () => {
    const control = new UntypedFormControl(null, Validators.required);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const asterisk = (fixture.nativeElement as HTMLElement).querySelector(
      'label span',
    );

    expect(asterisk).toBeTruthy();
    expect(asterisk?.textContent).toContain('*');
  });

  it('should not render download/delete buttons when control.value is null', () => {
    const control = new UntypedFormControl(null);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const smartButtons = (
      fixture.nativeElement as HTMLElement
    ).querySelectorAll('smart-button');

    expect(smartButtons.length).toBe(0);
  });

  it('should render TWO smart-buttons (download + delete) when control.value is set', () => {
    const control = new UntypedFormControl({ id: '1', fileName: 'doc.pdf' });
    host.options = buildOptions(control);
    fixture.detectChanges();

    const smartButtons = (
      fixture.nativeElement as HTMLElement
    ).querySelectorAll('smart-button');

    expect(smartButtons.length).toBe(2);
  });

  it('should render the file name span when control.value is set', () => {
    const control = new UntypedFormControl({ id: '1', fileName: 'doc.pdf' });
    host.options = buildOptions(control);
    fixture.detectChanges();

    const spans = (fixture.nativeElement as HTMLElement).querySelectorAll(
      'span',
    );
    const nameSpan = Array.from(spans).find((s) =>
      (s.textContent as string).includes('doc.pdf'),
    );

    expect(nameSpan).toBeTruthy();
    expect(nameSpan?.textContent).toContain('doc.pdf');
  });

  it('should render the progress bar when loading signal is true', () => {
    const control = new UntypedFormControl(null);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const component = fixture.debugElement.query(
      By.directive(InputFilePresetComponent),
    ).componentInstance as InputFilePresetComponent<FileModel>;
    component.loading.set(true);
    fixture.detectChanges();

    const progressBar = (fixture.nativeElement as HTMLElement).querySelector(
      'smart-input-file-preset > div > div > div',
    );

    expect(progressBar).toBeTruthy();
  });

  it('should merge external class input into the file input class attribute', () => {
    const control = new UntypedFormControl(null);
    host.options = buildOptions(control);
    host.cssClass = 'extra-user-class';
    fixture.detectChanges();

    const fileInput = (fixture.nativeElement as HTMLElement).querySelector(
      'input[type="file"]',
    );

    expect(fileInput?.className).toContain('extra-user-class');
    expect(fileInput?.className).toContain('smart:block');
  });
});
