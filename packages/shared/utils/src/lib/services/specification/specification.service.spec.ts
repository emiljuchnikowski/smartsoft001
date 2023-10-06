import { SpecificationService } from './specification.service';

describe('shared-utils: SpecificationService', () => {
  describe('valid()', () => {
    it('should valid value', () => {
      const criteria = { a: 'test' };
      const value = { a: 'test' };

      const result = SpecificationService.valid(value, { criteria });

      expect(result).toBeTruthy();
    });

    it('should invalid value', () => {
      const criteria = { a: 'test' };
      const value = { a: 'test2' };

      const result = SpecificationService.valid(value, { criteria });

      expect(result).not.toBeTruthy();
    });

    it('should valid array value', () => {
      const criteria = { a: 'test1' };
      const value = { a: ['test1', 'test2'] };

      const result = SpecificationService.valid(value, { criteria });

      expect(result).toBeTruthy();
    });

    it('should invalid array value', () => {
      const criteria = { a: 'test1' };
      const value = { a: ['test2', 'test3'] };

      const result = SpecificationService.valid(value, { criteria });

      expect(result).not.toBeTruthy();
    });
  });

  describe('getSqlCriteria()', () => {
    it('should return string query for string criteria', () => {
      const criteria = { a: 'test' };

      const result = SpecificationService.getSqlCriteria({ criteria });

      expect(result).toBe("a = 'test'");
    });

    it('should return number query for number criteria', () => {
      const criteria = { a: 3 };

      const result = SpecificationService.getSqlCriteria({ criteria });

      expect(result).toBe('a = 3');
    });

    it('should return query with and key for many keys', () => {
      const criteria = { a: 3, b: 'test' };

      const result = SpecificationService.getSqlCriteria({ criteria });

      expect(result).toBe("a = 3 and b = 'test'");
    });
  });
});
