import { IUser, IUserCredentials } from '@smartsoft001/users';

import { adminUser, credentials } from './user.example';

describe('docs-examples-node: user fixtures', () => {
  it('should carry the role names checked by PermissionService', () => {
    expect(adminUser.permissions).toEqual(['admin', 'user']);
  });

  it('should scope the user to a single tenant', () => {
    expect(adminUser.scope).toBe('my-app');
  });

  it('should sign in with the username of the user', () => {
    expect(credentials.username).toBe(adminUser.username);
  });

  it('should satisfy the exported interfaces', () => {
    const user: IUser = adminUser;
    const login: IUserCredentials = credentials;

    expect(Object.keys(login)).toEqual(['username', 'password']);
    expect(user.username).toEqual(expect.any(String));
  });
});
