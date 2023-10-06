export class PeselService {
  /***
   * Check valid pesel format
   * @param pesel {string} - pesel string
   * @return return true when correct
   */
  static isValid(pesel: string): boolean {
    const reg = /^[0-9]{11}$/;
    if (reg.test(pesel) === false) return false;
    else {
      const digits = ('' + pesel).split('');
      // tslint:disable-next-line:radix
      if (
        parseInt(pesel.substring(4, 6)) > 31 ||
        parseInt(pesel.substring(2, 4)) > 12
      )
        return false;

      // tslint:disable-next-line:radix
      let checksum =
        (1 * parseInt(digits[0]) +
          3 * parseInt(digits[1]) +
          7 * parseInt(digits[2]) +
          9 * parseInt(digits[3]) +
          1 * parseInt(digits[4]) +
          3 * parseInt(digits[5]) +
          7 * parseInt(digits[6]) +
          9 * parseInt(digits[7]) +
          1 * parseInt(digits[8]) +
          3 * parseInt(digits[9])) %
        10;
      if (checksum === 0) checksum = 10;
      checksum = 10 - checksum;

      // tslint:disable-next-line:radix
      return parseInt(digits[10]) === checksum;
    }
  }

  /***
   * Check invalid pesel format
   * @param pesel {string} - pesel string
   * @return return true when incorrect
   */
  static isInvalid(pesel: string): boolean {
    return !PeselService.isValid(pesel);
  }
}
