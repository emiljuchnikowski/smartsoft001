import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldType } from '@smartsoft001/models';

import { DetailVideoComponent } from './video.component';
import { IDetailOptions } from '../../../models';
import { FileService } from '../../../services';

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-detail-video
      [options]="options"
      [class]="cssClass"
    ></smart-detail-video>
  `,
  imports: [DetailVideoComponent],
})
class TestHostComponent {
  options: IDetailOptions<any> | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: DetailVideoComponent', () => {
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

  it('should render <video> with <source> src from FileService.getUrl', () => {
    host.options = {
      key: 'clip',
      item: signal({ clip: { id: 'xyz' } } as any),
      options: { type: FieldType.video },
    };
    fixture.detectChanges();

    const video = fixture.nativeElement.querySelector('video');
    const source = fixture.nativeElement.querySelector('video source');

    expect(video).toBeTruthy();
    expect(source).toBeTruthy();
    expect(source.getAttribute('src')).toBe('/files/xyz');
    expect(fileServiceMock.getUrl).toHaveBeenCalledWith('xyz');
  });

  it('should render nothing when options.item() is undefined', () => {
    host.options = {
      key: 'clip',
      item: signal(undefined),
      options: { type: FieldType.video },
    };
    fixture.detectChanges();

    const video = fixture.nativeElement.querySelector('video');

    expect(video).toBeFalsy();
  });

  it('should append cssClass to the <video> element', () => {
    host.options = {
      key: 'clip',
      item: signal({ clip: { id: 'xyz' } } as any),
      options: { type: FieldType.video },
    };
    host.cssClass = 'my-custom-class';
    fixture.detectChanges();

    const video = fixture.nativeElement.querySelector('video');

    expect(video.className).toContain('my-custom-class');
    expect(video.className).toContain('smart:w-full');
  });
});
