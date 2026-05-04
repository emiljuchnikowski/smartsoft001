import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldType } from '@smartsoft001/models';

import { DetailImageComponent } from './image.component';
import { IDetailOptions } from '../../../models';
import { FileService } from '../../../services';

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-detail-image
      [options]="options"
      [class]="cssClass"
    ></smart-detail-image>
  `,
  imports: [DetailImageComponent],
})
class TestHostComponent {
  options: IDetailOptions<any> | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: DetailImageComponent', () => {
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

    const img = fixture.nativeElement.querySelector('img');

    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('/files/abc');
    expect(fileServiceMock.getUrl).toHaveBeenCalledWith('abc');
  });

  it('should render nothing when options.item() is undefined', () => {
    host.options = {
      key: 'avatar',
      item: signal(undefined),
      options: { type: FieldType.image },
    };
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img');

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

    const img = fixture.nativeElement.querySelector('img');

    expect(img.className).toContain('my-custom-class');
    expect(img.className).toContain('smart:h-[150px]');
  });
});
