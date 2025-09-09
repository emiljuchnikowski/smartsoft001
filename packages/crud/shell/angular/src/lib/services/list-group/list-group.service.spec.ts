// Mock the facade before any imports
import { ɵNoopNgZone as NoopNgZone, NgZone } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from '@angular/platform-browser/testing';

import { IEntity } from '@smartsoft001/domain-core';

import { CrudListGroupService } from './list-group.service';
import { CrudFacade } from '../../+state/crud.facade';
import { ICrudFilter, ICrudListGroup } from '../../models';

jest.mock('../../+state/crud.facade', () => ({
  CrudFacade: jest.fn().mockImplementation(() => {
    const filter: ICrudFilter = {
      query: [],
    };
    return {
      filter: jest.fn(() => filter),
      read: jest.fn(() => []),
    };
  }),
}));

export class MockCrudFacade<T> {
  filter: jest.Mock;
  read: jest.Mock;

  constructor() {
    const filter: ICrudFilter = { query: [] };
    this.filter = jest.fn(() => filter);
    this.read = jest.fn(() => []);
  }
}

TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());

describe('crud-shell-angular: CrudListGroupService', () => {
  let service: CrudListGroupService<IEntity<string>>;
  let facade: CrudFacade<IEntity<string>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CrudListGroupService,
        { provide: CrudFacade, useClass: MockCrudFacade },
        { provide: NgZone, useClass: NoopNgZone },
      ],
    });
    service = TestBed.inject(CrudListGroupService);
    facade = TestBed.inject(CrudFacade);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  describe('change', () => {
    it('should set item.changed to true if val is truthy', () => {
      const item: ICrudListGroup = { key: 'test', value: 'val' } as any;
      service.change(true, item, false);
      expect(item.changed).toBe(true);
    });

    it('should set item.changed to true if force is true', () => {
      const item: ICrudListGroup = { key: 'test', value: 'val' } as any;
      service.change(false, item, true);
      expect(item.changed).toBe(true);
    });

    it('should add a new query if not found', () => {
      const item: ICrudListGroup = { key: 'test', value: 'val' } as any;
      service.change(true, item, false);
      expect(facade.filter().query.length).toBe(1);
      expect(facade.filter().query[0].key).toBe('test');
    });

    it('should update current.value and set current.hidden to true', () => {
      const item: ICrudListGroup = { key: 'test', value: 'val' } as any;
      service.change(true, item, false);
      expect(facade.filter().query[0].value).toBe('val');
      expect(facade.filter().query[0].hidden).toBe(true);
    });
  });
});
