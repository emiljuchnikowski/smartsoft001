import { CrudSearchService } from './search.service';
import { ICrudFilter, ICrudFilterQueryItem } from '../../models';

describe('crud-shell-angular: CrudSearchService', () => {
  let service: CrudSearchService;
  const testQuery: ICrudFilterQueryItem = {
    key: 'test',
    value: 'value',
    type: '=',
  };

  beforeEach(() => {
    service = new CrudSearchService();
  });

  it('should create service', () => {
    expect(service).toBeTruthy();
  });

  describe('filter', () => {
    it('should return empty object when disabled', () => {
      service.setEnabled(false);
      service.setFilter({ query: [] });
      expect(service.filter).toEqual({});
    });

    it('should return filter value when enabled', () => {
      const testFilter: ICrudFilter = { query: [testQuery] };
      service.setEnabled(true);
      service.setFilter(testFilter);
      expect(service.filter).toEqual(testFilter);
    });
  });

  describe('enabled', () => {
    it('should return false by default', () => {
      expect(service.enabled).toBe(false);
    });

    it('should return current enabled state', () => {
      service.setEnabled(true);
      expect(service.enabled).toBe(true);
    });
  });

  describe('enabled$', () => {
    it('should emit current enabled state', (done) => {
      service.enabled$.subscribe((value) => {
        expect(value).toBe(false);
        done();
      });
    });

    it('should emit new enabled state when changed', (done) => {
      service.setEnabled(true);
      service.enabled$.subscribe((value) => {
        expect(value).toBe(true);
        done();
      });
    });
  });

  describe('filter$', () => {
    it('should emit empty object when disabled', (done) => {
      service.setEnabled(false);
      service.setFilter({ query: [testQuery] });

      service.filter$.subscribe((value) => {
        expect(value).toEqual({});
        done();
      });
    });

    it('should emit current filter when enabled', (done) => {
      const testFilter: ICrudFilter = { query: [testQuery] };
      service.setEnabled(true);
      service.setFilter(testFilter);

      service.filter$.subscribe((value) => {
        expect(value).toEqual(testFilter);
        done();
      });
    });

    it('should emit new filter when changed', (done) => {
      const testFilter: ICrudFilter = { query: [testQuery] };
      service.setEnabled(true);

      service.filter$.subscribe((value) => {
        expect(value).toEqual(testFilter);
        done();
      });

      service.setFilter(testFilter);
    });
  });

  describe('setFilter', () => {
    it('should update filter value', () => {
      const testFilter: ICrudFilter = { query: [testQuery] };
      service.setEnabled(true);
      service.setFilter(testFilter);
      expect(service.filter).toEqual(testFilter);
    });

    it('should not affect enabled state', () => {
      service.setEnabled(false);
      service.setFilter({ query: [] });
      expect(service.enabled).toBe(false);
    });
  });

  describe('setEnabled', () => {
    it('should update enabled state', () => {
      service.setEnabled(true);
      expect(service.enabled).toBe(true);
    });

    it('should not affect filter value', () => {
      const testFilter: ICrudFilter = { query: [testQuery] };
      service.setFilter(testFilter);
      service.setEnabled(true);
      expect(service.filter).toEqual(testFilter);
    });

    it('should make filter return empty object when disabled', () => {
      const testFilter: ICrudFilter = { query: [testQuery] };
      service.setFilter(testFilter);
      service.setEnabled(true);
      service.setEnabled(false);
      expect(service.filter).toEqual({});
    });
  });
});
