import { ZipCodeService } from './zip-code.service';

describe('shared-utils: ZipCodeService', () => {
  describe('isValid()', () => {
    it('should return true when correct zip code', () => {
      const result = ZipCodeService.isValid('01-123');

      expect(result).toBeTruthy();
    });

    it('should return false when incorrect zip code', () => {
      const result = ZipCodeService.isValid('123123');

      expect(result).not.toBeTruthy();
    });
  });

  describe('isInvalid()', () => {
    it('should return false when correct zip code', () => {
      const result = ZipCodeService.isInvalid('01-123');

      expect(result).not.toBeTruthy();
    });

    it('should return true when incorrect zip code', () => {
      const result = ZipCodeService.isInvalid('123');

      expect(result).toBeTruthy();
    });
  });
});
