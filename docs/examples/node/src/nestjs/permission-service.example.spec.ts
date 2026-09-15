import { Test, TestingModule } from '@nestjs/testing';

import { DomainForbiddenError } from '@smartsoft001/domain-core';
import { PermissionService, SharedConfig } from '@smartsoft001/nestjs';
import { IUser } from '@smartsoft001/users';

import { ReportsService } from './permission-service.example';

describe('docs-examples-node: ReportsService', () => {
  let service: ReportsService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        PermissionService,
        {
          provide: SharedConfig,
          useValue: {
            permissions: {
              create: ['admin'],
              read: ['admin', 'user'],
              update: ['admin'],
              delete: ['admin'],
            },
          },
        },
      ],
    }).compile();

    service = moduleRef.get(ReportsService);
  });

  it('should return the reports for a user with the read permission', () => {
    const user: IUser = { username: 'anna', permissions: ['user'] };

    const result = service.export(user);

    expect(result).toEqual(['sales-2026-01', 'sales-2026-02']);
  });

  it('should throw DomainForbiddenError for a user without the read permission', () => {
    const user: IUser = { username: 'greg', permissions: ['guest'] };

    expect(() => service.export(user)).toThrow(DomainForbiddenError);
  });
});
