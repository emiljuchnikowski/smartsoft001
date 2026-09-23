import 'reflect-metadata';

import { NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import * as XLSX from 'xlsx';

import { CrudService } from '@smartsoft001/crud-shell-app-services';

import { CrudController } from './crud.controller';
import * as q2mModule from './query-to-mongo';

jest.mock('xlsx');
jest.mock('json2csv', () => ({
  Parser: jest.fn().mockImplementation(() => ({ parse: jest.fn(() => 'csv') })),
}));

// busboy 1.x exports a factory function (no class, no `default`), and its
// 'file' event carries `(name, stream, info)`; the mock mirrors that shape.
const busboyInstance = { on: jest.fn() };
jest.mock('busboy', () => jest.fn(() => busboyInstance));

describe('crud-nestjs: CrudController', () => {
  let service: jest.Mocked<CrudService<any>>;
  let controller: CrudController<any>;

  beforeEach(() => {
    service = {
      create: jest.fn(),
      createMany: jest.fn(),
      readById: jest.fn(),
      read: jest.fn(),
      update: jest.fn(),
      updatePartial: jest.fn(),
      delete: jest.fn(),
      uploadAttachment: jest.fn(),
      getAttachmentInfo: jest.fn(),
      getAttachmentStream: jest.fn(),
      deleteAttachment: jest.fn(),
    } as any;
    controller = new CrudController(service);
  });

  describe('constructor', () => {
    it('should assign service', () => {
      expect(controller['service']).toBe(service);
    });
  });

  describe('static getLink', () => {
    it('should return correct link', () => {
      const req = {
        protocol: 'http',
        headers: { host: 'localhost' },
        url: '/api',
      } as Request;
      expect(CrudController.getLink(req)).toBe('http://localhost/api');
    });
  });

  describe('getQueryObject', () => {
    it('should call q2m and return result', () => {
      const query = { a: 1, b: 2 };
      const result = { criteria: {}, options: {}, links: jest.fn() };
      jest.spyOn(q2mModule, 'q2m').mockReturnValue(result);
      expect(controller['getQueryObject'](query)).toBe(result);
    });
  });

  describe('uploadAttachment', () => {
    it('should take the file name and mime type from the busboy file info', () => {
      const handlers: Record<string, (...args: any[]) => void> = {};
      busboyInstance.on.mockImplementation((event: string, handler) => {
        handlers[event] = handler;
        return busboyInstance;
      });
      const request = {
        headers: { 'content-type': 'multipart/form-data; boundary=x' },
        pipe: jest.fn(),
      } as unknown as Request;

      controller.uploadAttachment(request, {} as any);
      handlers['file'](
        'file',
        { on: jest.fn() },
        {
          filename: 'photo.png',
          encoding: '7bit',
          mimeType: 'image/png',
        },
      );

      expect(service.uploadAttachment).toHaveBeenCalledWith(
        expect.objectContaining({
          fileName: 'photo.png',
          encoding: '7bit',
          mimeType: 'image/png',
        }),
      );
    });
  });

  describe('downloadAttachment', () => {
    it('should respond 404 when there is no attachment with that id', async () => {
      service.getAttachmentInfo.mockResolvedValue(null);
      const request = { headers: {} } as Request;
      const response = { status: jest.fn(), set: jest.fn() } as any;

      await expect(
        controller.downloadAttachment('missing', request, response),
      ).rejects.toThrow(NotFoundException);
      expect(service.getAttachmentStream).not.toHaveBeenCalled();
    });
  });

  describe('parseToCsv', () => {
    it('should return empty string for empty data', () => {
      expect(controller['parseToCsv']([])).toBe('');
    });
    it('should return csv string for data', () => {
      const data = [{ a: '1', b: '2' }];
      jest
        .spyOn(controller as any, 'getDataWithFields')
        .mockReturnValue({ res: data, fields: ['a', 'b'] });
      expect(controller['parseToCsv'](data)).toBe('csv');
    });
  });

  describe('parseToXlsx', () => {
    it('should return empty string for empty data', () => {
      expect(controller['parseToXlsx']([])).toBe('');
    });
    it('should call XLSX utils for data', () => {
      const data = [{ a: '1', b: '2' }];
      jest
        .spyOn(controller as any, 'getDataWithFields')
        .mockReturnValue({ res: data, fields: ['a', 'b'] });
      const jsonToSheet = jest
        .spyOn(XLSX.utils, 'json_to_sheet')
        .mockReturnValue({} as any);
      const bookNew = jest
        .spyOn(XLSX.utils, 'book_new')
        .mockReturnValue({} as any);
      const bookAppendSheet = jest
        .spyOn(XLSX.utils, 'book_append_sheet')
        .mockImplementation();
      const write = jest.spyOn(XLSX, 'write').mockReturnValue('buffer' as any);
      expect(controller['parseToXlsx'](data)).toBe('buffer');
    });
  });

  describe('getDataWithFields', () => {
    it('should flatten fields and remove html', () => {
      const data = [{ a: '<b>1</b>', b: { c: '2' } }];
      const result = controller['getDataWithFields'](data);
      expect(result.fields.includes('a')).toBe(true);
    });
    it('should remove keys not in fields', () => {
      const data = [{ a: '1', b: '2' }];
      const result = controller['getDataWithFields'](data);
      expect(
        Object.keys(result.res[0]).every((k) => result.fields.includes(k)),
      ).toBe(true);
    });
  });
});
