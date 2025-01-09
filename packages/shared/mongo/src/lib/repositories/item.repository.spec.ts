import { MongoConfig, MongoItemRepository } from '@smartsoft001/mongo';
import { IUser } from '@smartsoft001/users';
import { IItemRepositoryOptions } from '@smartsoft001/domain-core';
import { IMongoTransaction } from '../mongo.unitofwork';

describe('MongoItemRepository - create', () => {
  let repository: MongoItemRepository<any>;
  let mockCollection: any;
  let mockLogChange: jest.Mock;

  beforeEach(() => {
    mockCollection = {
      insertOne: jest.fn(),
    };

    mockLogChange = jest.fn().mockResolvedValue(undefined);

    repository = new MongoItemRepository(new MongoConfig());
    jest.spyOn(repository as any, 'collectionContext').mockImplementation((callback: any) => {
      return callback(mockCollection);
    });
    jest.spyOn(repository as any, 'logChange').mockImplementation(mockLogChange);
    jest.spyOn(repository as any, 'getModelToCreate').mockImplementation((item: Record<string, any>, user: IUser) => ({
      ...item,
      _id: item.id,
      __info: { create: { username: user.username, date: new Date() } },
    }));
  });

  it('should call insertOne with the transformed item', async () => {
    const item = { id: '123', name: 'test item' };
    const user = { username: 'testuser', permissions: ['']};

    await repository.create(item, user);

    expect(mockCollection.insertOne).toHaveBeenCalledWith(
      {
        id: '123',
        name: 'test item',
        _id: '123',
        __info: {
          create: {
            username: 'testuser',
            date: expect.any(Date),
          },
        },
      },
      { session: undefined }
    );
  });

  it('should call logChange with correct parameters on success', async () => {
    const item = { id: '123', name: 'test item' };
    const user = { username: 'testuser', permissions: [''] };
    const repoOptions = { transaction: { session: 'mockSession', connection: 'mockConnection' } };

    await repository.create(item, user, repoOptions);

    expect(mockLogChange).toHaveBeenCalledWith(
      'create',
      item,
      repoOptions,
      user,
      null
    );
  });

  it('should call logChange with error on failure and rethrow the error', async () => {
    const item = { id: '123', name: 'test item' };
    const user = { username: 'testuser', permissions: [''] };
    const error = new Error('Insert failed');
    mockCollection.insertOne.mockRejectedValue(error);

    await expect(repository.create(item, user)).rejects.toThrow(error);

    expect(mockLogChange).toHaveBeenCalledWith(
      'create',
      item,
      undefined,
      user,
      error
    );
  });

});

describe('MongoItemRepository - clear', () => {
  let repository: MongoItemRepository<any>;
  let mockCollection: any;
  let mockLogChange: jest.Mock;

  beforeEach(() => {
    mockCollection = {
      deleteMany: jest.fn(),
    };

    mockLogChange = jest.fn().mockResolvedValue(undefined);

    repository = new MongoItemRepository<any>(null as any);

    // Mock collectionContext
    jest.spyOn(repository as any, 'collectionContext').mockImplementation(async (callback: any) => {
      return callback(mockCollection);
    });

    // Mock logChange
    jest.spyOn(repository as any, 'logChange').mockImplementation(mockLogChange);
  });

  it('should call deleteMany and logChange on success', async () => {
    const mockUser: IUser = { username: 'testUser', permissions: [''] }; // Replace with actual IUser fields
    const mockRepoOptions: IItemRepositoryOptions = {
      transaction: { session: {} } as IMongoTransaction,
    };

    mockCollection.deleteMany.mockResolvedValueOnce({});

    await repository.clear(mockUser, mockRepoOptions);

    expect(mockCollection.deleteMany).toHaveBeenCalledWith(
      {},
      { session: (mockRepoOptions.transaction as IMongoTransaction).session }
    );
    expect(mockLogChange).toHaveBeenCalledWith('clear', null, mockRepoOptions, mockUser, null);
  });

  it('should call logChange with error if deleteMany fails', async () => {
    const mockUser: IUser = { username: 'testUser', permissions: [''] };
    const mockRepoOptions: IItemRepositoryOptions = {
      transaction: { session: {} } as IMongoTransaction,
    };
    const mockError = new Error('DeleteMany failed');

    mockCollection.deleteMany.mockRejectedValueOnce(mockError);

    await expect(repository.clear(mockUser, mockRepoOptions)).rejects.toThrow(mockError);

    expect(mockCollection.deleteMany).toHaveBeenCalledWith(
      {},
      { session: (mockRepoOptions.transaction as IMongoTransaction).session }
    );
    expect(mockLogChange).toHaveBeenCalledWith('clear', null, mockRepoOptions, mockUser, mockError);
  });

  it('should work without repoOptions', async () => {
    const mockUser: IUser = { username: 'testUser', permissions: [''] };

    mockCollection.deleteMany.mockResolvedValueOnce({});

    await repository.clear(mockUser);

    expect(mockCollection.deleteMany).toHaveBeenCalledWith({}, { session: undefined });
    expect(mockLogChange).toHaveBeenCalledWith('clear', null, undefined, mockUser, null);
  });
});

