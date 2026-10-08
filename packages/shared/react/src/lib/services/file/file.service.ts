import { SmartHttpClient } from '../http/http.client';

export interface IFileServiceConfig {
  apiUrl: string;
}

/**
 * Attachments stored by the API under `<apiUrl>/attachments`. Uploads go
 * through `XMLHttpRequest`, the one browser API that reports upload progress.
 */
export class FileService {
  constructor(
    private readonly config: IFileServiceConfig,
    private readonly http: SmartHttpClient,
    private readonly getToken: () => string | null | undefined = () => null,
  ) {}

  /**
   * Uploads `file`; `onProgress` receives 0-100. Resolves with the attachment
   * the API returns.
   */
  upload<T = any>(
    file: File,
    onProgress?: (percent: number) => void,
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file, file.name);

      const xhr = new XMLHttpRequest();

      xhr.open('POST', this.config.apiUrl + '/attachments');

      const token = this.getToken();

      if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && event.total) {
          onProgress?.(Math.round((100 * event.loaded) / event.total));
        }
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          onProgress?.(100);
          resolve(parse(xhr.responseText) as T);
        } else {
          reject(new Error(`Upload failed: ${xhr.status}`));
        }
      };
      xhr.onerror = () => reject(new Error('Upload failed'));
      xhr.send(formData);
    });
  }

  download(id: string): void {
    window.open(this.getUrl(id), '_blank')?.focus();
  }

  delete(id: string): Promise<void> {
    return this.http.delete<void>(this.config.apiUrl + '/attachments/' + id);
  }

  getUrl(id: string): string {
    return this.config.apiUrl + '/attachments/' + id;
  }
}

function parse(text: string): unknown {
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
