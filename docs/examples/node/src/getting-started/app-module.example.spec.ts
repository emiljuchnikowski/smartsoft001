import { Test, TestingModule } from '@nestjs/testing';

import { PermissionService, SharedConfig } from '@smartsoft001/nestjs';

import { AppModule } from './app-module.example';

describe('docs-examples-node: AppModule', () => {
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('should provide PermissionService', () => {
    const permissionService = moduleRef.get(PermissionService);

    expect(permissionService).toBeInstanceOf(PermissionService);
  });

  it('should expose the token configuration passed to SharedModule.forRoot', () => {
    const config = moduleRef.get(SharedConfig);

    expect(config.tokenConfig?.expiredIn).toBe(3600);
  });
});
