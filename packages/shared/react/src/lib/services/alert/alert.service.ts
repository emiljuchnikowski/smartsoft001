import { IAlertButton, IAlertOptions } from '../../models';
import { SmartStore } from '../../store';

export interface IAlertRequest {
  id: number;
  options: IAlertOptions;
  resolve: (button: IAlertButton | null) => void;
}

/**
 * Shows an alert dialog and resolves with the button the user chose (`null`
 * on Escape or a backdrop click without a cancel button), after that button's
 * handler has run. `SmartProvider` renders the dialogs through the component
 * registered under the `alert` key, and gives the focus back to the element
 * that had it.
 */
export class AlertService {
  readonly alerts = new SmartStore<IAlertRequest[]>([]);

  private nextId = 1;

  show(options: IAlertOptions): Promise<IAlertButton | null> {
    const trigger =
      typeof document === 'undefined'
        ? null
        : (document.activeElement as HTMLElement | null);

    return new Promise<IAlertButton | null>((resolve) => {
      const id = this.nextId++;

      this.alerts.update((alerts) => [
        ...alerts,
        {
          id,
          options,
          resolve: (button) => {
            this.alerts.update((list) => list.filter((a) => a.id !== id));
            trigger?.focus?.();
            resolve(button);
          },
        },
      ]);
    });
  }
}
