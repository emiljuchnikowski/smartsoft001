import { PeselService } from './pesel.service';

describe('shared-utils: PeselService', () => {
  describe('isValid()', () => {
    it('should return true when correct pesel', () => {
      const result = PeselService.isValid('91012008616');

      expect(result).toBeTruthy();
    });

    it('should return false when incorrect pesel', () => {
      const result = PeselService.isValid('91012008612');

      expect(result).not.toBeTruthy();
    });
  });

  describe('isInvalid()', () => {
    it('should return false when correct pesel', () => {
      const result = PeselService.isInvalid('91012008616');

      expect(result).not.toBeTruthy();
    });

    it('should return true when incorrect pesel', () => {
      const result = PeselService.isInvalid('91012008612');

      expect(result).toBeTruthy();
    });
  });
});
