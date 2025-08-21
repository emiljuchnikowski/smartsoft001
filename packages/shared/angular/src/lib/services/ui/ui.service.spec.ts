import { TestBed } from '@angular/core/testing';
import {
  LoadingController,
  AlertController,
  ToastController,
} from '@ionic/angular';

import { UIService } from './ui.service';

describe('angular: UIService', () => {
  let uiService: UIService;
  let loadingCtrlMock: any;
  let alertCtrlMock: any;
  let toastCtrlMock: any;

  beforeEach(() => {
    jest.clearAllMocks();
    loadingCtrlMock = { create: jest.fn() };
    alertCtrlMock = { create: jest.fn() };
    toastCtrlMock = { create: jest.fn() };
    TestBed.configureTestingModule({
      providers: [
        UIService,
        { provide: LoadingController, useValue: loadingCtrlMock },
        { provide: AlertController, useValue: alertCtrlMock },
        { provide: ToastController, useValue: toastCtrlMock },
      ],
    });
    uiService = TestBed.inject(UIService);
  });

  it('should be created', () => {
    expect(uiService).toBeTruthy();
  });

  describe('showLoading', () => {
    it('should call LoadingController.create with correct message', async () => {
      const presentMock = jest.fn();
      const loaderMock = { present: presentMock };
      loadingCtrlMock.create.mockResolvedValue(loaderMock);
      await uiService.showLoading('Test loading');
      expect(loadingCtrlMock.create).toHaveBeenCalledWith({
        message: 'Test loading',
      });
    });
    it('should call present on the loader', async () => {
      const presentMock = jest.fn();
      const loaderMock = { present: presentMock };
      loadingCtrlMock.create.mockResolvedValue(loaderMock);
      await uiService.showLoading('Test loading');
      expect(presentMock).toHaveBeenCalled();
    });
    it('should return the loader instance', async () => {
      const presentMock = jest.fn();
      const loaderMock = { present: presentMock };
      loadingCtrlMock.create.mockResolvedValue(loaderMock);
      const result = await uiService.showLoading('Test loading');
      expect(result).toBe(loaderMock);
    });
  });

  describe('showSimpleAlert', () => {
    it('should call AlertController.create with correct message and heading', async () => {
      const presentMock = jest.fn();
      const alertMock = { present: presentMock };
      alertCtrlMock.create.mockResolvedValue(alertMock);
      await uiService.showSimpleAlert('Test message', 'Test heading');
      expect(alertCtrlMock.create).toHaveBeenCalledWith({
        header: 'Test heading',
        message: 'Test message',
        buttons: ['OK'],
      });
    });
    it('should call present on the alert', async () => {
      const presentMock = jest.fn();
      const alertMock = { present: presentMock };
      alertCtrlMock.create.mockResolvedValue(alertMock);
      await uiService.showSimpleAlert('Test message', 'Test heading');
      expect(presentMock).toHaveBeenCalled();
    });
  });

  describe('showAlertWithDismissCallback', () => {
    it('should call AlertController.create with correct heading, message, and button text', async () => {
      const presentMock = jest.fn();
      const onDidDismissMock = jest.fn().mockResolvedValue(undefined);
      const alertMock = {
        present: presentMock,
        onDidDismiss: onDidDismissMock,
      };
      alertCtrlMock.create.mockResolvedValue(alertMock);
      await uiService.showAlertWithDismissCallback(
        'Heading',
        'Msg',
        'Btn',
        jest.fn(),
      );
      expect(alertCtrlMock.create).toHaveBeenCalledWith({
        header: 'Heading',
        message: 'Msg',
        buttons: [{ text: 'Btn' }],
      });
    });
    it('should call present on the alert', async () => {
      const presentMock = jest.fn();
      const onDidDismissMock = jest.fn().mockResolvedValue(undefined);
      const alertMock = {
        present: presentMock,
        onDidDismiss: onDidDismissMock,
      };
      alertCtrlMock.create.mockResolvedValue(alertMock);
      await uiService.showAlertWithDismissCallback(
        'Heading',
        'Msg',
        'Btn',
        jest.fn(),
      );
      expect(presentMock).toHaveBeenCalled();
    });
    it('should call callback after dismiss', async () => {
      const presentMock = jest.fn();
      let dismissCallback: () => void = jest.fn();
      const onDidDismissMock = jest
        .fn()
        .mockImplementation(() =>
          Promise.resolve().then(() => dismissCallback()),
        );
      const alertMock = {
        present: presentMock,
        onDidDismiss: onDidDismissMock,
      };
      alertCtrlMock.create.mockResolvedValue(alertMock);
      dismissCallback = jest.fn();
      await uiService.showAlertWithDismissCallback(
        'Heading',
        'Msg',
        'Btn',
        dismissCallback,
      );
      expect(dismissCallback).toHaveBeenCalled();
    });
  });

  describe('showToast', () => {
    it('should call ToastController.create with correct message and duration', async () => {
      const presentMock = jest.fn();
      const toastMock = { present: presentMock };
      toastCtrlMock.create.mockResolvedValue(toastMock);
      await uiService.showToast('Toast message', 1234);
      expect(toastCtrlMock.create).toHaveBeenCalledWith({
        message: 'Toast message',
        color: 'dark',
        duration: 1234,
      });
    });
    it('should call present on the toast', async () => {
      const presentMock = jest.fn();
      const toastMock = { present: presentMock };
      toastCtrlMock.create.mockResolvedValue(toastMock);
      await uiService.showToast('Toast message', 1234);
      expect(presentMock).toHaveBeenCalled();
    });
    it('should return the toast instance', async () => {
      const presentMock = jest.fn();
      const toastMock = { present: presentMock };
      toastCtrlMock.create.mockResolvedValue(toastMock);
      const result = await uiService.showToast('Toast message', 1234);
      expect(result).toBe(toastMock);
    });
  });
});
