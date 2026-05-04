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

import { InputImageComponent } from './image.component';
import { InputOptions } from '../../../models';
import { IModelLabelProvider } from '../../../providers';
import { FileService, ToastService } from '../../../services';

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
    <smart-input-image
      [options]="options"
      [fieldOptions]="fieldOptions"
      [class]="cssClass"
    ></smart-input-image>
  `,
  imports: [InputImageComponent],
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

describe('@smartsoft001/shared-angular: InputImageComponent', () => {
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

  it('should render TWO smart-buttons when control.value is set', () => {
    const control = new UntypedFormControl({ id: '1' });
    host.options = buildOptions(control);
    fixture.detectChanges();

    const smartButtons = fixture.nativeElement.querySelectorAll('smart-button');

    expect(smartButtons.length).toBe(2);
  });

  it('should NOT render <img> when control.value is null', () => {
    const control = new UntypedFormControl(null);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img');

    expect(img).toBeFalsy();
  });

  it('should render <img> with fileService.getUrl() result when control.value is set', () => {
    const control = new UntypedFormControl({ id: '1' });
    host.options = buildOptions(control);
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img');

    expect(img).toBeTruthy();
    expect(fileServiceMock.getUrl).toHaveBeenCalledWith('1');
    expect(img.getAttribute('src')).toBe('https://example.com/img.jpg');
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
      const imgBeforeTick = fixture.nativeElement.querySelector('img');
      expect(imgBeforeTick.getAttribute('src')).toBe(
        'https://example.com/img.jpg',
      );

      jest.advanceTimersByTime(1000);
      fixture.detectChanges();

      expect(fileServiceMock.getUrl).toHaveBeenCalledWith('2');
      const imgAfterTick = fixture.nativeElement.querySelector('img');
      expect(imgAfterTick.getAttribute('src')).toBe(
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
      By.directive(InputImageComponent),
    ).componentInstance as InputImageComponent<ImageModel>;
    component.loading.set(true);
    fixture.detectChanges();

    const progressBar = fixture.nativeElement.querySelector(
      'smart-input-image > div > div',
    );

    expect(progressBar).toBeTruthy();
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
      'smart-input-image > div',
    );

    expect(groupDiv).toBeTruthy();
    expect(groupDiv.className).toContain('extra-user-class');
    expect(groupDiv.className).toContain('smart:flex');
  });
});
