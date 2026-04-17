import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { FieldType } from '@smartsoft001/models';

import { DetailPdfComponent } from './pdf.component';
import { IDetailOptions } from '../../../models';
import { FileService } from '../../../services';

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-detail-pdf [options]="options" [class]="cssClass"></smart-detail-pdf>
  `,
  imports: [DetailPdfComponent],
})
class TestHostComponent {
  options: IDetailOptions<any> | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: DetailPdfComponent', () => {
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

  it('should render a <button> when options.item() is defined', () => {
    host.options = {
      key: 'doc',
      item: signal({ doc: { id: 'abc' } } as any),
      options: { type: FieldType.pdf },
    };
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');

    expect(button).toBeTruthy();
  });

  it('show click calls fileService.download', () => {
    host.options = {
      key: 'doc',
      item: signal({ doc: { id: 'abc' } } as any),
      options: { type: FieldType.pdf },
    };
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button').click();

    expect(fileServiceMock.download).toHaveBeenCalledWith('abc');
  });

  it('should render nothing when options.item() is undefined', () => {
    host.options = {
      key: 'doc',
      item: signal(undefined),
      options: { type: FieldType.pdf },
    };
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');

    expect(button).toBeFalsy();
  });

  it('should append cssClass to the <button> element', () => {
    host.options = {
      key: 'doc',
      item: signal({ doc: { id: 'abc' } } as any),
      options: { type: FieldType.pdf },
    };
    host.cssClass = 'my-custom-class';
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');

    expect(button.className).toContain('my-custom-class');
    expect(button.className).toContain('smart:inline-flex');
  });
});
