export interface IUser {
  scope?: string;
  username: string;
  permissions: Array<string>;
}

export interface IUserCredentials {
  username: string;
  password: string;
}
