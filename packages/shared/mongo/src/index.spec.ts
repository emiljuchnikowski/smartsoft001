import * as publicApi from './index';
import type { IMongoTransaction } from './index';

describe('mongo: public API', () => {
  it('should export the implementations MongoModule binds', () => {
    // `forRoot` binds `IAttachmentRepository` and `IUnitOfWork` to these two
    // classes, so a consumer writing its own provider list, or asserting what
    // came out of the injector, has to be able to name them.
    expect(publicApi.MongoAttachmentRepository).toBeDefined();
    expect(publicApi.MongoUnitOfWork).toBeDefined();
  });

  it('should export the connection string helper', () => {
    expect(
      publicApi.getMongoUrl({ host: 'localhost', port: 27017, database: 'db' }),
    ).toBe('mongodb://localhost:27017?authSource=db');
  });

  it('should export the transaction shape a scope callback receives', () => {
    // A compile-time assertion: the annotation below fails to build when
    // `IMongoTransaction` is missing from the entry point.
    const transaction: Pick<IMongoTransaction, 'session'> = {
      session: null as unknown as IMongoTransaction['session'],
    };

    expect(transaction).toHaveProperty('session');
  });

  it('should export the change feed payload types', () => {
    const change: publicApi.ItemChangedData = { id: '1', type: 'delete' };

    expect(change.type).toBe('delete');
  });
});
