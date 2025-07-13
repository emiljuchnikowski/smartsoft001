
import { IEntity } from '@smartsoft001/domain-core';
import { IUser, IUserCredentials } from '@smartsoft001/users';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User implements IEntity<string>, IUser, IUserCredentials {
  @PrimaryGeneratedColumn()
  id: string;

  @Column('permissions')
  permissions: Array<string>;

  @Column('username')
  username: string;

  @Column('password')
  password: string;

  @Column('disabled')
  disabled: boolean;

  @Column('lastLoginDate')
  lastLoginDate: Date;

  @Column('authRefreshToken')
  authRefreshToken: string;

  @Column('facebookUserId')
  facebookUserId?: string;

  @Column('googleUserId')
  googleUserId?: string;
}
