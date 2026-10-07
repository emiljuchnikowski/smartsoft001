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
  /**
   * Decides change subscriptions; no policy means no subscription. Called once when a client
   * subscribes, without `type`, and again before each event with the change `type`. On a
   * `'delete'` event the resource is already gone, so do not load it to decide.
   */
  changePolicy?: (context: {
    id: string;
    user: IUser;
    type?: 'create' | 'update' | 'delete';
  }) => boolean | Promise<boolean>;
}

export type PermissionType = 'create' | 'read' | 'update' | 'delete' | string;
