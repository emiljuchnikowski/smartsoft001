import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { ToastService } from '../toast/toast.service';

@Injectable()
export class ErrorService {
  constructor(
    private toastService: ToastService,
    private translateService: TranslateService,
  ) {}

  async log(obj: any): Promise<void> {
    let message = '';

    if (obj instanceof HttpErrorResponse) {
      if (obj.error && obj.error.details === 'Invalid username or password') {
        message = await this.translateService
          .get('ERRORS.invalidUsernameOrPassword')
          .toPromise();
      }
    }

    if (!message)
      message = await this.translateService.get('ERRORS.other').toPromise();

    console.error(obj);

    await this.toastService.error({ message });
  }
}
