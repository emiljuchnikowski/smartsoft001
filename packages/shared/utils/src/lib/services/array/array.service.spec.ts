import { ArrayService } from './array.service';

describe('shared-utils: ArrayService', () => {
  describe('addItem()', () => {
    it('should add element to array', () => {
      const array = [1];

      ArrayService.addItem(array, 2);

      expect(array[1]).toBe(2);
    });

    it('should create new array', () => {
      const array = [1];

      const newArray = ArrayService.addItem(array, 2);

      expect(array).not.toBe(newArray);
      expect(array[0]).toBe(newArray[0]);
      expect(array[1]).toBe(newArray[1]);
    });
  });

  describe('removeItem()', () => {
    it('should remove element from array', () => {
      const array = [1, 2];

      ArrayService.removeItem(array, 2);

      expect(array.length).toBe(1);
      expect(!!array[1]).not.toBeTruthy();
    });

    it('should create new array', () => {
      const array = [1, 2];

      const newArray = ArrayService.removeItem(array, 2);

      expect(array).not.toBe(newArray);
      expect(array[0]).toBe(newArray[0]);
      expect(!!array[1]).toBe(!!newArray[1]);
    });

    describe('sort()', () => {
      it('should return sorted array', () => {
        const array = [{ key: 2 }, { key: 1 }, { key: -1 }];

        const result = ArrayService.sort(array, (item) => item.key);

        expect(array[2]).toBe(result[0]);
        expect(array[1]).toBe(result[1]);
        expect(array[0]).toBe(result[2]);
      });
    });
  });
});
