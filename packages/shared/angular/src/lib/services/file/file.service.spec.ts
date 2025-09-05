import { HttpClient, HttpEventType } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { FILE_SERVICE_CONFIG, FileService } from './file.service';

describe('angular: FileService', () => {
  let fileService: FileService;
  let httpClientMock: any;
  const apiUrl = 'http://test-api';

  beforeEach(() => {
    jest.clearAllMocks();
    httpClientMock = {
      post: jest.fn(),
      delete: jest.fn(),
    };
    TestBed.configureTestingModule({
      providers: [
        FileService,
        { provide: FILE_SERVICE_CONFIG, useValue: { apiUrl } },
        { provide: HttpClient, useValue: httpClientMock },
      ],
    });
    fileService = TestBed.inject(FileService);
  });

  it('should be created', () => {
    expect(fileService).toBeTruthy();
  });

  describe('upload', () => {
    it('should call HttpClient.post with correct URL and FormData', () => {
      const file = new File(['test'], 'test.txt');
      httpClientMock.post.mockReturnValue(
        of({ type: HttpEventType.UploadProgress, loaded: 50, total: 100 }),
      );
      fileService.upload(file).subscribe();
      expect(httpClientMock.post).toHaveBeenCalledWith(
        apiUrl + '/attachments',
        expect.any(FormData),
        expect.objectContaining({ reportProgress: true, observe: 'events' }),
      );
    });
    it('should emit upload progress as percentage', (done) => {
      const file = new File(['test'], 'test.txt');
      httpClientMock.post.mockReturnValue(
        of({ type: HttpEventType.UploadProgress, loaded: 25, total: 100 }),
      );
      fileService.upload(file).subscribe((progress) => {
        expect(progress).toBe(25);
        done();
      });
    });
    it('should call callback with response body when upload completes', (done) => {
      const file = new File(['test'], 'test.txt');
      const responseBody = { id: '123' };
      httpClientMock.post.mockReturnValue(
        of({ type: HttpEventType.Response, body: responseBody }),
      );
      const callback = jest.fn();
      fileService.upload(file, callback).subscribe((progress) => {
        if (progress === 100) {
          expect(callback).toHaveBeenCalledWith(responseBody);
          done();
        }
      });
    });
    it('should emit 100 when upload completes', (done) => {
      const file = new File(['test'], 'test.txt');
      httpClientMock.post.mockReturnValue(
        of({ type: HttpEventType.Response, body: {} }),
      );
      fileService.upload(file).subscribe((progress) => {
        expect(progress).toBe(100);
        done();
      });
    });
  });

  describe('download', () => {
    it('should call window.open with correct URL and target _blank', () => {
      const id = 'abc';
      const openMock = jest.fn().mockReturnValue({ focus: jest.fn() });
      window.open = openMock;
      fileService.download(id);
      expect(openMock).toHaveBeenCalledWith(
        apiUrl + '/attachments/' + id,
        '_blank',
      );
    });
    it('should call focus on the opened window', () => {
      const id = 'abc';
      const focusMock = jest.fn();
      window.open = jest.fn().mockReturnValue({ focus: focusMock });
      fileService.download(id);
      expect(focusMock).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should call HttpClient.delete with correct URL', () => {
      const id = 'del123';
      httpClientMock.delete.mockReturnValue(Promise.resolve());
      fileService.delete(id);
      expect(httpClientMock.delete).toHaveBeenCalledWith(
        apiUrl + '/attachments/' + id,
      );
    });
    it('should return a Promise', () => {
      const id = 'del123';
      httpClientMock.delete.mockReturnValue(Promise.resolve());
      const result = fileService.delete(id);
      expect(result).toBeInstanceOf(Promise);
    });
  });

  describe('getUrl', () => {
    it('should return correct URL for given id', () => {
      const id = 'url123';
      const url = fileService.getUrl(id);
      expect(url).toBe(apiUrl + '/attachments/' + id);
    });
  });
});
