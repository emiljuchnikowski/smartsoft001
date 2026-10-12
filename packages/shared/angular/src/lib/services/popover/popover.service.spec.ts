import { TestBed } from '@angular/core/testing';

import { PopoverService } from './popover.service';

describe('@smartsoft001/angular: PopoverService', () => {
  let service: PopoverService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [PopoverService] });

    service = TestBed.inject(PopoverService);
  });

  it('should resolve close() without anything to close', async () => {
    await expect(service.close()).resolves.toBeUndefined();
  });
});
