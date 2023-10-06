import { Guid } from 'guid-typescript';

import { GuidService } from './guid.service';

describe('shared-utils: GuidService', () => {
  it('should create correct guid', () => {
    const guid = GuidService.create();
    expect(Guid.isGuid(guid)).toBeTruthy();
  });
});
