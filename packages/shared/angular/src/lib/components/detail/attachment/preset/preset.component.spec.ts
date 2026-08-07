import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { FieldType } from '@smartsoft001/models';

import { DetailAttachmentPresetComponent } from './preset.component';
import { IDetailOptions } from '../../../../models';
import { FileService } from '../../../../services';

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-detail-attachment-preset
      [options]="options"
      [class]="cssClass"
    ></smart-detail-attachment-preset>
  `,
  imports: [DetailAttachmentPresetComponent],
})
class TestHostComponent {
  options: IDetailOptions<any> | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: DetailAttachmentPresetComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  const fileServiceMock = {
    getUrl: jest.fn((id: string) => `/files/${id}`),
    download: jest.fn(),
  };

  beforeEach(async () => {
    fileServiceMock.getUrl.mockClear();
    fileServiceMock.download.mockClear();

    await TestBed.configureTestingModule({
      imports: [TestHostComponent, TranslateModule.forRoot()],
      providers: [{ provide: FileService, useValue: fileServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  it('should render the chip when item and key are set', () => {
    host.options = {
      key: 'file',
      item: signal({ file: { id: 'abc' } } as any),
      options: { type: FieldType.attachment },
    };
    fixture.detectChanges();

    const chip = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="chip"]',
    );

    expect(chip).toBeTruthy();
  });

  it('should render nothing when item is undefined', () => {
    host.options = {
      key: 'file',
      item: signal(undefined),
      options: { type: FieldType.attachment },
    };
    fixture.detectChanges();

    const chip = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="chip"]',
    );

    expect(chip).toBeFalsy();
  });

  it('should show the file name when the value has fileName', () => {
    host.options = {
      key: 'file',
      item: signal({ file: { id: 'abc', fileName: 'report.pdf' } } as any),
      options: { type: FieldType.attachment },
    };
    fixture.detectChanges();

    const name = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="name"]',
    );

    expect(name?.textContent?.trim()).toBe('report.pdf');
  });

  it('should show the file name when the value has name', () => {
    host.options = {
      key: 'file',
      item: signal({ file: { id: 'abc', name: 'photo.png' } } as any),
      options: { type: FieldType.attachment },
    };
    fixture.detectChanges();

    const name = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="name"]',
    );

    expect(name?.textContent?.trim()).toBe('photo.png');
  });

  it('should hide the name span when neither fileName nor name is present', () => {
    host.options = {
      key: 'file',
      item: signal({ file: { id: 'abc' } } as any),
      options: { type: FieldType.attachment },
    };
    fixture.detectChanges();

    const name = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="name"]',
    );

    expect(name).toBeFalsy();
  });

  it('should call fileService.download with the value id when the download button is clicked', () => {
    host.options = {
      key: 'file',
      item: signal({ file: { id: 'abc' } } as any),
      options: { type: FieldType.attachment },
    };
    fixture.detectChanges();

    const button = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="download"]',
    ) as HTMLButtonElement;
    button.click();

    expect(fileServiceMock.download).toHaveBeenCalledWith('abc');
  });

  it('should append cssClass to the chip element', () => {
    host.options = {
      key: 'file',
      item: signal({ file: { id: 'abc' } } as any),
      options: { type: FieldType.attachment },
    };
    host.cssClass = 'my-custom-class';
    fixture.detectChanges();

    const chip = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="chip"]',
    ) as HTMLElement;

    expect(chip.className).toContain('my-custom-class');
    expect(chip.className).toContain('smart:inline-flex');
  });
});
