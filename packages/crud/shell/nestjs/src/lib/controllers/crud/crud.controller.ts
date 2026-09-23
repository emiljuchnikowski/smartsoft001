import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import busboy from 'busboy';
import type { Response, Request } from 'express';
import { Parser } from 'json2csv';
import * as _ from 'lodash';
import moment from 'moment-timezone';
import * as XLSX from 'xlsx';

import type { CreateManyMode } from '@smartsoft001/crud-domain';
import { CrudService } from '@smartsoft001/crud-shell-app-services';
import { IEntity } from '@smartsoft001/domain-core';
import { User } from '@smartsoft001/nestjs';
import type { IUser } from '@smartsoft001/users';
import { GuidService } from '@smartsoft001/utils';

import { Readable, Writable } from 'stream';

import { IQ2mResult, q2m } from './query-to-mongo';
import {
  AuthJwtGuard,
  AuthOrAnonymousJwtGuard,
} from '../../guards/auth/auth.guard';

@Controller('')
export class CrudController<T extends IEntity<string>> {
  constructor(protected readonly service: CrudService<T>) {}

  static getLink(req: Request): string {
    return req.protocol + '://' + req.headers.host + req.url;
  }

  @UseGuards(AuthJwtGuard)
  @Post()
  @HttpCode(200)
  async create(
    @Body() data: T,
    @User() user: IUser,
    @Res() res: Response,
  ): Promise<Response> {
    const id = await this.service.create(data, user);
    res.set('Location', CrudController.getLink(res.req) + '/' + id);
    return res.send({
      id,
    });
  }

  @UseGuards(AuthJwtGuard)
  @Post('bulk')
  async createMany(
    @Body() data: T[],
    @User() user: IUser,
    @Res() res: Response,
    @Query('mode') mode: CreateManyMode,
  ): Promise<Response> {
    const result = await this.service.createMany(data, user, { mode });
    return res.send(result);
  }

  @UseGuards(AuthOrAnonymousJwtGuard)
  @Get(':id')
  async readById(
    @Param() params: { id: string },
    @User() user: IUser,
  ): Promise<T> {
    const result = await this.service.readById(params.id, user);

    if (!result) {
      throw new NotFoundException('Invalid id');
    }

    return result;
  }

