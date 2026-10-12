import { TestBed } from '@angular/core/testing';

import { UIService } from './ui.service';
import { AlertService } from '../alert/alert.service';

describe('@smartsoft001/angular: UIService', () => {
  let service: UIService;

  function dialog(): HTMLElement | null {
    return document.body.querySelector('[role="alertdialog"]');
  }

  function button(name: string): HTMLButtonElement {
    return Array.from(
      document.body.querySelectorAll<HTMLButtonElement>(
        '[role="alertdialog"] button',
      ),
    ).find((item) => item.textContent?.trim() === name) as HTMLButtonElement;
  }

  function flush(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve));
  }

  afterEach(() => {
    TestBed.resetTestingModule();
    document.body.innerHTML = '';
  });

  describe('with AlertService', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({ providers: [UIService, AlertService] });

      service = TestBed.inject(UIService);
    });

    it('should show an alert with the heading, the message and the button', async () => {
      await service.showAlertWithDismissCallback(
        'Alert',
        'Please select 7 days',
        'Ok',
        jest.fn(),
      );

      expect(dialog()?.textContent).toContain('Alert');
      expect(dialog()?.textContent).toContain('Please select 7 days');
      expect(button('Ok')).toBeTruthy();
    });

    it('should resolve before the alert is closed', async () => {
      const callback = jest.fn();

      await service.showAlertWithDismissCallback(
        'Alert',
        'Message',
        'Ok',
        callback,
      );

      expect(dialog()).toBeTruthy();
      expect(callback).not.toHaveBeenCalled();
    });

    it('should call the callback once the button closed the alert', async () => {
      const callback = jest.fn();
      await service.showAlertWithDismissCallback(
        'Alert',
        'Message',
        'Ok',
        callback,
      );

      button('Ok').click();
      await flush();

      expect(callback).toHaveBeenCalledTimes(1);
      expect(dialog()).toBeNull();
    });

    it('should call the callback when Escape closes the alert', async () => {
      const callback = jest.fn();
      await service.showAlertWithDismissCallback(
        'Alert',
        'Message',
        'Ok',
        callback,
      );

      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
      );
      await flush();

      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('without AlertService', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({ providers: [UIService] });

      service = TestBed.inject(UIService);
    });

    it('should still show the alert and call the callback', async () => {
      const callback = jest.fn();
      await service.showAlertWithDismissCallback(
        'Alert',
        'Message',
        'Ok',
        callback,
      );

      button('Ok').click();
      await flush();

      expect(callback).toHaveBeenCalledTimes(1);
    });
  });
});
