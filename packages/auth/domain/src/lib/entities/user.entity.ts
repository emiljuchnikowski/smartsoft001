import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { IEntity } from '@smartsoft001/domain-core';
import { IUser, IUserCredentials } from '@smartsoft001/users';

/**
 * Persisted user. Instances are hydrated by the repository (or filled field by
 * field after `new User()`), never constructed with values, so the columns
 * every stored user carries are marked definitely assigned. The three
 * remaining columns describe events that may not have happened yet.
 */
@Entity('users')
export class User implements IEntity<string>, IUser, IUserCredentials {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column('permissions')
  permissions!: Array<string>;

  @Column('username')
  username!: string;

  @Column('password')
  password!: string;

  @Column('disabled')
  disabled?: boolean;

  @Column('lastLoginDate')
  lastLoginDate?: Date;

  @Column('authRefreshToken')
  authRefreshToken?: string;

  @Column('facebookUserId')
  facebookUserId?: string;

  @Column('googleUserId')
  googleUserId?: string;
}
