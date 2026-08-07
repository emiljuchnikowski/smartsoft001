import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldType } from '@smartsoft001/models';

import { DetailVideoPresetComponent } from './preset.component';
import { IDetailOptions } from '../../../../models';
import { FileService } from '../../../../services';

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-detail-video-preset
      [options]="options"
      [class]="cssClass"
    ></smart-detail-video-preset>
  `,
  imports: [DetailVideoPresetComponent],
})
class TestHostComponent {
  options: IDetailOptions<any> | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: DetailVideoPresetComponent', () => {
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

  it('should render a <video> with a source url from FileService', () => {
    host.options = {
      key: 'clip',
      item: signal({ clip: { id: 'abc' } } as any),
      options: { type: FieldType.video },
    };
    fixture.detectChanges();

    const video = (fixture.nativeElement as HTMLElement).querySelector(
      'video[data-role="video"]',
    ) as HTMLVideoElement;
    const source = video?.querySelector('source');

    expect(video).toBeTruthy();
    expect(source?.getAttribute('src')).toBe('/files/abc');
  });

  it('should apply the framed preset classes to the <video>', () => {
    host.options = {
      key: 'clip',
      item: signal({ clip: { id: 'abc' } } as any),
      options: { type: FieldType.video },
    };
    fixture.detectChanges();

    const video = (fixture.nativeElement as HTMLElement).querySelector(
      'video[data-role="video"]',
    ) as HTMLVideoElement;

    expect(video.className).toContain('smart:rounded-xl');
    expect(video.className).toContain('smart:border');
    expect(video.className).toContain('smart:shadow-2xs');
  });

  it('should render nothing when options.item() is undefined', () => {
    host.options = {
      key: 'clip',
      item: signal(undefined),
      options: { type: FieldType.video },
    };
    fixture.detectChanges();

    const video = (fixture.nativeElement as HTMLElement).querySelector('video');

    expect(video).toBeFalsy();
  });

  it('should append cssClass to the <video> element', () => {
    host.options = {
      key: 'clip',
      item: signal({ clip: { id: 'abc' } } as any),
      options: { type: FieldType.video },
    };
    host.cssClass = 'my-custom-class';
    fixture.detectChanges();

    const video = (fixture.nativeElement as HTMLElement).querySelector(
      'video[data-role="video"]',
    ) as HTMLVideoElement;

    expect(video.className).toContain('my-custom-class');
    expect(video.className).toContain('smart:rounded-xl');
  });
});
