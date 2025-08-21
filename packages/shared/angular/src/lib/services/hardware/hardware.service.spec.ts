import { TestBed } from '@angular/core/testing';
import { App } from '@capacitor/app';
import { Platform } from '@ionic/angular';

import { HardwareService } from './hardware.service';

describe('angular: HardwareService', () => {
  let hardwareService: HardwareService;
  let platformMock: any;
  let appAddListenerMock: any;

  beforeEach(() => {
    jest.clearAllMocks();
    platformMock = {
      is: jest.fn(),
    };
    appAddListenerMock = jest.fn();
    (App as any).addListener = appAddListenerMock;
    TestBed.configureTestingModule({
      providers: [
        HardwareService,
        { provide: Platform, useValue: platformMock },
      ],
    });
    hardwareService = TestBed.inject(HardwareService);
  });

  it('should be created', () => {
    expect(hardwareService).toBeTruthy();
  });

  describe('isMobile', () => {
    it('returns true if platform.is("capacitor") returns true', () => {
      platformMock.is.mockImplementation(
        (type: string) => type === 'capacitor',
      );
      expect(hardwareService.isMobile).toBe(true);
    });
    it('returns false if platform.is("capacitor") returns false', () => {
      platformMock.is.mockReturnValue(false);
      expect(hardwareService.isMobile).toBe(false);
    });
  });

  describe('isMobileWeb', () => {
    it('returns true if platform.is("mobileweb") returns true', () => {
      platformMock.is.mockImplementation(
        (type: string) => type === 'mobileweb',
      );
      expect(hardwareService.isMobileWeb).toBe(true);
    });
    it('returns false if platform.is("mobileweb") returns false', () => {
      platformMock.is.mockReturnValue(false);
      expect(hardwareService.isMobileWeb).toBe(false);
    });
  });
});
