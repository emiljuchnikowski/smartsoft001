import { Injectable } from '@nestjs/common';

export interface ISharedPermissions {
  create: Array<string>;
  read: Array<string>;
  update: Array<string>;
  delete: Array<string>;
  [key: string]: Array<string>;
}

@Injectable()
export class SharedConfig {
  tokenConfig?: {
    secretOrPrivateKey: string;
    expiredIn: number;
  };
  permissions?: ISharedPermissions;
  type?: any;
}

export type PermissionType = 'create' | 'read' | 'update' | 'delete' | string;
