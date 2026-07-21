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

import { InputVideoPresetComponent } from './preset.component';
import { InputOptions } from '../../../../models';
import { IModelLabelProvider } from '../../../../providers';
import { FileService, ToastService } from '../../../../services';

@Model({})
class VideoModel {
  @Field({ type: FieldType.video })
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
    <smart-input-video-preset
      [options]="options"
      [fieldOptions]="fieldOptions"
      [class]="cssClass"
    ></smart-input-video-preset>
  `,
  imports: [InputVideoPresetComponent],
})
class TestHostComponent {
  options: InputOptions<any> | undefined = undefined;
  fieldOptions: any = undefined;
  cssClass = '';
}

function buildOptions(control: UntypedFormControl): InputOptions<VideoModel> {
  new UntypedFormGroup({ value: control });
  return {
    control,
    fieldKey: 'value',
    model: new VideoModel(),
    treeLevel: 0,
  };
}

describe('@smartsoft001/shared-angular: InputVideoPresetComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  const fileServiceMock = {
    upload: jest.fn(),
    download: jest.fn(),
    getUrl: jest.fn(() => 'http://example.com/video.mp4'),
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

  it('should render the styled Preline drop zone with the hidden mp4 file input', () => {
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
    expect(fileInput?.getAttribute('accept')).toBe('.mp4');
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

  it('should not render play/delete buttons when control.value is null', () => {
    const control = new UntypedFormControl(null);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const smartButtons = (
      fixture.nativeElement as HTMLElement
    ).querySelectorAll('smart-button');

    expect(smartButtons.length).toBe(0);
  });

  it('should render play + delete smart-buttons and file name when control.value is set', () => {
    const control = new UntypedFormControl({ id: '1', fileName: 'clip.mp4' });
    host.options = buildOptions(control);
    fixture.detectChanges();

    const smartButtons = (
      fixture.nativeElement as HTMLElement
    ).querySelectorAll('smart-button');
    const spans = (fixture.nativeElement as HTMLElement).querySelectorAll(
      'span',
    );
    const nameSpan = Array.from(spans).find((s) =>
      (s.textContent as string).includes('clip.mp4'),
    );

    expect(smartButtons.length).toBe(2);
    expect(nameSpan).toBeTruthy();
  });

  it('should render the video element after play is requested', () => {
    const control = new UntypedFormControl({ id: '1', fileName: 'clip.mp4' });
    host.options = buildOptions(control);
    fixture.detectChanges();

    const component = fixture.debugElement.query(
      By.directive(InputVideoPresetComponent),
    ).componentInstance as InputVideoPresetComponent<VideoModel>;
    component.url = 'http://example.com/video.mp4';
    component.play = true;
    // OnPush: url/play are plain props, so refresh the component view directly.
    (component as any).cd.detectChanges();

    const video = (fixture.nativeElement as HTMLElement).querySelector('video');

    expect(video).toBeTruthy();
  });

  it('should highlight the drop zone while dragging over and clear it on drop', () => {
    const control = new UntypedFormControl(null);
    host.options = buildOptions(control);
    fixture.detectChanges();

    const component = fixture.debugElement.query(
      By.directive(InputVideoPresetComponent),
    ).componentInstance as InputVideoPresetComponent<VideoModel>;

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
      'smart-input-video-preset > div',
    );

    expect(group?.className).toContain('extra-user-class');
    expect(group?.className).toContain('smart:flex');
  });
});
