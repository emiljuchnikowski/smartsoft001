import { TestBed } from '@angular/core/testing';

import { HardwareService } from './hardware.service';

describe('@smartsoft001/angular: HardwareService', () => {
  let service: HardwareService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [HardwareService] });

    service = TestBed.inject(HardwareService);
  });

  it('should report a web platform', () => {
    expect([service.isMobile, service.isMobileWeb]).toEqual([false, false]);
  });

  it('should call the callback when the browser goes back', async () => {
    const callback = jest.fn();
    await service.onBackButtonClick(callback);

    window.dispatchEvent(new PopStateEvent('popstate'));

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should stop calling the callback once the handle is removed', async () => {
    const callback = jest.fn();
    const handle = await service.onBackButtonClick(callback);

    handle.remove();
    window.dispatchEvent(new PopStateEvent('popstate'));

    expect(callback).not.toHaveBeenCalled();
  });
});
