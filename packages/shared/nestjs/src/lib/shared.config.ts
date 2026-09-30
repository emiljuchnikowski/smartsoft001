import { Injectable } from '@nestjs/common';

import { IUser } from '@smartsoft001/users';

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
  /** HTTP attachments are denied unless an application supplies a resource policy. */
  attachmentPolicy?: (context: {
    operation: 'create' | 'read' | 'delete';
    id: string;
    user: IUser | undefined;
  }) => boolean | Promise<boolean>;
}

export type PermissionType = 'create' | 'read' | 'update' | 'delete' | string;
