import { NipService } from './nip.service';

describe('shared-utils: NipService', () => {
  describe('isValid()', () => {
    it('should return true when correct nip', () => {
      const result = NipService.isValid('5372527048');

      expect(result).toBeTruthy();
    });

    it('should return false when incorrect nip', () => {
      const result = NipService.isValid('5372527041');

      expect(result).not.toBeTruthy();
    });
  });

  describe('isInvalid()', () => {
    it('should return false when correct nip', () => {
      const result = NipService.isInvalid('5372527048');

      expect(result).not.toBeTruthy();
    });

    it('should return true when incorrect nip', () => {
      const result = NipService.isInvalid('5372527041');

      expect(result).toBeTruthy();
    });
  });
});
