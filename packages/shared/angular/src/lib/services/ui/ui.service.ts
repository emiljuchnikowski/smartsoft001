import { inject, Injectable } from '@angular/core';

import { AlertService } from '../alert/alert.service';

@Injectable()
export class UIService {
  // `AlertService` comes from `SharedServicesModule`; created here when
  // `UIService` is provided on its own.
  private readonly alertService =
    inject(AlertService, { optional: true }) ?? new AlertService();

  /**
   * Shows an alert with `heading`, `msg` and one `btnText` button through
   * `AlertService`, and calls `callback` once it is closed (by its button,
   * Escape or a click on the backdrop). Resolves once the alert is shown.
   */
  public async showAlertWithDismissCallback(
    heading: string,
    msg: string,
    btnText: string,
    callback: () => void,
  ): Promise<void> {
    void this.alertService
      .show({ header: heading, message: msg, buttons: [{ text: btnText }] })
      .then(() => callback());
  }
}