  @UseGuards(AuthOrAnonymousJwtGuard)
  @Get()
  async read(
    @User() user: IUser,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const object = this.getQueryObject(req.query);

    const { data, totalCount } = await this.service.read(
      object.criteria,
      {
        ...object.options,
        allowDiskUse:
          req.headers['content-type'] === 'text/csv' ||
          req.headers['content-type'] ===
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
      user,
    );

    if (req.headers['content-type'] === 'text/csv') {
      res.set({
        'Content-Type': 'text/csv',
      });
      res.send(this.parseToCsv(data));
    }

    if (
      req.headers['content-type'] ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      res.set({
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      res.send(this.parseToXlsx(data));
    }

    res.send({
      data,
      totalCount,
      links: object.links(
        CrudController.getLink(req).split('?')[0],
        totalCount,
      ),
    });
  }

  @UseGuards(AuthJwtGuard)
  @Put(':id')
  async update(
    @Param() params: { id: string },
    @Body() data: T,
    @User() user: IUser,
  ): Promise<void> {
    await this.service.update(params.id, data, user);
  }

  @UseGuards(AuthJwtGuard)
  @Patch(':id')
  async updatePartial(
    @Param() params: { id: string },
    @Body() data: Partial<T>,
    @User() user: IUser,
  ): Promise<void> {
    await this.service.updatePartial(params.id, data, user);
  }

  @UseGuards(AuthJwtGuard)
  @Delete(':id')
  async delete(
    @Param() params: { id: string },
    @User() user: IUser,
  ): Promise<void> {
    await this.service.delete(params.id, user);
  }

  @Post('attachments')
  uploadAttachment(
    @Req() request: Request,
    @Res() response: Response,
  ): Writable {
    const parser = busboy({
      headers: request.headers,
    });
    const id = GuidService.create();
    const readable = new Readable();
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    readable._read = () => {};

    // Both stay undefined when the request carried no file part.
    let fileName: string | undefined;
    let mimeType: string | undefined;

    parser.on('file', (field, file, info) => {
      fileName = info.filename;
      mimeType = info.mimeType;

      this.service.uploadAttachment({
        id,
        stream: readable,
        fileName: info.filename,
        encoding: info.encoding,
        mimeType: info.mimeType,
      });

      file.on('data', (data) => {
        readable.push(data);
      });
    });

    parser.on('finish', function () {
      readable.push(null);
      response.set('Location', CrudController.getLink(response.req) + '/' + id);
      response.json({
        id,
        fileName,
        contentType: mimeType,
        length: readable.readableLength,
      });
      response.end();
    });

    return request.pipe(parser);
  }

  @Get('attachments/:id')
  async downloadAttachment(
    @Param('id') id: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const fileInfo = await this.service.getAttachmentInfo(id);

    if (!fileInfo) {
      throw new NotFoundException('Invalid id');
    }

    if (request.headers.range) {
      const range = request.headers.range.substr(6).split('-');
      const start = parseInt(range[0], 10);
      // An open-ended range (`bytes=100-`) reads to the end of the file.
      const end = parseInt(range[1], 10) || undefined;

      const readstream = await this.service.getAttachmentStream(id, {
        start,
        end,
      });

      response.status(206);
      response.set({
        'Accept-Ranges': 'bytes',
        'Content-Type': fileInfo.contentType,
        'Content-Range': `bytes ${start}-${end ? end : fileInfo.length - 1}/${
          fileInfo.length
        }`,
        'Content-Length': (end ? end : fileInfo.length) - start,
        'Content-Disposition': `attachment; filename="${encodeURI(fileInfo.fileName)}"`,
      });

      response.on('close', () => {
        readstream.destroy();
      });

      readstream.pipe(response);
    } else {
      const readstream = await this.service.getAttachmentStream(id);

      response.on('close', () => {
        readstream.destroy();
      });

      response.status(200);
      response.set({
        'Accept-Range': 'bytes',
        'Content-Type': fileInfo.contentType,
        'Content-Length': fileInfo.length,
        'Content-Disposition': `attachment; filename="${encodeURI(fileInfo.fileName)}"`,
      });

      readstream.pipe(response);
    }
  }

  @Delete('attachments/:id')
  async deleteAttachment(@Param('id') id: string): Promise<void> {
    await this.service.deleteAttachment(id);
  }

  protected getQueryObject(queryObject: Record<string, unknown>): IQ2mResult {
    let q = '';

    Object.keys(queryObject).forEach((key) => {
      q += `&${key}=${queryObject[key]}`;
    });

    const result = q2m(q);

    return result;
  }

  protected parseToXlsx(data: T[]) {
    if (!data || !data.length) {
      return '';
    }

    const { res } = this.getDataWithFields(data);

    const ws = XLSX.utils.json_to_sheet(res);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'data');

    return XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
  }

  protected parseToCsv(data: T[]): string {
    if (!data || !data.length) {
      return '';
    }

    const { res, fields } = this.getDataWithFields(data);

    return new Parser({ fields }).parse(res);
  }

  protected getDataWithFields(data: Array<T>): { res: T[]; fields: string[] } {
    const fields: string[] = [];

    const execute = (
      row: object,
      baseKey: string,
      baseRow: Record<string, unknown>,
    ) => {
      // The rows are flattened in place, whatever entity type they are.
      const item = row as Record<string, unknown>;

      Object.keys(item).forEach((key) => {
        const current = item[key];

        if (typeof current === 'string' && current) {
          item[key] = current.replace(/<[^>]*>?/gm, '');
        }

        if (current instanceof Date) {
          item[key] = moment(current)
            .tz('Europe/Warsaw')
            .format('YYYY-MM-DD HH:mm:ss');
        }

        const val = item[key];

        if (_.isArray(val)) {
          return;
        } else if (_.isObject(val) && Object.keys(val).length) {
          execute(val, baseKey + key + '_', baseRow);
        } else if (baseKey) {
          baseRow[baseKey + key] = val;
          if (!fields.some((f) => f === baseKey + key))
            fields.push(baseKey + key);
        } else {
          if (!fields.some((f) => f === key)) fields.push(key);
        }
      });
    };

    data.forEach((item) => {
      execute(item, '', item as Record<string, unknown>);
    });

    data.forEach((item) => {
      const row = item as Record<string, unknown>;

      Object.keys(row).forEach((key) => {
        if (!fields.some((f) => f === key)) {
          delete row[key];
        }
      });
    });

    return { res: data, fields };
  }
}
