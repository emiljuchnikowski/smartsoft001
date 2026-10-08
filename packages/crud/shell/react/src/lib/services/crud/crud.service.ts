import { IEntity } from '@smartsoft001/domain-core';
import { SmartHttpClient } from '@smartsoft001/react';

import { CrudConfig } from '../../crud.config';
import { ICrudCreateManyOptions, ICrudFilter } from '../../models';

export interface ICrudListResult<T> {
  data: T[];
  totalCount: number;
  links: any;
}

/**
 * The REST client of a CRUD resource, speaking the same contract as the
 * Angular `CrudService` and `@smartsoft001/crud-shell-nestjs`: the same URLs,
 * the same query string (`$search`, `limit`/`offset`, `sort`, `key=value`
 * filters) and the same CSV / XLSX export.
 */
export class CrudService<T extends IEntity<string>> {
  protected readonly formatMap = {
    csv: 'text/csv',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  };

  constructor(
    protected readonly config: CrudConfig<T>,
    protected readonly http: SmartHttpClient,
  ) {}

  /**
   * Creates `item` and resolves with the id of the new item, read from the
   * `Location` header, or `null` when the API sends none.
   */
  async create(item: T): Promise<string | null> {
    const response = await this.http.request<void>({
      method: 'POST',
      url: this.config.apiUrl,
      body: item,
    });
    const location = response.headers.get('Location');

    if (!location) return null;

    const parts = location.split('/');

    return parts[parts.length - 1];
  }

  createMany(items: Array<T>, options: ICrudCreateManyOptions): Promise<void> {
    return this.http.post<void>(
      this.config.apiUrl + '/bulk?mode=' + options.mode,
      items,
    );
  }

  getById(id: string): Promise<T> {
    return this.http.get<T>(this.config.apiUrl + '/' + id);
  }

  getList<R = T>(
    filter: ICrudFilter | null = null,
  ): Promise<ICrudListResult<R>> {
    return this.http.get<ICrudListResult<R>>(
      this.config.apiUrl + this.getQuery(filter),
    );
  }

  /** Downloads the list matching `filter` as `data.csv` or `data.xlsx`. */
  async exportList(
    filter: ICrudFilter | null = null,
    format: 'csv' | 'xlsx' = 'csv',
  ): Promise<void> {
    if (!format) format = 'csv';

    if (format === 'xlsx') {
      const blob = await this.http.get<Blob>(
        this.config.apiUrl + this.getQuery(filter),
        {
          headers: { 'Content-Type': this.formatMap[format] },
          responseType: 'blob',
        },
      );

      this.download(blob, format);
      return;
    }

    const text = await this.http.get<string>(
      this.config.apiUrl + this.getQuery(filter),
      {
        headers: { 'Content-Type': this.formatMap[format] },
        responseType: 'text',
      },
    );

    this.download(new Blob(['﻿', text]), format);
  }

  update(item: T): Promise<void> {
    return this.http.put<void>(this.config.apiUrl + '/' + item.id, item);
  }

  updatePartial(item: Partial<T> & { id: string }): Promise<void> {
    return this.http.patch<void>(this.config.apiUrl + '/' + item.id, item);
  }

  updatePartialMany(items: (Partial<T> & { id: string })[]): Promise<void[]> {
    return Promise.all(items.map((item) => this.updatePartial(item)));
  }

  delete(id: string): Promise<void> {
    return this.http.delete<void>(this.config.apiUrl + '/' + id);
  }

  protected getQuery(filter: ICrudFilter | null): string {
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

  private download(blob: Blob, format: string): void {
    const downloadLink = document.createElement('a');

    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'data.' + format;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
}
