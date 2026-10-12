import { Injectable } from '@angular/core';

/**
 * Kept for compatibility: the library opens no popovers, so there is nothing
 * for `close()` to close.
 */
@Injectable()
export class PopoverService {
  /** Does nothing and resolves; the library has no popover to close. */
  async close(): Promise<void> {
    return undefined;
  }
}
