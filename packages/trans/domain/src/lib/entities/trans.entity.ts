import { Column, Entity, ObjectIdColumn } from 'typeorm';

import { IEntity } from '@smartsoft001/domain-core';

@Entity('trans')
export class Trans<T> implements IEntity<string> {
  @ObjectIdColumn({ generated: false })
  id!: string;

  @Column()
  externalId!: string;

  @Column()
  name!: string;

  @Column()
  amount!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  email!: string;

  @Column()
  contactPhone!: string;

  @Column()
  data!: T;

  @Column()
  system!: TransSystem;

  @Column()
  options: any;

  @Column()
  status!: TransStatus;

  @Column()
  modifyDate!: Date;

  @Column(() => TransHistory)
  history!: TransHistory<T>[];

  @Column()
  clientIp!: string;

  /**
   * Set by `RefresherService` while one instance applies a status change, and
   * cleared when it ends. Internal: do not write it yourself.
   */
  @Column()
  refreshLockId?: string | null;

  /** When the claim in `refreshLockId` may be taken over by another instance. */
  @Column()
  refreshLockUntil?: Date | null;
}

export class TransHistory<T> {
  @Column()
  amount!: number;

  @Column()
  data: any;

  @Column()
  system!: TransSystem;

  @Column()
  status!: TransStatus;

  @Column()
  modifyDate!: Date;
}

export type TransSystem = 'payu' | 'paypal' | 'revolut' | 'paynow';
export type TransStatus =
  | 'prepare'
  | 'new'
  | 'error'
  | 'started'
  | 'completed'
  | 'canceled'
  | 'pending'
  | 'refund';

export const TRANS_SYSTEMS = ['payu', 'paypal', 'revolut', 'paynow'];
