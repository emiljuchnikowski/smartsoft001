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

import { InputPdfPresetComponent } from './preset.component';
import { InputOptions } from '../../../../models';
import { IModelLabelProvider } from '../../../../providers';
import { FileService, ToastService } from '../../../../services';

@Model({})
class PdfModel {
  @Field({ type: FieldType.pdf })
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
    <smart-input-pdf-preset
      [options]="options"
      [fieldOptions]="fieldOptions"
      [class]="cssClass"
    ></smart-input-pdf-preset>
  `,
  imports: [InputPdfPresetComponent],
})
class TestHostComponent {
  options: InputOptions<any> | undefined = undefined;
  fieldOptions: any = undefined;
  cssClass = '';
}

function buildOptions(control: UntypedFormControl): InputOptions<PdfModel> {
  new UntypedFormGroup({ value: control });
  return {
    control,
    fieldKey: 'value',
    model: new PdfModel(),
    treeLevel: 0,
  };
}

describe('@smartsoft001/shared-angular: InputPdfPresetComponent', () => {
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

  it('should render the styled Preline drop zone with the hidden pdf file input', () => {
    const control = new UntypedFormControl(null);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const dropZone = (fixture.nativeElement as HTMLElement).querySelector(
      '[role="button"]',
    );
    const fileInput = (fixture.nativeElement as HTMLElement).querySelector(
      'input[type="file"]',
    ) as HTMLInputElement | null;

    expect(dropZone).toBeTruthy();
    expect(dropZone?.className).toContain('smart:border-dashed');
    expect(dropZone?.className).toContain('smart:rounded-xl');
    expect(fileInput).toBeTruthy();
    expect(fileInput?.hidden).toBe(true);
    expect(fileInput?.getAttribute('accept')).toBe('.pdf');
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

  it('should render TWO smart-buttons and file name when control.value is set', () => {
    const control = new UntypedFormControl({ id: '1', fileName: 'doc.pdf' });
    host.options = buildOptions(control);
    fixture.detectChanges();

    const smartButtons = (
      fixture.nativeElement as HTMLElement
    ).querySelectorAll('smart-button');
    const spans = (fixture.nativeElement as HTMLElement).querySelectorAll(
      'span',
    );
    const nameSpan = Array.from(spans).find((s) =>
      (s.textContent as string).includes('doc.pdf'),
    );

    expect(smartButtons.length).toBe(2);
    expect(nameSpan).toBeTruthy();
  });

  it('should render the progress bar when loading signal is true', () => {
    const control = new UntypedFormControl(null);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const component = fixture.debugElement.query(
      By.directive(InputPdfPresetComponent),
    ).componentInstance as InputPdfPresetComponent<PdfModel>;
    component.loading.set(true);
    fixture.detectChanges();

    const progressBar = (fixture.nativeElement as HTMLElement).querySelector(
      '[style*="width"]',
    );

    expect(progressBar).toBeTruthy();
  });

  it('should highlight the drop zone while dragging over and clear it on drop', () => {
    const control = new UntypedFormControl(null);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const component = fixture.debugElement.query(
      By.directive(InputPdfPresetComponent),
    ).componentInstance as InputPdfPresetComponent<PdfModel>;

    component['onDragOver'](new Event('dragover') as any);
    expect(component.dragOver()).toBe(true);

    component['onDrop'](new Event('drop') as any);
    expect(component.dragOver()).toBe(false);
  });

  it('should merge external class into the group class attribute', () => {
    const control = new UntypedFormControl(null);
    host.options = buildOptions(control);
    host.cssClass = 'extra-user-class';
    fixture.detectChanges();

    const group = (fixture.nativeElement as HTMLElement).querySelector(
      'smart-input-pdf-preset > div',
    );

    expect(group?.className).toContain('extra-user-class');
    expect(group?.className).toContain('smart:flex');
  });
});
