// #region usage
import { IUser, IUserCredentials } from '@smartsoft001/users';

/**
 * The identity contract shared by auth, repositories and CRUD.
 * `permissions` holds the role names that PermissionService matches against
 * the lists configured on SharedModule, and `scope` separates tenants.
 */
export const adminUser: IUser = {
  username: 'admin@example.com',
  permissions: ['admin', 'user'],
  scope: 'my-app',
};

/** The payload sent to the token endpoint. */
export const credentials: IUserCredentials = {
  username: adminUser.username,
  password: 'change-me',
};
// #endregion
