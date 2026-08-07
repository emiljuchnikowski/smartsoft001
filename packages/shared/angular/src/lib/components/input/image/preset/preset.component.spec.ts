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

import { InputImagePresetComponent } from './preset.component';
import { InputOptions } from '../../../../models';
import { IModelLabelProvider } from '../../../../providers';
import { FileService, ToastService } from '../../../../services';

@Model({})
class ImageModel {
  @Field({ type: FieldType.image })
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
    <smart-input-image-preset
      [options]="options"
      [fieldOptions]="fieldOptions"
      [class]="cssClass"
    ></smart-input-image-preset>
  `,
  imports: [InputImagePresetComponent],
})
class TestHostComponent {
  options: InputOptions<any> | undefined = undefined;
  fieldOptions: any = undefined;
  cssClass = '';
}

function buildOptions(control: UntypedFormControl): InputOptions<ImageModel> {
  new UntypedFormGroup({ value: control });
  return {
    control,
    fieldKey: 'value',
    model: new ImageModel(),
    treeLevel: 0,
  };
}

describe('@smartsoft001/shared-angular: InputImagePresetComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  const fileServiceMock = {
    upload: jest.fn(),
    download: jest.fn(),
    getUrl: jest.fn().mockReturnValue('https://example.com/img.jpg'),
    delete: jest.fn(),
  };

  const toastServiceMock = {
    error: jest.fn(),
    info: jest.fn(),
    addLockError: jest.fn(),
    removeLockError: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    fileServiceMock.getUrl.mockReturnValue('https://example.com/img.jpg');

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

  it('should render the hidden file input with #inputObj ref', () => {
    const control = new UntypedFormControl(null);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const fileInput = (fixture.nativeElement as HTMLElement).querySelector(
      'input[type="file"]',
    ) as HTMLInputElement | null;

    expect(fileInput).toBeTruthy();
    expect(fileInput?.hidden).toBe(true);
    expect(fileInput?.accept).toBe('.jpg,.png,.jpeg');
  });

  it('should render ONE smart-button when control.value is null', () => {
    const control = new UntypedFormControl(null);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const smartButtons = (
      fixture.nativeElement as HTMLElement
    ).querySelectorAll('smart-button');

    expect(smartButtons.length).toBe(1);
  });

  it('should render TWO smart-buttons (change + delete) when control.value is set', () => {
    const control = new UntypedFormControl({ id: '1' });
    host.options = buildOptions(control);
    fixture.detectChanges();

    const smartButtons = (
      fixture.nativeElement as HTMLElement
    ).querySelectorAll('smart-button');

    expect(smartButtons.length).toBe(2);
  });

  it('should NOT render <img> when control.value is null', () => {
    const control = new UntypedFormControl(null);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const img = (fixture.nativeElement as HTMLElement).querySelector('img');

    expect(img).toBeFalsy();
  });

  it('should render <img> with fileService.getUrl() result and Preline classes when control.value is set', () => {
    const control = new UntypedFormControl({ id: '1' });
    host.options = buildOptions(control);
    fixture.detectChanges();

    const img = (fixture.nativeElement as HTMLElement).querySelector(
      'img',
    ) as HTMLImageElement | null;

    expect(img).toBeTruthy();
    expect(fileServiceMock.getUrl).toHaveBeenCalledWith('1');
    expect(img?.getAttribute('src')).toBe('https://example.com/img.jpg');
    expect(img?.className).toContain('smart:w-56');
    expect(img?.className).toContain('smart:h-auto');
    expect(img?.className).toContain('smart:rounded-lg');
  });

  it('should update imageUrl after debounceTime when control value changes', () => {
    jest.useFakeTimers();
    try {
      const control = new UntypedFormControl({ id: '1' });
      host.options = buildOptions(control);
      fixture.detectChanges();

      expect(fileServiceMock.getUrl).toHaveBeenCalledWith('1');

      fileServiceMock.getUrl.mockReturnValue('https://example.com/img2.jpg');
      control.setValue({ id: '2' });
      fixture.detectChanges();

      // Not yet advanced past the debounce window
      const imgBeforeTick = (
        fixture.nativeElement as HTMLElement
      ).querySelector('img');
      expect(imgBeforeTick?.getAttribute('src')).toBe(
        'https://example.com/img.jpg',
      );

      jest.advanceTimersByTime(1000);
      fixture.detectChanges();

      expect(fileServiceMock.getUrl).toHaveBeenCalledWith('2');
      const imgAfterTick = (fixture.nativeElement as HTMLElement).querySelector(
        'img',
      );
      expect(imgAfterTick?.getAttribute('src')).toBe(
        'https://example.com/img2.jpg',
      );
    } finally {
      jest.useRealTimers();
    }
  });

  it('should render the progress bar when loading signal is true', () => {
    const control = new UntypedFormControl(null);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const component = fixture.debugElement.query(
      By.directive(InputImagePresetComponent),
    ).componentInstance as InputImagePresetComponent<ImageModel>;
    component.loading.set(true);
    fixture.detectChanges();

    const progressBar = (fixture.nativeElement as HTMLElement).querySelector(
      'smart-input-image-preset > div > div',
    );

    expect(progressBar).toBeTruthy();
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

  it('should merge external class input into the group wrapper', () => {
    const control = new UntypedFormControl(null);
    host.options = buildOptions(control);
    host.cssClass = 'extra-user-class';
    fixture.detectChanges();

    const groupDiv = (fixture.nativeElement as HTMLElement).querySelector(
      'smart-input-image-preset > div',
    );

    expect(groupDiv).toBeTruthy();
    expect(groupDiv?.className).toContain('extra-user-class');
    expect(groupDiv?.className).toContain('smart:flex');
  });
});