describe('MongoItemRepository.createMany', () => {
  let repository: MongoItemRepository<any>;
  let mockCollection: any;
  let mockLogChange: jest.Mock;
  let mockGetModelToCreate: jest.Mock;

  beforeEach(() => {
    mockCollection = {
      insertMany: jest.fn(),
    };

    mockLogChange = jest.fn().mockResolvedValue(undefined);
    mockGetModelToCreate = jest.fn((item, user) => ({ ...item, createdBy: user.username }));

    repository = new MongoItemRepository<any>(null as any);

    // Mock collectionContext
    jest.spyOn(repository as any, 'collectionContext').mockImplementation(async (callback: any) => {
      return callback(mockCollection);
    });

    // Mock logChange
    jest.spyOn(repository as any, 'logChange').mockImplementation(mockLogChange);

    // Mock getModelToCreate
    jest.spyOn(repository as any, 'getModelToCreate').mockImplementation(mockGetModelToCreate);
  });

  it('should call insertMany and logChange on success', async () => {
    const mockUser: IUser = { username: 'testUser', permissions: [''] };
    const mockRepoOptions: IItemRepositoryOptions = {
      transaction: { session: {} } as IMongoTransaction,
    };
    const mockList = [{ id: 1 }, { id: 2 }];

    mockCollection.insertMany.mockResolvedValueOnce({});

    await repository.createMany(mockList, mockUser, mockRepoOptions);

    expect(mockCollection.insertMany).toHaveBeenCalledWith(
      mockList.map((item) => ({ ...item, createdBy: mockUser.username })),
      { session: (mockRepoOptions.transaction as IMongoTransaction).session }
    );
    expect(mockLogChange).toHaveBeenCalledWith('createMany', null, mockRepoOptions, mockUser, null);
  });

  it('should call logChange with error if insertMany fails', async () => {
    const mockUser: IUser = { username: 'testUser', permissions: [''] };
    const mockRepoOptions: IItemRepositoryOptions = {
      transaction: { session: {} } as IMongoTransaction,
    };
    const mockList = [{ id: 1 }, { id: 2 }];
    const mockError = new Error('InsertMany failed');

    mockCollection.insertMany.mockRejectedValueOnce(mockError);

    await expect(repository.createMany(mockList, mockUser, mockRepoOptions)).rejects.toThrow(
      mockError
    );

    expect(mockCollection.insertMany).toHaveBeenCalledWith(
      mockList.map((item) => ({ ...item, createdBy: mockUser.username })),
      { session: (mockRepoOptions.transaction as IMongoTransaction).session }
    );
    expect(mockLogChange).toHaveBeenCalledWith(
      'createMany',
      null,
      mockRepoOptions,
      mockUser,
      mockError
    );
  });

  it('should work without repoOptions', async () => {
    const mockUser: IUser = { username: 'testUser', permissions: [''] };
    const mockList = [{ id: 1 }, { id: 2 }];

    mockCollection.insertMany.mockResolvedValueOnce({});

    await repository.createMany(mockList, mockUser);

    expect(mockCollection.insertMany).toHaveBeenCalledWith(
      mockList.map((item) => ({ ...item, createdBy: mockUser.username })),
      { session: undefined }
    );
    expect(mockLogChange).toHaveBeenCalledWith('createMany', null, undefined, mockUser, null);
  });

  it('should handle an empty list without calling insertMany', async () => {
    const mockUser: IUser = { username: 'testUser', permissions: [''] };

    await repository.createMany([], mockUser);

    expect(mockCollection.insertMany).not.toHaveBeenCalled();
    expect(mockLogChange).toHaveBeenCalledWith('createMany', null, undefined, mockUser, null);
  });
});


