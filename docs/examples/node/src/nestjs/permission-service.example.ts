// #region usage
import { Injectable } from '@nestjs/common';

import { PermissionService } from '@smartsoft001/nestjs';
import { IUser } from '@smartsoft001/users';

@Injectable()
export class ReportsService {
  constructor(private readonly permissions: PermissionService) {}

  export(user: IUser): string[] {
    this.permissions.valid('read', user);

    return ['sales-2026-01', 'sales-2026-02'];
  }
}
// #endregion
