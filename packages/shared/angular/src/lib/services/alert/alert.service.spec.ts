import { TestBed } from '@angular/core/testing';
import { AlertController } from '@ionic/angular';

import { AlertService } from './alert.service';

describe('angular: AlertService', () => {
  let alertService: AlertService;

  const mockOptions = {
    header: 'Header',
    subHeader: 'subHeader',
    message: 'message',
    backdropDismiss: true,
    buttons: [{ text: 'text' }],
  };

  const mockAlert = {
    present: jest.fn(),
  };
  const mockAlertController = {
    create: jest.fn().mockResolvedValue(mockAlert),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        AlertService,
        { provide: AlertController, useValue: mockAlertController },
      ],
    });

    alertService = TestBed.inject(AlertService);
  });

  it('should be created', () => {
    expect(alertService).toBeTruthy();
  });

  describe('show', () => {
    it('should create alert with given options', async () => {
      await alertService.show(mockOptions);

      expect(mockAlertController.create).toHaveBeenCalledWith(mockOptions);
    });

    it('should call present function', async () => {
      await alertService.show(mockOptions);

      expect(mockAlert.present).toHaveBeenCalled();
    });

    it('should propagate promise rejections', async () => {
      mockAlertController.create.mockRejectedValue(
        new Error('Something Failed'),
      );

      await expect(alertService.show(mockOptions)).rejects.toThrow(
        'Something Failed',
      );
    });
  });
});
