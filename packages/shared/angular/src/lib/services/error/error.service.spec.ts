import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { ErrorService } from './error.service';
import { ToastService } from '../toast/toast.service';

describe('@smartsoft001/angular: ErrorService', () => {
  let service: ErrorService;

  function toasts(): HTMLElement[] {
    return Array.from(
      document.body.querySelectorAll<HTMLElement>(
        '[data-role="toasts"] > [data-type]',
      ),
    );
  }

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    ToastService.lockError = 0;

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [ErrorService, ToastService],
    });

    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', {
      ERRORS: {
        other: 'Something went wrong',
        invalidUsernameOrPassword: 'Invalid username or password',
      },
    });
    translate.use('en');

    service = TestBed.inject(ErrorService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    TestBed.resetTestingModule();
    ToastService.lockError = 0;
    document.body.innerHTML = '';
  });

  it('should show an error toast with the generic message', async () => {
    await service.log(new Error('boom'));

    const [toast] = toasts();
    expect(toasts()).toHaveLength(1);
    expect(toast.getAttribute('data-type')).toBe('error');
    expect(toast.textContent).toContain('Something went wrong');
  });

  it('should show the invalid credentials message for a rejected sign-in', async () => {
    await service.log(
      new HttpErrorResponse({
        status: 400,
        error: { details: 'Invalid username or password' },
      }),
    );

    expect(toasts()[0].textContent).toContain('Invalid username or password');
  });

  it('should log the error to the console', async () => {
    const error = new Error('boom');

    await service.log(error);

    expect(console.error).toHaveBeenCalledWith(error);
  });

  it('should show no toast while the error lock is held', async () => {
    TestBed.inject(ToastService).addLockError();

    await service.log(new Error('boom'));

    expect(toasts()).toHaveLength(0);
  });
});
