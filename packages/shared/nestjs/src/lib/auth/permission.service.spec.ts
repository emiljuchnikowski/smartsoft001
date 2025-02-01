import { Test, TestingModule } from '@nestjs/testing';
import { DomainForbiddenError } from '@smartsoft001/domain-core';
import { IUser } from '@smartsoft001/users';

import { PermissionService } from './permission.service';
import { SharedConfig } from '../shared.config';

describe('shared-nestjs: PermissionService', () => {
  let service: PermissionService;
  let config: SharedConfig;

  beforeEach(async () => {
    config = {
      permissions: {
        create: ['admin', 'editor'],
        read: ['admin', 'editor', 'viewer'],
        update: ['admin', 'editor'],
        delete: ['admin'],
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionService,
        { provide: SharedConfig, useValue: config },
      ],
    }).compile();

    service = module.get<PermissionService>(PermissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should allow access if user has the required permission', () => {
    const user: IUser = { username: 'testuser', permissions: ['admin'] };
    expect(() => service.valid('create', user)).not.toThrow();
  });

  it('should throw DomainForbiddenError if user does not have the required permission', () => {
    const user: IUser = { username: 'testuser', permissions: ['viewer'] };
    expect(() => service.valid('create', user)).toThrow(DomainForbiddenError);
  });

  it('should not throw if permissions config is not defined', () => {
    config.permissions = undefined;
    const user: IUser = { username: 'testuser', permissions: ['admin'] };
    expect(() => service.valid('create', user)).not.toThrow();
  });

  it('should not throw if permission type config is not defined', () => {
    const user: IUser = { username: 'testuser', permissions: ['admin'] };
    expect(() => service.valid('nonexistent', user)).not.toThrow();
  });

  it('should throw DomainForbiddenError if user permissions are not defined', () => {
    const user: IUser = { username: 'testuser', permissions: [] };
    expect(() => service.valid('create', user)).toThrow(DomainForbiddenError);
  });
});
