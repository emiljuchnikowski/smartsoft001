import { IAlertButton, IAlertOptions } from '../../models';

export interface SmartAlertProps {
  options: IAlertOptions;
  /** Classes of the dialog panel. */
  className?: string;
  /**
   * The Angular `dismissed` output: the button that closed the alert, after
   * its handler ran, or the cancel button (`role: 'cancel'`, handler not run)
   * / `null` on Escape and backdrop click. Not called when the handler of a
   * non-cancel button returns `false`: the alert stays open.
   */
  onDismissed?: (button: IAlertButton | null) => void;
}
