export class ZipCodeService {
  /***
   * Check valid zip code format
   * @param code {string} - zip code string
   * @return return true when correct
   */
  static isValid(code: string): boolean {
    const re = new RegExp('^\\d\\d-\\d\\d\\d$');
    return !!code.match(re);
  }

  /***
   * Check invalid zip code format
   * @param code {string} - zip code string
   * @return return true when incorrect
   */
  static isInvalid(code: string): boolean {
    return !ZipCodeService.isValid(code);
  }
}
