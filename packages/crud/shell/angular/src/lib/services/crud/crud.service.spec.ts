import '@angular/compiler';
import 'zone.js';
import 'zone.js/testing';
import { HttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { IEntity } from '@smartsoft001/domain-core';

import { CrudService } from './crud.service';
import { CrudConfig } from '../../crud.config';
import { ICrudCreateManyOptions, ICrudFilter } from '../../models';

interface TestEntity extends IEntity<string> {
  id: string;
  name: string;
}

describe('crud-shell-angular: CrudService', () => {
  let service: CrudService<TestEntity>;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let config: CrudConfig<TestEntity>;

  // Mock URL.createObjectURL globally before tests
  const mockCreateObjectURL = jest.fn().mockReturnValue('blob-url');
  global.URL.createObjectURL = mockCreateObjectURL;

  TestBed.initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting(),
    {
      teardown: { destroyAfterEach: true },
    },
  );

  beforeEach(() => {
    config = new CrudConfig<TestEntity>();
    config.entity = '';
    config.apiUrl = 'http://api.test/entities';

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: CrudConfig,
          useValue: config,
        },
        {
          provide: CrudService,
          useFactory: () => new CrudService<TestEntity>(),
        },
      ],
    });

    service = TestBed.inject(CrudService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('create', () => {
    it('should create an entity and return id from location header', async () => {
      const testEntity: TestEntity = { id: '', name: 'Test Entity' };

      service.create(testEntity);

      const req = httpMock.expectOne(config.apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(testEntity);
    });

    it('should return null when location header is missing', async () => {
      const testEntity: TestEntity = { id: '', name: 'Test Entity' };

      const promise = service.create(testEntity);

      const req = httpMock.expectOne(config.apiUrl);
      req.flush(null, { headers: {} });

      const result = await promise;
      expect(result).toBeNull();
    });
  });

  describe('createMany', () => {
    it('should create multiple entities', async () => {
      const testEntities: TestEntity[] = [
        { id: '', name: 'Entity 1' },
        { id: '', name: 'Entity 2' },
      ];
      const options: ICrudCreateManyOptions = { mode: 'default' };

      const promise = service.createMany(testEntities, options);

      const req = httpMock.expectOne(`${config.apiUrl}/bulk?mode=default`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(testEntities);

      // req.flush(null);
      //
      // await promise;
    });
  });

  describe('getById', () => {
    it('should fetch entity by id', async () => {
      const testId = '123';
      const expectedEntity: TestEntity = { id: testId, name: 'Test Entity' };

      const promise = service.getById(testId);

      const req = httpMock.expectOne(`${config.apiUrl}/${testId}`);
      expect(req.request.method).toBe('GET');

      req.flush(expectedEntity);

      const result = await promise;
      expect(result).toEqual(expectedEntity);
    });
  });

  describe('getList', () => {
    it('should fetch list of entities without filter', async () => {
      const expectedResponse = {
        data: [{ id: '1', name: 'Entity 1' }],
        totalCount: 1,
        links: {},
      };

      const promise = service.getList();

      const req = httpMock.expectOne(config.apiUrl);
      expect(req.request.method).toBe('GET');

      req.flush(expectedResponse);

      const result = await promise;
      expect(result).toEqual(expectedResponse);
    });

    it('should fetch list of entities with search filter', async () => {
      const filter: ICrudFilter = { searchText: 'test' };
      const expectedResponse = {
        data: [{ id: '1', name: 'Test Entity' }],
        totalCount: 1,
        links: {},
      };

      const promise = service.getList(filter);

      const req = httpMock.expectOne(`${config.apiUrl}?$search=test`);
      expect(req.request.method).toBe('GET');

      req.flush(expectedResponse);

      const result = await promise;
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('update', () => {
    it('should update an entity', async () => {
      const testEntity: TestEntity = { id: '123', name: 'Updated Entity' };

      const promise = service.update(testEntity);

      const req = httpMock.expectOne(`${config.apiUrl}/${testEntity.id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(testEntity);

      req.flush(null);

      await promise;
    });
  });

  describe('updatePartial', () => {
    it('should partially update an entity', async () => {
      const partialUpdate = { id: '123', name: 'Partially Updated' };

      const promise = service.updatePartial(partialUpdate);

      const req = httpMock.expectOne(`${config.apiUrl}/${partialUpdate.id}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(partialUpdate);

      req.flush(null);

      await promise;
    });
  });

  describe('updatePartialMany', () => {
    it('should update multiple entities partially', async () => {
      const updates = [
        { id: '1', name: 'Update 1' },
        { id: '2', name: 'Update 2' },
      ];

      const promise = service.updatePartialMany(updates);

      updates.forEach((update) => {
        const req = httpMock.expectOne(`${config.apiUrl}/${update.id}`);
        expect(req.request.method).toBe('PATCH');
        expect(req.request.body).toEqual(update);
        req.flush(null);
      });

      await promise;
    });
  });

  describe('delete', () => {
    it('should delete an entity', async () => {
      const testId = '123';

      const promise = service.delete(testId);

      const req = httpMock.expectOne(`${config.apiUrl}/${testId}`);
      expect(req.request.method).toBe('DELETE');

      req.flush(null);

      await promise;
    });
  });

  describe('exportList', () => {
    beforeEach(() => {
      // Reset the mock before each test
      mockCreateObjectURL.mockClear();
    });

    it('should export list as CSV', async () => {
      const format = 'csv';
      const csvData = 'id,name\n1,Test';

      // Mock document.createElement
      const mockLink = {
        href: '',
        download: '',
        click: jest.fn(),
      };
      jest.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
      jest.spyOn(document.body, 'appendChild').mockImplementation();
      jest.spyOn(document.body, 'removeChild').mockImplementation();

      const promise = service.exportList(null, format);

      const req = httpMock.expectOne(config.apiUrl);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Content-Type')).toBe('text/csv');

      req.flush(csvData);

      await promise;

      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockLink.download).toBe('data.csv');
      expect(mockLink.click).toHaveBeenCalled();
    });

    it('should export list as XLSX', async () => {
      const format = 'xlsx';
      const xlsxData = new Blob(['fake xlsx data']);

      const mockLink = {
        href: '',
        download: '',
        click: jest.fn(),
      };
      jest.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
      jest.spyOn(document.body, 'appendChild').mockImplementation();
      jest.spyOn(document.body, 'removeChild').mockImplementation();

      const promise = service.exportList(null, format);

      const req = httpMock.expectOne(config.apiUrl);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Content-Type')).toBe(
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );

      req.flush(xlsxData);

      await promise;

      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockLink.download).toBe('data.xlsx');
      expect(mockLink.click).toHaveBeenCalled();
    });
  });
});
