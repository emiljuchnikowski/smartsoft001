import { TestBed } from '@angular/core/testing';
import { PopoverController } from '@ionic/angular';

import { PopoverService } from './popover.service';

describe('angular: PopoverService', () => {
  let popoverService: PopoverService;
  let popoverCtrlMock: any;

  beforeEach(() => {
    jest.clearAllMocks();
    popoverCtrlMock = {
      dismiss: jest.fn().mockResolvedValue(undefined),
    };
    TestBed.configureTestingModule({
      providers: [
        PopoverService,
        { provide: PopoverController, useValue: popoverCtrlMock },
      ],
    });
    popoverService = TestBed.inject(PopoverService);
  });

  it('should be created', () => {
    expect(popoverService).toBeTruthy();
  });

  describe('close', () => {
    it('should call PopoverController.dismiss', async () => {
      await popoverService.close();
      expect(popoverCtrlMock.dismiss).toHaveBeenCalled();
    });
    it('should resolve when PopoverController.dismiss resolves', async () => {
      popoverCtrlMock.dismiss.mockResolvedValue('done');
      await expect(popoverService.close()).resolves.toBeUndefined();
    });
  });
});
