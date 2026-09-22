import { Injectable, Logger } from '@nestjs/common';
import * as CombinedStream from 'combined-stream';
import { Guid } from 'guid-typescript';
import { Memoize } from 'lodash-decorators';
import { Observable } from 'rxjs';

import { ICreateManyOptions } from '@smartsoft001/crud-domain';
import { ItemChangedData } from '@smartsoft001/crud-shell-dtos';
import {
  DomainValidationError,
  IAttachmentRepository,
  IEntity,
  IItemRepository,
  ISpecification,
} from '@smartsoft001/domain-core';
import { castModel, getInvalidFields, isModel } from '@smartsoft001/models';
import { PermissionService } from '@smartsoft001/nestjs';
import { IUser } from '@smartsoft001/users';
import { GuidService, PasswordService } from '@smartsoft001/utils';

import { Readable, Stream } from 'stream';

/**
 * The two credential fields the service treats specially on every entity:
 * `password` is hashed before it is stored and stripped before it is returned,
 * `passwordConfirm` is only ever a form helper and never stored.
 */
type WithCredentials = { password?: string; passwordConfirm?: string };

@Injectable()
export class CrudService<T extends IEntity<string>> {
  private _logger = new Logger(CrudService.name, { timestamp: true });

  constructor(
    protected readonly permissionService: PermissionService,
    protected readonly repository: IItemRepository<T>,
    protected readonly attachmentRepository: IAttachmentRepository<T>,
  ) {}

  async create(data: T, user: IUser): Promise<string> {
    data.id = Guid.raw();

    try {
      this.permissionService.valid('create', user);

      castModel(data, 'create', user.permissions);
      this.checkValidCreate(data, user.permissions);

      await this.hashCredentials(data);
      await this.repository.create(data, user);

      return data.id;
    } catch (e) {
      this._logger.error(e);
      throw e;
    }
  }

  async createMany(
    data: T[],
    user: IUser,
    options: ICreateManyOptions,
  ): Promise<T[]> {
    data.forEach((item) => {
      item.id = Guid.raw();
    });

    try {
      this.permissionService.valid('create', user);

      data.forEach((item) => {
        castModel(item, 'create', user.permissions);
        this.checkValidCreate(item, user.permissions);
      });

      if (options && options.mode === 'replace') {
        await this.repository.clear(user);
      }

      for (let index = 0; index < data.length; index++) {
        await this.hashCredentials(data[index]);
      }

      await this.repository.createMany(data, user);
    } catch (e) {
      this._logger.error(e);
      throw e;
    }

    return data;
  }

  /** Resolves to `null` when no item has that id; the caller decides what that means (the controller answers 404). */
  async readById(id: string, user: IUser): Promise<T | null> {
    try {
      this.permissionService.valid('read', user);
      const result = await this.repository.getById(id);

      if (!result) return null;

      this.stripPassword(result);

      return result;
    } catch (e) {
      this._logger.error(e);
      throw e;
    }
  }

  async read(
    criteria: any,
    options: any,
    user: IUser,
  ): Promise<{ data: T[]; totalCount: number }> {
    try {
      this.permissionService.valid('read', user);
      const result = await this.repository.getByCriteria(criteria, options);
      result.data.forEach((item) => this.stripPassword(item));

      return result;
    } catch (e) {
      this._logger.error(e);
      throw e;
    }
  }

  readBySpec(
    spec: ISpecification,
    options: any,
    user: IUser,
  ): Promise<{ data: T[]; totalCount: number }> {
    return this.read(spec.criteria, options, user);
  }

  async update(id: string, data: T, user: IUser): Promise<void> {
    try {
      data.id = id;
      this.permissionService.valid('update', user);

      castModel(data, 'update', user.permissions);
      this.checkValidUpdate(data, user.permissions);

      await this.hashCredentials(data);
      await this.repository.update(data, user);
    } catch (e) {
      this._logger.error(e);
      throw e;
    }
  }

  async updatePartial(
    id: string,
    data: Partial<T>,
    user: IUser,
  ): Promise<void> {
    try {
      // Same object, now known to carry the id.
      const item = Object.assign(data, { id });

      this.permissionService.valid('update', user);

      castModel(item, 'update', user.permissions);
      this.checkValidUpdatePartial(item, user.permissions);

      await this.hashCredentials(item);
      await this.repository.updatePartial(item, user);
    } catch (e) {
      this._logger.error(e);
      throw e;
    }
  }

  async delete(id: string, user: IUser): Promise<void> {
    try {
      this.permissionService.valid('delete', user);

      await this.repository.delete(id, user);
    } catch (e) {
      this._logger.error(e);
      throw e;
    }
  }

  async uploadAttachment(
    data: {
      id: string;
      fileName: string;
      stream: Stream;
      mimeType: string;
      encoding: string;
    },
    options?: { streamCallback?: (stream: unknown) => void; start?: number },
  ): Promise<string> {
    if (!data.id) {
      data.id = GuidService.create();
    }
    let oldId: string | null = null;

    if (options?.start) {
      oldId = data.id;
      const stream = await this.attachmentRepository.getStream(data.id, {
        start: 0,
        end: options.start - 1,
      });

      const combinedStream = CombinedStream.create();
      combinedStream.append(stream);
      combinedStream.append(data.stream);

      data.stream = combinedStream;
      data.id = GuidService.create();
    }

    this.attachmentRepository.upload(data, options);

    if (oldId) await this.attachmentRepository.delete(data.id);

    return data.id;
  }

  @Memoize()
  getAttachmentInfo(
    id: string,
  ): Promise<{ fileName: string; contentType: string; length: number } | null> {
    return this.attachmentRepository.getInfo(id);
  }

  getAttachmentStream(
    id: string,
    options?: { start: number; end?: number },
  ): Promise<Readable> {
    return this.attachmentRepository.getStream(id, options);
  }

  async deleteAttachment(id: string): Promise<void> {
    return this.attachmentRepository.delete(id);
  }

  changes(criteria: { id?: string }): Observable<ItemChangedData> {
    return this.repository.changesByCriteria(criteria);
  }

  private async hashCredentials(item: Partial<T>): Promise<void> {
    // Any entity may carry credentials; the decorators, not T, say whether it does.
    const credentials = item as Partial<T> & WithCredentials;

    if (credentials.password) {
      credentials.password = await PasswordService.hash(credentials.password);
    }
    if (credentials.passwordConfirm) {
      delete credentials.passwordConfirm;
    }
  }

  private stripPassword(item: T): void {
    const credentials = item as T & WithCredentials;

    delete credentials.password;
  }

  private checkValidCreate(item: T, permissions: Array<string>): void {
    const array = getInvalidFields(item, 'create', permissions);

    if (array.length) {
      throw new DomainValidationError('Required fields: ' + array.join(', '));
    }
  }

  private checkValidUpdate(item: T, permissions: Array<string>): void {
    const array = getInvalidFields(item, 'update', permissions);

    if (array.length) {
      throw new DomainValidationError('Required fields: ' + array.join(', '));
    }
  }

  private checkValidUpdatePartial(
    item: Partial<T>,
    permissions: Array<string>,
  ): void {
    if (!isModel(item)) return;

    const keys = Object.keys(item);
    const array = getInvalidFields(item, 'update', permissions)?.filter(
      (invalidField) => keys.some((key) => key === invalidField),
    );

    if (array.length) {
      throw new DomainValidationError('Required fields: ' + array.join(', '));
    }
  }
}
