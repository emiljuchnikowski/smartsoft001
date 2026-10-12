import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

/** What `HardwareService.onBackButtonClick` returns. */
export interface IBackButtonHandle {
  /** Stops calling the callback. */
  remove(): void;
}

@Injectable()
export class HardwareService {
  private readonly document = inject(DOCUMENT);

  get isMobile(): boolean {
    return false;
  }

  get isMobileWeb(): boolean {
    return false;
  }

  /**
   * Calls `callback` when the user goes back in the browser history (the
   * `popstate` event of the window), until `remove()` is called on the
   * returned handle. Without a window (server rendering) the handle does
   * nothing.
   */
  async onBackButtonClick(callback: () => void): Promise<IBackButtonHandle> {
    const view = this.document.defaultView;

    if (!view) return { remove: () => undefined };

    const listener = () => callback();

    view.addEventListener('popstate', listener);

    return {
      remove: () => view.removeEventListener('popstate', listener),
    };
  }
}
