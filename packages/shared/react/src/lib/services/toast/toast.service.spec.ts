import { ToastService } from './toast.service';

describe('@smartsoft001/react: ToastService', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('should queue info and error toasts in order with their type', async () => {
    const service = new ToastService();

    await service.info({ message: 'Saved' });
    await service.error({ title: 'Oops', message: 'Failed' });

    expect(service.toasts.get()).toEqual([
      { id: 1, type: 'info', message: 'Saved' },
      { id: 2, type: 'error', title: 'Oops', message: 'Failed' },
    ]);
  });

  it('should remove a toast after its duration', async () => {
    const service = new ToastService();
    await service.info({ message: 'Saved', duration: 500 });

    jest.advanceTimersByTime(500);

    expect(service.toasts.get()).toEqual([]);
  });

  it.each([
    ['missing', undefined],
    ['zero', 0],
    ['negative', -1],
  ])(
    'should remove a toast after 2000 ms when its duration is %s',
    async (_name, duration) => {
      const service = new ToastService();
      await service.info({ message: 'Saved', duration });

      jest.advanceTimersByTime(1999);
      const queuedBefore = service.toasts.get().length;
      jest.advanceTimersByTime(1);

      expect(queuedBefore).toBe(1);
      expect(service.toasts.get()).toEqual([]);
    },
  );

  it('should remove a toast on dismiss and cancel its timer', async () => {
    const service = new ToastService();
    await service.info({ message: 'Saved' });
    await service.info({ message: 'Other', duration: 5000 });

    service.dismiss(1);
    jest.advanceTimersByTime(2000);

    expect(service.toasts.get().map((toast) => toast.message)).toEqual([
      'Other',
    ]);
  });

  it('should swallow error toasts but not info toasts while the error lock is held', async () => {
    const service = new ToastService();
    service.addLockError();

    await service.error({ message: 'Failed' });
    await service.info({ message: 'Saved' });

    expect(service.toasts.get().map((toast) => toast.message)).toEqual([
      'Saved',
    ]);
  });

  it('should show error toasts again once every lock is released', async () => {
    const service = new ToastService();
    service.addLockError();
    service.addLockError();
    service.removeLockError();
    await service.error({ message: 'Still locked' });

    service.removeLockError();
    await service.error({ message: 'Failed' });

    expect(service.toasts.get().map((toast) => toast.message)).toEqual([
      'Failed',
    ]);
  });

  it('should not let removeLockError go below zero', async () => {
    const service = new ToastService();
    service.removeLockError();

    await service.error({ message: 'Failed' });

    expect(service.toasts.get()).toHaveLength(1);
  });
});
