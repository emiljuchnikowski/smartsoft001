import { MongoClient, Db, Collection } from 'mongodb';
import { IUser } from '@smartsoft001/users';
import { MongoConfig, MongoItemRepository } from '@smartsoft001/mongo';

jest.mock('mongodb');

describe('MongoItemRepository', () => {
  let repository: MongoItemRepository<any>;
  let mockClient: MongoClient;
  let mockDb: Db;
  let mockCollection: Collection;
  const mockConfig: MongoConfig = {
    host: 'host',
    port: 4200,
    database: 'testDb',
    collection: 'testCollection'
  };

  beforeEach(() => {
    mockClient = new MongoClient('mock-url') as any;
    mockDb = {
      collection: jest.fn().mockReturnValue({
        insertOne: jest.fn(),
        deleteOne: jest.fn(),
        findOne: jest.fn(),
        replaceOne: jest.fn(),
      }),
    } as unknown as Db;
    mockCollection = mockDb.collection('testCollection') as Collection;
    jest.spyOn(MongoClient, 'connect').mockResolvedValue(mockClient);
    jest.spyOn(mockClient, 'db').mockReturnValue(mockDb);

    repository = new MongoItemRepository(mockConfig);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an item', async () => {
    const item = { id: '123', name: 'testItem' };
    const user = { username: 'testUser' } as IUser;

    await repository.create(item, user);

    expect(mockDb.collection).toHaveBeenCalledWith('testCollection');
    expect(mockCollection.insertOne).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: '123',
        name: 'testItem',
        __info: expect.objectContaining({
          create: { username: 'testUser', date: expect.any(Date) },
        }),
      }),
      { session: undefined }
    );
  }, 10000);

  it('should delete an item by ID', async () => {
    const id = '123';
    const user = { username: 'testUser' } as IUser;

    await repository.delete(id, user);

    expect(mockDb.collection).toHaveBeenCalledWith('testCollection');
    expect(mockCollection.deleteOne).toHaveBeenCalledWith(
      { _id: id },
      { session: undefined }
    );
  });

  it('should update an item', async () => {
    const item = { id: '123', name: 'updatedItem' };
    const user = { username: 'testUser' } as IUser;

    mockCollection.findOne = jest.fn().mockResolvedValue({ __info: {} });

    await repository.update(item, user);

    expect(mockDb.collection).toHaveBeenCalledWith('testCollection');
    expect(mockCollection.replaceOne).toHaveBeenCalledWith(
      { _id: '123' },
      expect.objectContaining({
        _id: '123',
        name: 'updatedItem',
        __info: expect.objectContaining({
          update: { username: 'testUser', date: expect.any(Date) },
        }),
      }),
      { session: undefined }
    );
  });

  it('should get an item by ID', async () => {
    const id = '123';
    const mockItem = { _id: '123', name: 'testItem' };

    mockCollection.findOne = jest.fn().mockResolvedValue(mockItem);

    const result = await repository.getById(id);

    expect(mockDb.collection).toHaveBeenCalledWith('testCollection');
    expect(mockCollection.findOne).toHaveBeenCalledWith(
      { _id: id },
      { session: undefined }
    );
    expect(result).toEqual({
      id: '123',
      name: 'testItem',
    });
  });

  it('should handle errors during create', async () => {
    const item = { id: '123', name: 'testItem' };
    const user = { username: 'testUser' } as IUser;

    mockCollection.insertOne = jest.fn().mockRejectedValue(new Error('Insert error'));

    await expect(repository.create(item, user)).rejects.toThrow('Insert error');

    expect(mockCollection.insertOne).toHaveBeenCalled();
  });
});
