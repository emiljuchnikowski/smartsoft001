import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { FieldType } from '@smartsoft001/models';

import { DetailPdfPresetComponent } from './preset.component';
import { IDetailOptions } from '../../../../models';
import { FileService } from '../../../../services';

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-detail-pdf-preset
      [options]="options"
      [class]="cssClass"
    ></smart-detail-pdf-preset>
  `,
  imports: [DetailPdfPresetComponent],
})
class TestHostComponent {
  options: IDetailOptions<any> | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: DetailPdfPresetComponent', () => {
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
      options: { type: FieldType.pdf },
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
      options: { type: FieldType.pdf },
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
      item: signal({ file: { id: 'abc', fileName: 'brochure.pdf' } } as any),
      options: { type: FieldType.pdf },
    };
    fixture.detectChanges();

    const name = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="name"]',
    );

    expect(name?.textContent?.trim()).toBe('brochure.pdf');
  });

  it('should hide the name span when neither fileName nor name is present', () => {
    host.options = {
      key: 'file',
      item: signal({ file: { id: 'abc' } } as any),
      options: { type: FieldType.pdf },
    };
    fixture.detectChanges();

    const name = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="name"]',
    );

    expect(name).toBeFalsy();
  });

  it('should call fileService.download with the value id when the show button is clicked', () => {
    host.options = {
      key: 'file',
      item: signal({ file: { id: 'abc' } } as any),
      options: { type: FieldType.pdf },
    };
    fixture.detectChanges();

    const button = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="show"]',
    ) as HTMLButtonElement;
    button.click();

    expect(fileServiceMock.download).toHaveBeenCalledWith('abc');
  });

  it('should append cssClass to the chip element', () => {
    host.options = {
      key: 'file',
      item: signal({ file: { id: 'abc' } } as any),
      options: { type: FieldType.pdf },
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
