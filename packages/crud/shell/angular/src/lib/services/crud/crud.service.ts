import { HttpClient } from '@angular/common/http';
import { Injectable, Optional } from '@angular/core';
import { IEntity } from '@smartsoft001/domain-core';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

import { CrudConfig } from '../../crud.config';
import { ICrudCreateManyOptions, ICrudFilter } from '../../models';

@Injectable()
export class CrudService<T extends IEntity<string>> {
  protected _formatMap = {
    csv: 'text/csv',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  };

  constructor(
    protected config: CrudConfig<T>,
    protected http: HttpClient,
  ) {}

  create(item: T): Promise<string> {
    return firstValueFrom(
      this.http
        .post<void>(this.config.apiUrl, item, { observe: 'response' })
        .pipe(
          map((response) => {
            const location = response.headers['Location'];
            if (!location) return null;
            const array = location.split('/');
            return array[array.length - 1];
          }),
        ),
    );
  }

  createMany(items: Array<T>, options: ICrudCreateManyOptions): Promise<void> {
    return firstValueFrom(
      this.http.post<void>(
        this.config.apiUrl + '/bulk?mode=' + options.mode,
        items,
      ),
    );
  }

  getById(id: string): Promise<T> {
    return firstValueFrom(this.http.get<T>(this.config.apiUrl + '/' + id));
  }

  getList<T>(
    filter: ICrudFilter = null,
  ): Promise<{ data: T[]; totalCount: number; links }> {
    return firstValueFrom(
      this.http.get<{ data: T[]; totalCount: number; links }>(
        this.config.apiUrl + this.getQuery(filter),
      ),
    );
  }

  exportList(
    filter: ICrudFilter = null,
    format: 'csv' | 'xlsx',
  ): Promise<void> {
    if (!format) {
      format = 'csv';
    }

    if (format === 'xlsx') {
      return firstValueFrom(
        this.http
          .get(this.config.apiUrl + this.getQuery(filter), {
            headers: {
              'Content-Type': this._formatMap[format],
            },
            observe: 'response',
            reportProgress: false,
            responseType: 'blob',
          })
          .pipe(
            map((res) => {
              const downloadLink = document.createElement('a');
              const blob = res.body;

              const url = URL.createObjectURL(blob);
              downloadLink.href = url;
              downloadLink.download = 'data.' + format;

              document.body.appendChild(downloadLink);
              downloadLink.click();
              document.body.removeChild(downloadLink);
            }),
          ),
      );
    }

    return firstValueFrom(
      this.http
        .get<string>(this.config.apiUrl + this.getQuery(filter), {
          headers: {
            'Content-Type': this._formatMap[format],
          },
          responseType: 'text' as 'json',
        })
        .pipe(
          map((res) => {
            const downloadLink = document.createElement('a');
            const blob = new Blob(['\ufeff', res]);

            const url = URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.download = 'data.' + format;

            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
          }),
        ),
    );
  }

  update(item: T): Promise<void> {
    return firstValueFrom(
      this.http.put<void>(this.config.apiUrl + '/' + item.id, item),
    );
  }

  updatePartial(item: Partial<T> & { id: string }): Promise<void> {
    return firstValueFrom(
      this.http.patch<void>(this.config.apiUrl + '/' + item.id, item),
    );
  }

  updatePartialMany(items: (Partial<T> & { id: string })[]): Promise<any> {
    const updatePromises = items.map((item) => {
      return this.updatePartial(item);
    });
    return Promise.all(updatePromises);
  }

  delete(id: string): Promise<void> {
    return firstValueFrom(
      this.http.delete<void>(this.config.apiUrl + '/' + id),
    );
  }

  protected getQuery(filter: ICrudFilter): string {
    let query = '';

    if (filter && filter.searchText) {
      query += '&$search=' + filter.searchText;
    }

    if (filter && filter.limit) {
      query += `&limit=${filter.limit}&offset=${
        filter.offset ? filter.offset : 0
      }`;
    }

    if (filter && filter.sortBy) {
      query += `&sort=${(filter.sortDesc ? '-' : '') + filter.sortBy}`;
    }

    if (filter && filter.query) {
      filter.query.forEach((q) => {
        if (
          q.value &&
          typeof q.value === 'string' &&
          q.value.match(/^-?\d+$/) &&
          q.value[0] !== "'" &&
          q.value[0] !== '"'
        ) {
          query += '&' + q.key + q.type + `'${q.value}'`;
        } else {
          query += '&' + q.key + q.type + q.value;
        }
      });
    }

    return query ? '?' + query.replace('&', '') : '';
  }
}
