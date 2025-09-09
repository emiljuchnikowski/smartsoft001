import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const FILE_SERVICE_CONFIG = new InjectionToken<IFileServiceConfig>(
  'FILE_SERVICE_CONFIG',
);

export interface IFileServiceConfig {
  apiUrl: string;
}

@Injectable()
export class FileService {
  private config = inject(FILE_SERVICE_CONFIG);
  private http = inject(HttpClient);

  upload<T>(file: File, callback?: (result: T) => void): Observable<number> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http
      .post(this.config.apiUrl + '/attachments', formData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        map((event: HttpEvent<any>) => {
          if (event.type === HttpEventType.UploadProgress && event?.total) {
            return Math.round((100 * event.loaded) / event.total);
          }
          if (event.type === HttpEventType.Response) {
            if (callback) callback(event.body);
            return 100;
          }

          return 0;
        }),
      );
  }

  download(id: string): void {
    window.open(this.getUrl(id), '_blank')?.focus();
  }

  delete(id: string): Promise<void> {
    return firstValueFrom(
      this.http.delete<void>(this.config.apiUrl + '/attachments/' + id),
    );
  }

  getUrl(id: string): string {
    return this.config.apiUrl + '/attachments/' + id;
  }
}
