import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { User } from '@smartsoft001/auth-domain';
import { AuthService } from '@smartsoft001/auth-shell-app-services';
import { TokenController } from '@smartsoft001/auth-shell-nestjs';

import { AuthModule } from './auth-module.example';

describe('docs-examples-node: AuthModule', () => {
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue({
        findOne: async () => null,
        update: async () => undefined,
      })
      .compile();
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  it('should register the token controller', () => {
    const controller = moduleRef.get(TokenController);

    expect(controller).toBeInstanceOf(TokenController);
  });

  it('should provide the auth application service', () => {
    const service = moduleRef.get(AuthService);

    expect(service).toBeInstanceOf(AuthService);
  });
});
