import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ToastService } from './toast.service';
import { NotificationPresetComponent } from '../../components/notification/preset/preset.component';
import { NOTIFICATION_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

describe('@smartsoft001/angular: ToastService', () => {
  let service: ToastService;

  function setup(providers: unknown[] = []): void {
    TestBed.configureTestingModule({
      providers: [ToastService, ...(providers as [])],
    });

    service = TestBed.inject(ToastService);
  }

  function container(): HTMLElement | null {
    return document.body.querySelector('[data-role="toasts"]');
  }

  function toasts(): HTMLElement[] {
    return Array.from(
      document.body.querySelectorAll<HTMLElement>(
        '[data-role="toasts"] > [data-type]',
      ),
    );
  }

  function button(name: string): HTMLButtonElement {
    return Array.from(
      document.body.querySelectorAll<HTMLButtonElement>(
        '[data-role="toasts"] button',
      ),
    ).find(
      (item) =>
        item.getAttribute('aria-label') === name ||
        item.textContent?.trim() === name,
    ) as HTMLButtonElement;
  }

  beforeEach(() => {
    ToastService.lockError = 0;
  });

  afterEach(() => {
    jest.useRealTimers();
    TestBed.resetTestingModule();
    ToastService.lockError = 0;
    document.body.innerHTML = '';
  });

  describe('standard notification', () => {
    beforeEach(() => setup());

    it('should render the toast at the end of the body in a container fixed to the bottom', async () => {
      await service.info({ message: 'Saved' });

      expect(container()?.parentElement?.parentElement).toBe(document.body);
      expect(container()?.className).toContain('smart:fixed');
      expect(container()?.className).toContain('smart:bottom-0');
      expect(toasts()[0].textContent).toContain('Saved');
    });

    it('should render the title as the heading and the message under it', async () => {
      await service.info({ title: 'Profile', message: 'Saved' });

      const toast = toasts()[0];
      expect(toast.querySelector('h3')?.textContent).toBe('Profile');
      expect(toast.querySelector('p')?.textContent).toBe('Saved');
    });

    it('should render the message as the heading without a title', async () => {
      await service.info({ message: 'Saved' });

      const toast = toasts()[0];
      expect(toast.querySelector('h3')?.textContent).toBe('Saved');
      expect(toast.querySelector('p')).toBeNull();
    });

    it('should render the buttons as actions of the toast', async () => {
      await service.info({
        message: 'Deleted',
        buttons: [
          { text: 'Undo', position: 'end', handler: jest.fn() },
          { text: 'Details', position: 'start', handler: jest.fn() },
        ],
      });

      expect(button('Undo')).toBeTruthy();
      expect(button('Details')).toBeTruthy();
    });

    it('should run the handler of the clicked button and close the toast', async () => {
      const undo = jest.fn();
      const details = jest.fn();
      await service.info({
        message: 'Deleted',
        buttons: [
          { text: 'Undo', position: 'end', handler: undo },
          { text: 'Details', position: 'end', handler: details },
        ],
      });

      button('Undo').click();

      expect(undo).toHaveBeenCalledTimes(1);
      expect(details).not.toHaveBeenCalled();
      expect(toasts()).toHaveLength(0);
    });

    it('should close the toast on its close button', async () => {
      await service.info({ message: 'Saved' });

      button('Close').click();

      expect(toasts()).toHaveLength(0);
      expect(service.toasts()).toEqual([]);
    });

    it('should remove the container once the last toast is closed', async () => {
      await service.info({ message: 'Saved' });

      button('Close').click();

      expect(container()).toBeNull();
    });

    it('should close the toast after its duration', async () => {
      jest.useFakeTimers();
      await service.info({ message: 'Saved', duration: 1000 });

      jest.advanceTimersByTime(999);
      const shownBefore = toasts().length;
      jest.advanceTimersByTime(1);

      expect(shownBefore).toBe(1);
      expect(toasts()).toHaveLength(0);
    });

    it.each([
      ['missing', undefined],
      ['zero', 0],
    ])(
      'should close the toast after 2000 ms when the duration is %s',
      async (_name, duration) => {
        jest.useFakeTimers();
        await service.info({ message: 'Saved', duration });

        jest.advanceTimersByTime(1999);
        const shownBefore = toasts().length;
        jest.advanceTimersByTime(1);

        expect(shownBefore).toBe(1);
        expect(toasts()).toHaveLength(0);
      },
    );

    it('should keep the other toasts when one closes', async () => {
      jest.useFakeTimers();
      await service.info({ message: 'First', duration: 1000 });
      await service.info({ message: 'Second', duration: 3000 });

      jest.advanceTimersByTime(1000);

      expect(toasts().map((toast) => toast.textContent?.trim())).toEqual([
        expect.stringContaining('Second'),
      ]);
    });

    it('should announce errors assertively and infos politely', async () => {
      await service.error({ message: 'Failed' });
      await service.info({ message: 'Saved' });

      const [error, info] = toasts();
      expect(error.getAttribute('data-type')).toBe('error');
      expect(
        error.querySelector('[role="status"]')?.getAttribute('aria-live'),
      ).toBe('assertive');
      expect(info.getAttribute('data-type')).toBe('info');
      expect(
        info.querySelector('[role="status"]')?.getAttribute('aria-live'),
      ).toBe('polite');
    });

    it('should swallow error toasts while the error lock is held', async () => {
      service.addLockError();

      await service.error({ message: 'Failed' });

      expect(toasts()).toHaveLength(0);
      expect(ToastService.lockError).toBe(1);
    });

    it('should show info toasts while the error lock is held', async () => {
      service.addLockError();

      await service.info({ message: 'Saved' });

      expect(toasts()).toHaveLength(1);
    });

    it('should show error toasts again once every lock is released', async () => {
      service.addLockError();
      service.addLockError();
      service.removeLockError();
      await service.error({ message: 'Still locked' });

      service.removeLockError();
      await service.error({ message: 'Failed' });

      expect(toasts().map((toast) => toast.textContent?.trim())).toEqual([
        expect.stringContaining('Failed'),
      ]);
    });

    it('should not let removeLockError go below zero', async () => {
      service.removeLockError();

      await service.error({ message: 'Failed' });

      expect(ToastService.lockError).toBe(0);
      expect(toasts()).toHaveLength(1);
    });

    it('should remove the toasts when the service is destroyed', async () => {
      await service.info({ message: 'Saved' });

      TestBed.resetTestingModule();

      expect(container()).toBeNull();
    });
  });

  describe('preset notification', () => {
    beforeEach(() =>
      setup([
        {
          provide: NOTIFICATION_STANDARD_COMPONENT_TOKEN,
          useValue: NotificationPresetComponent,
        },
      ]),
    );

    async function render(): Promise<void> {
      const appRef = TestBed.inject(ApplicationRef);
      appRef.tick();
      await new Promise((resolve) => setTimeout(resolve));
      appRef.tick();
    }

    it('should render the toasts through the registered notification', async () => {
      await service.info({ title: 'Profile', message: 'Saved' });
      await render();

      const preset = toasts()[0].querySelector('smart-notification-preset');
      expect(preset).toBeTruthy();
      expect(preset?.textContent).toContain('Profile');
      expect(preset?.textContent).toContain('Saved');
    });

    it('should keep the message of a toast with a title and buttons', async () => {
      await service.info({
        title: 'Deleted',
        message: 'The note is in the trash.',
        buttons: [{ text: 'Undo', position: 'end', handler: jest.fn() }],
      });
      await render();

      expect(toasts()[0].textContent).toContain('The note is in the trash.');
      expect(button('Undo')).toBeTruthy();
    });

    it('should run the handler of a button of the registered notification', async () => {
      const undo = jest.fn();
      await service.info({
        message: 'Deleted',
        buttons: [{ text: 'Undo', position: 'end', handler: undo }],
      });
      await render();

      button('Undo').click();

      expect(undo).toHaveBeenCalledTimes(1);
      expect(toasts()).toHaveLength(0);
    });

    it('should close the toast on the close button of the registered notification', async () => {
      await service.error({ message: 'Failed' });
      await render();

      button('Close').click();

      expect(toasts()).toHaveLength(0);
    });
  });
});
