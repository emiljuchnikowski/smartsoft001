// #region usage
import { NipService } from '@smartsoft001/utils';

/**
 * Validates the checksum of a Polish tax identification number (NIP).
 * Spaces and dashes are ignored, so "537-252-70-48" is accepted as well.
 */
export function isValidNip(nip: string): boolean {
  return NipService.isValid(nip);
}
// #endregion
