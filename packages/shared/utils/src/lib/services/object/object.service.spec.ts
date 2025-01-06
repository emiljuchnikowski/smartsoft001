import { ObjectService } from './object.service';

describe('shared-utils: ObjectService', () => {
  describe('createByType()', () => {
    it('should return same object when exist same type', () => {
      class Test {
        test1?: string;
      }
      const instance = new Test();

      const result = ObjectService.createByType(instance, Test);

      expect(result).toBe(instance);
    });

    it('should return other object when is other type', () => {
      class Test {
        test1?: string;
      }
      class Test2 {
        test1?: string;
      }
      const instance = new Test();

      const result = ObjectService.createByType(instance, Test2);

      expect(result).not.toBe(instance);
    });

    it('should return specific type when set object', () => {
      class Test {
        test1?: string;
      }
      const data = {
        test1: 'test123',
      };

      const result: Test = ObjectService.createByType(data, Test);

      expect(result.constructor).toBe(Test);
      expect(result.test1).toBe(data.test1);
    });
  });

  describe('removeTypes()', () => {
    it('should remove type from object', function () {
      class Test {
        test1?: string;
      }
      const obj = new Test();

      const result = ObjectService.removeTypes(obj);

      expect(result.constructor).not.toBe(Test);
    });

    it('should set correct data', function () {
      class Test {
        test1?: string;
      }
      const obj = new Test();
      obj.test1 = 'test123';

      const result = ObjectService.removeTypes(obj);

      expect(result.test1).toBe(obj.test1);
    });

    it('should remove only object types in parent', function () {
      class Test {
        test1?: string;
        date?: Date;
      }
      const obj = new Test();
      obj.test1 = 'test123';
      obj.date = new Date();

      const result = ObjectService.removeTypes(obj);

      expect(result.date instanceof Date).toBeTruthy();
    });

    it('should handle null fields', function () {
      class Test {
        test1?: string;
        date?: Date;
      }
      const obj = new Test();
      obj.test1 = undefined;
      obj.date = new Date();

      ObjectService.removeTypes(obj);

      expect(obj.test1 === undefined).toBeTruthy();
    });
  });
});
