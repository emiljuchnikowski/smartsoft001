import { Injectable } from '@nestjs/common';
import { ChangeStream, Collection, Condition, Db, MongoClient, ObjectId } from 'mongodb';
import { Observable, Observer } from 'rxjs';
import { finalize, share } from 'rxjs/operators';

import {
  IEntity,
  IItemRepository,
  IItemRepositoryOptions,
  ISpecification,
} from '@smartsoft001/domain-core';
import { IUser } from '@smartsoft001/users';
import { ItemChangedData } from '@smartsoft001/crud-shell-dtos';
import { ObjectService } from '@smartsoft001/utils';
import { getModelFieldsWithOptions } from '@smartsoft001/models';

import { getMongoUrl } from '../mongo.utils';
import { IMongoTransaction } from '../mongo.unitofwork';
import { MongoConfig } from '@smartsoft001/mongo';

@Injectable()
export class MongoItemRepository<
  T extends IEntity<string>
> extends IItemRepository<T> {
  constructor(protected config: MongoConfig) {
    super();
  }

  async create(
    item: T,
    user: IUser,
    repoOptions?: IItemRepositoryOptions
  ): Promise<void> {
    await this.collectionContext(async (collection) => {
      try {
        await collection.insertOne(this.getModelToCreate(item as T, user), {
          session: (repoOptions?.transaction as IMongoTransaction)?.session,
        });
        this.logChange('create', item, repoOptions, user, null).then();
      } catch (errInsert) {
        this.logChange('create', item, repoOptions, user, errInsert).then();
        throw errInsert;
      }
    });
  }

  async clear(
    user: IUser,
    repoOptions?: IItemRepositoryOptions
  ): Promise<void> {
    await this.collectionContext(async (collection) => {
      try {
        await collection.deleteMany(
          {},
          { session: (repoOptions?.transaction as IMongoTransaction)?.session }
        );
        this.logChange('clear', null, repoOptions, user, null).then();
      } catch (errClear) {
        this.logChange('clear', null, repoOptions, user, errClear).then();
        throw errClear;
      }
    });
  }

  async createMany(
    list: T[],
    user: IUser,
    repoOptions?: IItemRepositoryOptions
  ): Promise<void> {
    await this.collectionContext(async (collection) => {
      try {
        await collection.insertMany(
          list.map((item) => this.getModelToCreate(item as T, user)),
          { session: (repoOptions?.transaction as IMongoTransaction)?.session }
        );
        this.logChange('createMany', null, repoOptions, user, null).then();
      } catch (errInsert) {
        this.logChange('createMany', null, repoOptions, user, errInsert).then();
        throw errInsert;
      }
    });
  }

  async update(
    item: T,
    user: IUser,
    repoOptions?: IItemRepositoryOptions
  ): Promise<void> {
    await this.collectionContext(async (collection) => {
      try {
        const info = await this.getInfo(item.id, collection);

        await collection.replaceOne(
          { _id: item.id as any },
          this.getModelToUpdate(item as T, user, info),
          { session: (repoOptions?.transaction as IMongoTransaction)?.session }
        );
        this.logChange('update', item, repoOptions, user, null).then();
      } catch (errInsert) {
        this.logChange('update', item, repoOptions, user, errInsert).then();
        throw errInsert;
      }
    });
  }

  async updatePartial(
    item: Partial<T> & { id: string },
    user: IUser,
    repoOptions?: IItemRepositoryOptions
  ): Promise<void> {
    await this.collectionContext(async (collection) => {
      try {
        const info = await this.getInfo(item.id, collection);

        await collection.updateOne(
          { _id: item.id as unknown as Condition<ObjectId> },
          {
            $set: this.getModelToUpdate(item as T, user, info),
          },
          { session: (repoOptions?.transaction as IMongoTransaction)?.session }
        );
        this.logChange('updatePartial', item, repoOptions, user, null).then();
      } catch (errUpdate) {
        this.logChange('updatePartial', item, repoOptions, user, errUpdate).then();
        throw errUpdate;
      }
    });
  }

  async updatePartialManyByCriteria(
    criteria: any,
    set: Partial<T>,
    user: IUser,
    repoOptions?: IItemRepositoryOptions
  ): Promise<void> {
    await this.collectionContext(async (collection) => {
      try {
        this.convertIdInCriteria(criteria);

        await collection.updateMany(
          criteria,
          {
            $set: {
              ...set,
              '__info.update': {
                username: user?.username,
                date: new Date(),
              },
            },
          },
          { session: (repoOptions?.transaction as IMongoTransaction)?.session }
        );
        this.logChange(
          'updatePartialManyByCriteria',
          {
            ...criteria,
            set,
          },
          repoOptions,
          user,
          null
        ).then();
      } catch (errUpdate) {
        this.logChange(
          'updatePartialManyByCriteria',
          {
            ...criteria,
            set,
          },
          repoOptions,
          user,
          errUpdate
        ).then();
        throw errUpdate;
      }
    });
  }

  updatePartialManyBySpecification(
    spec: ISpecification,
    set: Partial<T>,
    user: IUser,
    repoOptions?: IItemRepositoryOptions
  ): Promise<void> {
    return this.updatePartialManyByCriteria(
      spec.criteria,
      set,
      user,
      repoOptions
    );
  }

  async delete(
    id: string,
    user: IUser,
    repoOptions?: IItemRepositoryOptions
  ): Promise<void> {
    await this.collectionContext(async (collection) => {
      try {
        await collection.deleteOne(
          { _id: id as any },
          { session: (repoOptions?.transaction as IMongoTransaction)?.session }
        );
        this.logChange(
          'delete',
          {
            id,
          },
          repoOptions,
          user,
          null
        ).then();
      } catch (errDelete) {
        this.logChange(
          'delete',
          {
            id,
          },
          repoOptions,
          user,
          errDelete
        ).then();
        throw errDelete;
      }
    });
  }

  async getById(id: string, repoOptions?: IItemRepositoryOptions): Promise<T> {
    return await this.collectionContext<T>(async (collection) => {
      const item =  await collection.findOne<T>(
        { _id: id as any },
        {
          session: (repoOptions?.transaction as IMongoTransaction)?.session,
        }
      );

      return this.getModelToResult(item);
    });
  }

  async getByCriteria(
    criteria: any,
    options: any = {}
  ): Promise<{ data: T[]; totalCount: number }> {
    return await this.collectionContext<T>(async (collection) => {
      this.convertIdInCriteria(criteria);
      this.generateSearch(criteria);

      const totalCount = await this.getCount(criteria, collection);

      const aggregate = [];

      if (criteria) {
        aggregate.push({ $match: criteria });
      }

      if (options?.sort) {
        aggregate.push({ $sort: options.sort });
      }

      if (options?.skip) {
        aggregate.push({ $skip: options.skip });
      }

      if (options?.limit) {
        aggregate.push({ $limit: options.limit });
      }

      if (options?.project) {
        aggregate.push({ $project: options.project });
      }

      if (options?.min) {
        aggregate.push({ $min: options.min });
      }

      if (options?.max) {
        aggregate.push({ $max: options.max });
      }

      if (options?.group) {
        aggregate.push({ $group: options.group });
      }

      const list = await collection
        .aggregate<T>(aggregate, {
          allowDiskUse: options?.allowDiskUse,
          session: options?.session,
        })
        .toArray();

      return {
        data: list.map((item) => this.getModelToResult(item)),
          totalCount,
      }
    });
  }

  getBySpecification(
    spec: ISpecification,
    options: any = {}
  ): Promise<{ data: T[]; totalCount: number }> {
    return this.getByCriteria(spec.criteria, options);
  }

  async countByCriteria(criteria: any): Promise<number> {
    return await this.collectionContext<number>(async (collection) => {
      this.convertIdInCriteria(criteria);
      this.generateSearch(criteria);

      return await this.getCount(criteria, collection);
    });
  }

  countBySpecification(spec: ISpecification): Promise<number> {
    return this.countByCriteria(spec.criteria);
  }

  changesByCriteria(criteria: { id?: string }): Observable<ItemChangedData> {
    let stream: ChangeStream<any>;
    let client: MongoClient;

    return new Observable((observer: Observer<ItemChangedData>) => {
      (async () => {
        try {
          client = await MongoClient.connect(this.getUrl());
          const db = client.db(this.config.database);
          const collection = db.collection(this.config.collection);

          const pipeline = criteria.id
            ? [
              {
                $match: {
                  'documentKey._id': criteria.id,
                },
              },
            ]
            : [];

          stream = collection.watch(pipeline).on('change', (result) => {
            observer.next({
              id: result['documentKey']['_id'],
              type: this.mapChangeType(result.operationType),
              data:
                result.operationType === 'update'
                  ? result['updateDescription']
                  : this.getModelToResult(result['fullDocument']),
            } as any);
          });
        } catch (err) {
          observer.error(err);
        }
      })();
    }).pipe(
      finalize(async () => {
        console.log('Stop watch');

        await stream.close();
        await client.close();
      }),
      share()
    );
  }

  protected async getContext<TResult>(
    handler: (db: Db) => Promise<TResult>
  ): Promise<TResult> {
    const client = await MongoClient.connect(this.getUrl());

    const db = client.db(this.config.database);

    try {
      const result = await handler(db);
      await client.close();
      return result;
    } catch (e) {
      await client.close();
      throw e;
    }
  }

  protected async  getCount(criteria: any, collection: any): Promise<any> {
    this.convertIdInCriteria(criteria);
    return await collection.countDocuments(criteria);
  }

  protected async getInfo(id: string, collection: Collection<any>): Promise<any> {
    const array = await collection
      .aggregate([{ $match: { _id: id } }, { $project: { __info: 1 } }])
      .toArray();

    return array[0] ? array[0]['__info'] : {};
  }

  protected getModelToCreate(item: T, user: IUser): T {
    const result = ObjectService.removeTypes(item);
    result['_id'] = result.id;
    delete result.id;

    result['__info'] = {
      create: {
        username: user ? user.username : null,
        date: new Date(),
      },
    };

    return result;
  }

  protected mapChangeType(dbType: string) {
    const map = {
      insert: 'create',
      update: 'update',
      delete: 'delete',
    };

    return map[dbType];
  }

  protected getModelToUpdate(
    item: { id: string },
    user: IUser,
    info: any
  ): { id: string } {
    const result = ObjectService.removeTypes(item);
    result['_id'] = result.id;
    delete result.id;

    result['__info'] = {
      ...info,
      update: {
        username: user ? user.username : null,
        date: new Date(),
      },
    };

    return result;
  }

  protected getModelToResult(item: T): T {
    if (!item) return null;

    const result = ObjectService.removeTypes(item) as any;
    result['id'] = result._id;

    delete result._id;
    delete result['__info'];

    return result as T;
  }

  protected getUrl(): string {
    return getMongoUrl(this.config);
  }

  protected async  logChange(type: any, item: any, options: any, user: any, error: any) {
    const client = await MongoClient.connect(this.getUrl());

    const db = client.db(this.config.database);

    try {
      await db.collection('changes').insertOne(
        {
          type,
          collection: this.config.collection,
          item,
          options,
          user,
          error,
          date: new Date(),
        }
      );
    } catch (e) {
      console.warn(e);
    } finally {
      await client.close();
    }
  }

  protected generateSearch(criteria: any): void {
    if (!criteria['$search']) return;

    if (this.config.type) {
      const modelFields = getModelFieldsWithOptions(
        new this.config.type()
      ).filter((i) => i.options.search);

      if (modelFields.length) {
        const searchArray = [];

        modelFields.forEach((val) => {
          const res = {};

          res[val.key] = {
            $regex: this.convertRegex(criteria['$search']),
            $options: 'i',
          };

          searchArray.push(res);
        });

        if (!criteria['$or']) criteria['$or'] = searchArray;
        else if (criteria['$or'] && !criteria['$and']) {
          criteria['$and'] = [{ $or: criteria['$or'] }, { $or: searchArray }];

          delete criteria['$or'];
        } else if (criteria['$and']) {
          criteria['$and'] = [...criteria['$and'], { $or: searchArray }];
        }

        delete criteria['$search'];

        return;
      }
    }

    const customCriteria = {
      $text: { $search: ' "' + this.convertRegex(criteria['$search']) + '" ' },
    };

    delete criteria['$search'];

    criteria = {
      ...criteria,
      ...customCriteria,
    };
  }

  protected convertIdInCriteria(criteria: any) {
    if (criteria['id']) {
      criteria['_id'] = criteria['id'];
      delete criteria['id'];
    }
  }

  protected convertRegex(val: string): string {
    return val.toString().replace(/\*/g, '[*]');
  }

  protected async collectionContext<T>(
    callback: (collection: Collection) => Promise<any>,
    repoOptions?: IItemRepositoryOptions
  ): Promise<any> {
    const client: MongoClient = (repoOptions?.transaction as IMongoTransaction)
      ?.connection
      ? (repoOptions.transaction as IMongoTransaction).connection
      : await MongoClient.connect(this.getUrl());

    const db = client.db(this.config.database);

    let result: T;

    try {
      result = await callback(db.collection(this.config.collection));
    } finally {
      if (!(repoOptions?.transaction as IMongoTransaction))
        await client.close();
    }

    return result;
  }
}
