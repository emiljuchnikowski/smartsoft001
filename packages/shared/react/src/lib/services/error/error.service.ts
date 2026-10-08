import { SmartHttpError } from '../http/http.client';
import { ToastService } from '../toast/toast.service';

/**
 * Logs an error and tells the user about it with an error toast, using
 * `ERRORS.invalidUsernameOrPassword` for a rejected sign-in and `ERRORS.other`
 * for everything else.
 */
export class ErrorService {
  constructor(
    private readonly toastService: ToastService,
    private readonly translate: (key: string) => string,
  ) {}

  async log(obj: unknown): Promise<void> {
    let message = '';

    if (
      obj instanceof SmartHttpError &&
      obj.body?.details === 'Invalid username or password'
    ) {
      message = this.translate('ERRORS.invalidUsernameOrPassword');
    }

    if (!message) message = this.translate('ERRORS.other');

    console.error(obj);
    await this.toastService.error({ message });
  }
}
