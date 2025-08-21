import { TestBed } from '@angular/core/testing';
import { ToastController } from '@ionic/angular';

import { ToastService } from './toast.service';

describe('angular: ToastService', () => {
  let toastService: ToastService;
  let toastCtrlMock: any;

  beforeEach(() => {
    jest.clearAllMocks();
    toastCtrlMock = {
      create: jest.fn(),
    };
    TestBed.configureTestingModule({
      providers: [
        ToastService,
        { provide: ToastController, useValue: toastCtrlMock },
      ],
    });
    toastService = TestBed.inject(ToastService);
    ToastService.lockError = 0;
  });

  it('should be created', () => {
    expect(toastService).toBeTruthy();
  });

  describe('addLockError', () => {
    it('should increment lockError', () => {
      ToastService.lockError = 0;
      toastService.addLockError();
      expect(ToastService.lockError).toBe(1);
    });
  });

  describe('removeLockError', () => {
    it('should decrement lockError', () => {
      ToastService.lockError = 2;
      toastService.removeLockError();
      expect(ToastService.lockError).toBe(1);
    });
  });

  describe('error', () => {
    it('should not show toast if lockError is set', async () => {
      ToastService.lockError = 1;
      await toastService.error({ message: 'err' });
      expect(toastCtrlMock.create).not.toHaveBeenCalled();
    });
    it('should show toast with correct config if lockError is not set', async () => {
      ToastService.lockError = 0;
      const presentMock = jest.fn();
      toastCtrlMock.create.mockResolvedValue({ present: presentMock });
      const config = {
        title: 'Error',
        message: 'err',
        duration: 1234,
        buttons: [{ text: 'Ok', position: 'end', handler: jest.fn() }],
      } as import('./toast.service').IToastOptions;
      await toastService.error(config);
      expect(toastCtrlMock.create).toHaveBeenCalledWith(
        expect.objectContaining({
          position: 'bottom',
          header: 'Error',
          message: 'err',
          duration: 1234,
          buttons: [
            expect.objectContaining({
              text: 'Ok',
              side: 'end',
              role: 'cancel',
              handler: expect.any(Function),
            }),
          ],
        }),
      );
    });
    it('should call present on the toast', async () => {
      ToastService.lockError = 0;
      const presentMock = jest.fn();
      toastCtrlMock.create.mockResolvedValue({ present: presentMock });
      await toastService.error({ message: 'err' });
      expect(presentMock).toHaveBeenCalled();
    });
  });

  describe('info', () => {
    it('should show toast with correct config', async () => {
      const presentMock = jest.fn();
      toastCtrlMock.create.mockResolvedValue({ present: presentMock });
      const config = {
        title: 'Info',
        message: 'info',
        duration: 4321,
        buttons: [{ text: 'Close', position: 'start', handler: jest.fn() }],
      } as import('./toast.service').IToastOptions;
      await toastService.info(config);
      expect(toastCtrlMock.create).toHaveBeenCalledWith(
        expect.objectContaining({
          position: 'bottom',
          header: 'Info',
          message: 'info',
          duration: 4321,
          buttons: [
            expect.objectContaining({
              text: 'Close',
              side: 'start',
              handler: expect.any(Function),
            }),
          ],
        }),
      );
    });
    it('should call present on the toast', async () => {
      const presentMock = jest.fn();
      toastCtrlMock.create.mockResolvedValue({ present: presentMock });
      await toastService.info({ message: 'info' });
      expect(presentMock).toHaveBeenCalled();
    });
  });
});
