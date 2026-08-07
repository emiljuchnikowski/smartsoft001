import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldType } from '@smartsoft001/models';

import { DetailImagePresetComponent } from './preset.component';
import { IDetailOptions } from '../../../../models';
import { FileService } from '../../../../services';

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-detail-image-preset
      [options]="options"
      [class]="cssClass"
    ></smart-detail-image-preset>
  `,
  imports: [DetailImagePresetComponent],
})
class TestHostComponent {
  options: IDetailOptions<any> | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: DetailImagePresetComponent', () => {
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
      imports: [TestHostComponent],
      providers: [{ provide: FileService, useValue: fileServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  it('should render <img> with src from FileService.getUrl', () => {
    host.options = {
      key: 'avatar',
      item: signal({ avatar: { id: 'abc' } } as any),
      options: { type: FieldType.image },
    };
    fixture.detectChanges();

    const img = (fixture.nativeElement as HTMLElement).querySelector(
      'img[data-role="image"]',
    );

    expect(img).toBeTruthy();
    expect(img?.getAttribute('src')).toBe('/files/abc');
    expect(fileServiceMock.getUrl).toHaveBeenCalledWith('abc');
  });

  it('should apply the Preline preset classes to the <img>', () => {
    host.options = {
      key: 'avatar',
      item: signal({ avatar: { id: 'abc' } } as any),
      options: { type: FieldType.image },
    };
    fixture.detectChanges();

    const img = (fixture.nativeElement as HTMLElement).querySelector(
      'img[data-role="image"]',
    ) as HTMLImageElement;

    expect(img.className).toContain('smart:rounded-xl');
    expect(img.className).toContain('smart:border');
    expect(img.className).toContain('smart:object-cover');
    expect(img.className).toContain('smart:shadow-2xs');
  });

  it('should render nothing when options.item() is undefined', () => {
    host.options = {
      key: 'avatar',
      item: signal(undefined),
      options: { type: FieldType.image },
    };
    fixture.detectChanges();

    const img = (fixture.nativeElement as HTMLElement).querySelector('img');

    expect(img).toBeFalsy();
  });

  it('should append cssClass to the <img> element', () => {
    host.options = {
      key: 'avatar',
      item: signal({ avatar: { id: 'abc' } } as any),
      options: { type: FieldType.image },
    };
    host.cssClass = 'my-custom-class';
    fixture.detectChanges();

    const img = (fixture.nativeElement as HTMLElement).querySelector(
      'img[data-role="image"]',
    ) as HTMLImageElement;

    expect(img.className).toContain('my-custom-class');
    expect(img.className).toContain('smart:rounded-xl');
  });
});
