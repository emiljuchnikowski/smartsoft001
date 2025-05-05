import { MongoConfig, MongoItemRepository } from '@smartsoft001/mongo';
import { IUser } from '@smartsoft001/users';
import { IItemRepositoryOptions } from '@smartsoft001/domain-core';

import { IMongoTransaction } from '../mongo.unitofwork';

describe('shared-mongo: MongoItemRepository create function', () => {
  let repository: MongoItemRepository<any>;
  let mockCollection: any;
  let mockLogChange: jest.Mock;

  beforeEach(() => {
    mockCollection = {
      insertOne: jest.fn(),
    };

    mockLogChange = jest.fn().mockResolvedValue(undefined);

    repository = new MongoItemRepository(new MongoConfig());
    jest
      .spyOn(repository as any, 'collectionContext')
      .mockImplementation((callback: any) => {
        return callback(mockCollection);
      });
    jest
      .spyOn(repository as any, 'logChange')
      .mockImplementation(mockLogChange);
    jest
      .spyOn(repository as any, 'getModelToCreate')
      .mockImplementation((item: Record<string, any>, user: IUser) => ({
        ...item,
        _id: item.id,
        __info: { create: { username: user.username, date: new Date() } },
      }));
  });

  it('should call insertOne with the transformed item', async () => {
    const item = { id: '123', name: 'test item' };
    const user = { username: 'testuser', permissions: [''] };

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
      { session: undefined },
    );
  });

  it('should call logChange with correct parameters on success', async () => {
    const item = { id: '123', name: 'test item' };
    const user = { username: 'testuser', permissions: [''] };
    const repoOptions = {
      transaction: { session: 'mockSession', connection: 'mockConnection' },
    };

    await repository.create(item, user, repoOptions);

    expect(mockLogChange).toHaveBeenCalledWith(
      'create',
      item,
      repoOptions,
      user,
      null,
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
      error,
    );
  });
});

describe('shared-mongo: MongoItemRepository clear function', () => {
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
    jest
      .spyOn(repository as any, 'collectionContext')
      .mockImplementation(async (callback: any) => {
        return callback(mockCollection);
      });

    // Mock logChange
    jest
      .spyOn(repository as any, 'logChange')
      .mockImplementation(mockLogChange);
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
      { session: (mockRepoOptions.transaction as IMongoTransaction).session },
    );
    expect(mockLogChange).toHaveBeenCalledWith(
      'clear',
      null,
      mockRepoOptions,
      mockUser,
      null,
    );
  });

  it('should call logChange with error if deleteMany fails', async () => {
    const mockUser: IUser = { username: 'testUser', permissions: [''] };
    const mockRepoOptions: IItemRepositoryOptions = {
      transaction: { session: {} } as IMongoTransaction,
    };
    const mockError = new Error('DeleteMany failed');

    mockCollection.deleteMany.mockRejectedValueOnce(mockError);

    await expect(repository.clear(mockUser, mockRepoOptions)).rejects.toThrow(
      mockError,
    );

    expect(mockCollection.deleteMany).toHaveBeenCalledWith(
      {},
      { session: (mockRepoOptions.transaction as IMongoTransaction).session },
    );
    expect(mockLogChange).toHaveBeenCalledWith(
      'clear',
      null,
      mockRepoOptions,
      mockUser,
      mockError,
    );
  });

  it('should work without repoOptions', async () => {
    const mockUser: IUser = { username: 'testUser', permissions: [''] };

    mockCollection.deleteMany.mockResolvedValueOnce({});

    await repository.clear(mockUser);

    expect(mockCollection.deleteMany).toHaveBeenCalledWith(
      {},
      { session: undefined },
    );
    expect(mockLogChange).toHaveBeenCalledWith(
      'clear',
      null,
      undefined,
      mockUser,
      null,
    );
  });
});

describe('shared-mongo: MongoItemRepository createMany function', () => {
  let repository: MongoItemRepository<any>;
  let mockCollection: any;
  let mockLogChange: jest.Mock;
  let mockGetModelToCreate: jest.Mock;

  beforeEach(() => {
    mockCollection = {
      insertMany: jest.fn(),
    };

    mockLogChange = jest.fn().mockResolvedValue(undefined);
    mockGetModelToCreate = jest.fn((item, user) => ({
      ...item,
      createdBy: user.username,
    }));

    repository = new MongoItemRepository<any>(null as any);

    // Mock collectionContext
    jest
      .spyOn(repository as any, 'collectionContext')
      .mockImplementation(async (callback: any) => {
        return callback(mockCollection);
      });

    // Mock logChange
    jest
      .spyOn(repository as any, 'logChange')
      .mockImplementation(mockLogChange);

    // Mock getModelToCreate
    jest
      .spyOn(repository as any, 'getModelToCreate')
      .mockImplementation(mockGetModelToCreate);
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
      { session: (mockRepoOptions.transaction as IMongoTransaction).session },
    );
    expect(mockLogChange).toHaveBeenCalledWith(
      'createMany',
      null,
      mockRepoOptions,
      mockUser,
      null,
    );
  });

  it('should call logChange with error if insertMany fails', async () => {
    const mockUser: IUser = { username: 'testUser', permissions: [''] };
    const mockRepoOptions: IItemRepositoryOptions = {
      transaction: { session: {} } as IMongoTransaction,
    };
    const mockList = [{ id: 1 }, { id: 2 }];
    const mockError = new Error('InsertMany failed');

    mockCollection.insertMany.mockRejectedValueOnce(mockError);

    await expect(
      repository.createMany(mockList, mockUser, mockRepoOptions),
    ).rejects.toThrow(mockError);

    expect(mockCollection.insertMany).toHaveBeenCalledWith(
      mockList.map((item) => ({ ...item, createdBy: mockUser.username })),
      { session: (mockRepoOptions.transaction as IMongoTransaction).session },
    );
    expect(mockLogChange).toHaveBeenCalledWith(
      'createMany',
      null,
      mockRepoOptions,
      mockUser,
      mockError,
    );
  });

  it('should work without repoOptions', async () => {
    const mockUser: IUser = { username: 'testUser', permissions: [''] };
    const mockList = [{ id: 1 }, { id: 2 }];

    mockCollection.insertMany.mockResolvedValueOnce({});

    await repository.createMany(mockList, mockUser);

    expect(mockCollection.insertMany).toHaveBeenCalledWith(
      mockList.map((item) => ({ ...item, createdBy: mockUser.username })),
      { session: undefined },
    );
    expect(mockLogChange).toHaveBeenCalledWith(
      'createMany',
      null,
      undefined,
      mockUser,
      null,
    );
  });

  it('should handle an empty list without calling insertMany', async () => {
    const mockUser: IUser = { username: 'testUser', permissions: [''] };

    await repository.createMany([], mockUser);

    expect(mockCollection.insertMany).not.toHaveBeenCalled();
    expect(mockLogChange).toHaveBeenCalledWith(
      'createMany',
      null,
      undefined,
      mockUser,
      null,
    );
  });
});

describe('shared-mongo: MongoItemRepository update function', () => {
  let repository: MongoItemRepository<any>;
  let mockCollection: any;
  let mockLogChange: jest.Mock;
  let mockGetInfo: jest.Mock;
  let mockGetModelToUpdate: jest.Mock;

  beforeEach(() => {
    mockCollection = {
      replaceOne: jest.fn(),
    };

    mockLogChange = jest.fn().mockResolvedValue(undefined);
    mockGetInfo = jest.fn().mockResolvedValue({ existingData: 'value' });
    mockGetModelToUpdate = jest.fn((item, user, info) => ({
      ...item,
      updatedBy: user.username,
      previousInfo: info,
    }));

    repository = new MongoItemRepository<any>(null as any);

    // Mock collectionContext
    jest
      .spyOn(repository as any, 'collectionContext')
      .mockImplementation(async (callback: any) => {
        return callback(mockCollection);
      });

    // Mock logChange
    jest
      .spyOn(repository as any, 'logChange')
      .mockImplementation(mockLogChange);

    // Mock getInfo
    jest.spyOn(repository as any, 'getInfo').mockImplementation(mockGetInfo);

    // Mock getModelToUpdate
    jest
      .spyOn(repository as any, 'getModelToUpdate')
      .mockImplementation(mockGetModelToUpdate);
  });

  it('should call replaceOne and logChange on success', async () => {
    const mockUser: IUser = { username: 'testUser', permissions: [''] };
    const mockRepoOptions: IItemRepositoryOptions = {
      transaction: { session: {} } as IMongoTransaction,
    };
    const mockItem = { id: 'item1', name: 'Updated Item' };

    mockCollection.replaceOne.mockResolvedValueOnce({});

    await repository.update(mockItem, mockUser, mockRepoOptions);

    expect(mockGetInfo).toHaveBeenCalledWith(mockItem.id, mockCollection);
    expect(mockCollection.replaceOne).toHaveBeenCalledWith(
      { _id: mockItem.id },
      {
        ...mockItem,
        updatedBy: mockUser.username,
        previousInfo: { existingData: 'value' },
      },
      { session: (mockRepoOptions.transaction as IMongoTransaction).session },
    );
    expect(mockLogChange).toHaveBeenCalledWith(
      'update',
      mockItem,
      mockRepoOptions,
      mockUser,
      null,
    );
  });

  it('should call logChange with error if replaceOne fails', async () => {
    const mockUser: IUser = { username: 'testUser', permissions: [''] };
    const mockRepoOptions: IItemRepositoryOptions = {
      transaction: { session: {} } as IMongoTransaction,
    };
    const mockItem = { id: 'item1', name: 'Updated Item' };
    const mockError = new Error('ReplaceOne failed');

    mockCollection.replaceOne.mockRejectedValueOnce(mockError);

    await expect(
      repository.update(mockItem, mockUser, mockRepoOptions),
    ).rejects.toThrow(mockError);

    expect(mockGetInfo).toHaveBeenCalledWith(mockItem.id, mockCollection);
    expect(mockCollection.replaceOne).toHaveBeenCalledWith(
      { _id: mockItem.id },
      {
        ...mockItem,
        updatedBy: mockUser.username,
        previousInfo: { existingData: 'value' },
      },
      { session: (mockRepoOptions.transaction as IMongoTransaction).session },
    );
    expect(mockLogChange).toHaveBeenCalledWith(
      'update',
      mockItem,
      mockRepoOptions,
      mockUser,
      mockError,
    );
  });

  it('should work without repoOptions', async () => {
    const mockUser: IUser = { username: 'testUser', permissions: [''] };
    const mockItem = { id: 'item1', name: 'Updated Item' };

    mockCollection.replaceOne.mockResolvedValueOnce({});

    await repository.update(mockItem, mockUser);

    expect(mockGetInfo).toHaveBeenCalledWith(mockItem.id, mockCollection);
    expect(mockCollection.replaceOne).toHaveBeenCalledWith(
      { _id: mockItem.id },
      {
        ...mockItem,
        updatedBy: mockUser.username,
        previousInfo: { existingData: 'value' },
      },
      { session: undefined },
    );
    expect(mockLogChange).toHaveBeenCalledWith(
      'update',
      mockItem,
      undefined,
      mockUser,
      null,
    );
  });

  it('should throw if getInfo fails', async () => {
    const mockUser: IUser = { username: 'testUser', permissions: [''] };
    const mockItem = { id: 'item1', name: 'Updated Item' };
    const mockError = new Error('GetInfo failed');

    mockGetInfo.mockRejectedValueOnce(mockError);

    await expect(repository.update(mockItem, mockUser)).rejects.toThrow(
      mockError,
    );

    expect(mockGetInfo).toHaveBeenCalledWith(mockItem.id, mockCollection);
    expect(mockCollection.replaceOne).not.toHaveBeenCalled();
    expect(mockLogChange).toHaveBeenCalledWith(
      'update',
      mockItem,
      undefined,
      mockUser,
      mockError,
    );
  });
});

describe('shared-mongo: MongoItemRepository updatePartial function', () => {
  let repository: MongoItemRepository<any>;
  let mockCollection: any;
  let mockLogChange: jest.Mock;
  let mockGetInfo: jest.Mock;
  let mockGetModelToUpdate: jest.Mock;

  beforeEach(() => {
    mockCollection = {
      updateOne: jest.fn(),
    };

    mockLogChange = jest.fn().mockResolvedValue(undefined);
    mockGetInfo = jest.fn().mockResolvedValue({ existingData: 'value' });
    mockGetModelToUpdate = jest.fn((item, user, info) => ({
      ...item,
      updatedBy: user.username,
      previousInfo: info,
    }));

    repository = new MongoItemRepository<any>(null as any);

    // Mock collectionContext
    jest
      .spyOn(repository as any, 'collectionContext')
      .mockImplementation(async (callback: any) => {
        return callback(mockCollection);
      });

    // Mock logChange
    jest
      .spyOn(repository as any, 'logChange')
      .mockImplementation(mockLogChange);

    // Mock getInfo
    jest.spyOn(repository as any, 'getInfo').mockImplementation(mockGetInfo);

    // Mock getModelToUpdate
    jest
      .spyOn(repository as any, 'getModelToUpdate')
      .mockImplementation(mockGetModelToUpdate);
  });

  it('should call updateOne and logChange on success', async () => {
    const mockUser: IUser = { username: 'testUser', permissions: [''] };
    const mockRepoOptions: IItemRepositoryOptions = {
      transaction: { session: {} } as IMongoTransaction,
    };
    const mockItem = { id: 'item1', name: 'Partial Update' };

    mockCollection.updateOne.mockResolvedValueOnce({});

    await repository.updatePartial(mockItem, mockUser, mockRepoOptions);

    expect(mockGetInfo).toHaveBeenCalledWith(mockItem.id, mockCollection);
    expect(mockCollection.updateOne).toHaveBeenCalledWith(
      { _id: mockItem.id },
      {
        $set: {
          ...mockItem,
          updatedBy: mockUser.username,
          previousInfo: { existingData: 'value' },
        },
      },
      { session: (mockRepoOptions.transaction as IMongoTransaction).session },
    );
    expect(mockLogChange).toHaveBeenCalledWith(
      'updatePartial',
      mockItem,
      mockRepoOptions,
      mockUser,
      null,
    );
  });

  it('should call logChange with error if updateOne fails', async () => {
    const mockUser: IUser = { username: 'testUser', permissions: [''] };
    const mockRepoOptions: IItemRepositoryOptions = {
      transaction: { session: {} } as IMongoTransaction,
    };
    const mockItem = { id: 'item1', name: 'Partial Update' };
    const mockError = new Error('UpdateOne failed');

    mockCollection.updateOne.mockRejectedValueOnce(mockError);

    await expect(
      repository.updatePartial(mockItem, mockUser, mockRepoOptions),
    ).rejects.toThrow(mockError);

    expect(mockGetInfo).toHaveBeenCalledWith(mockItem.id, mockCollection);
    expect(mockCollection.updateOne).toHaveBeenCalledWith(
      { _id: mockItem.id },
      {
        $set: {
          ...mockItem,
          updatedBy: mockUser.username,
          previousInfo: { existingData: 'value' },
        },
      },
      { session: (mockRepoOptions.transaction as IMongoTransaction).session },
    );
    expect(mockLogChange).toHaveBeenCalledWith(
      'updatePartial',
      mockItem,
      mockRepoOptions,
      mockUser,
      mockError,
    );
  });

  it('should work without repoOptions', async () => {
    const mockUser: IUser = { username: 'testUser', permissions: [''] };
    const mockItem = { id: 'item1', name: 'Partial Update' };

    mockCollection.updateOne.mockResolvedValueOnce({});

    await repository.updatePartial(mockItem, mockUser);

    expect(mockGetInfo).toHaveBeenCalledWith(mockItem.id, mockCollection);
    expect(mockCollection.updateOne).toHaveBeenCalledWith(
      { _id: mockItem.id },
      {
        $set: {
          ...mockItem,
          updatedBy: mockUser.username,
          previousInfo: { existingData: 'value' },
        },
      },
      { session: undefined },
    );
    expect(mockLogChange).toHaveBeenCalledWith(
      'updatePartial',
      mockItem,
      undefined,
      mockUser,
      null,
    );
  });

  it('should throw if getInfo fails', async () => {
    const mockUser: IUser = { username: 'testUser', permissions: [''] };
    const mockItem = { id: 'item1', name: 'Partial Update' };
    const mockError = new Error('GetInfo failed');

    mockGetInfo.mockRejectedValueOnce(mockError);

    await expect(repository.updatePartial(mockItem, mockUser)).rejects.toThrow(
      mockError,
    );

    expect(mockGetInfo).toHaveBeenCalledWith(mockItem.id, mockCollection);
    expect(mockCollection.updateOne).not.toHaveBeenCalled();
    expect(mockLogChange).toHaveBeenCalledWith(
      'updatePartial',
      mockItem,
      undefined,
      mockUser,
      mockError,
    );
  });
});

describe('shared-mongo: MongoItemRepository updatePartialManyByCriteria function', () => {
  let repository: MongoItemRepository<any>;
  let mockCollection: any;
  let mockLogChange: jest.Mock;
  let mockConvertIdInCriteria: jest.Mock;

  beforeEach(() => {
    mockCollection = {
      updateMany: jest.fn(),
    };

    mockLogChange = jest.fn().mockResolvedValue(undefined);
    mockConvertIdInCriteria = jest.fn((criteria) => criteria);

    repository = new MongoItemRepository<any>(null as any);

    // Mock collectionContext
    jest
      .spyOn(repository as any, 'collectionContext')
      .mockImplementation(async (callback: any) => {
        return callback(mockCollection);
      });

    // Mock logChange
    jest
      .spyOn(repository as any, 'logChange')
      .mockImplementation(mockLogChange);

    // Mock convertIdInCriteria
    jest
      .spyOn(repository as any, 'convertIdInCriteria')
      .mockImplementation(mockConvertIdInCriteria);
  });

  it('should call updateMany and logChange on success', async () => {
    const mockUser: IUser = { username: 'testUser', permissions: [''] };
    const mockRepoOptions: IItemRepositoryOptions = {
      transaction: { session: {} } as IMongoTransaction,
    };
    const mockCriteria = { status: 'pending' };
    const mockSet = { fieldToUpdate: 'newValue' };

    mockCollection.updateMany.mockResolvedValueOnce({});

    await repository.updatePartialManyByCriteria(
      mockCriteria,
      mockSet,
      mockUser,
      mockRepoOptions,
    );

    expect(mockConvertIdInCriteria).toHaveBeenCalledWith(mockCriteria);
    expect(mockCollection.updateMany).toHaveBeenCalledWith(
      mockCriteria,
      {
        $set: {
          ...mockSet,
          '__info.update': {
            username: mockUser.username,
            date: expect.any(Date),
          },
        },
      },
      { session: (mockRepoOptions.transaction as IMongoTransaction).session },
    );
    expect(mockLogChange).toHaveBeenCalledWith(
      'updatePartialManyByCriteria',
      { ...mockCriteria, set: mockSet },
      mockRepoOptions,
      mockUser,
      null,
    );
  });

  it('should call logChange with error if updateMany fails', async () => {
    const mockUser: IUser = { username: 'testUser', permissions: [''] };
    const mockRepoOptions: IItemRepositoryOptions = {
      transaction: { session: {} } as IMongoTransaction,
    };
    const mockCriteria = { status: 'pending' };
    const mockSet = { fieldToUpdate: 'newValue' };
    const mockError = new Error('updateMany failed');

    mockCollection.updateMany.mockRejectedValueOnce(mockError);

    await expect(
      repository.updatePartialManyByCriteria(
        mockCriteria,
        mockSet,
        mockUser,
        mockRepoOptions,
      ),
    ).rejects.toThrow(mockError);

    expect(mockConvertIdInCriteria).toHaveBeenCalledWith(mockCriteria);
    expect(mockCollection.updateMany).toHaveBeenCalledWith(
      mockCriteria,
      {
        $set: {
          ...mockSet,
          '__info.update': {
            username: mockUser.username,
            date: expect.any(Date),
          },
        },
      },
      { session: (mockRepoOptions.transaction as IMongoTransaction).session },
    );
    expect(mockLogChange).toHaveBeenCalledWith(
      'updatePartialManyByCriteria',
      { ...mockCriteria, set: mockSet },
      mockRepoOptions,
      mockUser,
      mockError,
    );
  });

  it('should work without repoOptions', async () => {
    const mockUser: IUser = { username: 'testUser', permissions: [''] };
    const mockCriteria = { status: 'pending' };
    const mockSet = { fieldToUpdate: 'newValue' };

    mockCollection.updateMany.mockResolvedValueOnce({});

    await repository.updatePartialManyByCriteria(
      mockCriteria,
      mockSet,
      mockUser,
    );

    expect(mockConvertIdInCriteria).toHaveBeenCalledWith(mockCriteria);
    expect(mockCollection.updateMany).toHaveBeenCalledWith(
      mockCriteria,
      {
        $set: {
          ...mockSet,
          '__info.update': {
            username: mockUser.username,
            date: expect.any(Date),
          },
        },
      },
      { session: undefined },
    );
    expect(mockLogChange).toHaveBeenCalledWith(
      'updatePartialManyByCriteria',
      { ...mockCriteria, set: mockSet },
      undefined,
      mockUser,
      null,
    );
  });

  it('should throw if convertIdInCriteria fails', async () => {
    const mockUser: IUser = { username: 'testUser', permissions: [''] };
    const mockCriteria = { status: 'pending' };
    const mockSet = { fieldToUpdate: 'newValue' };
    const mockError = new Error('convertIdInCriteria failed');

    mockConvertIdInCriteria.mockImplementationOnce(() => {
      throw mockError;
    });

    await expect(
      repository.updatePartialManyByCriteria(mockCriteria, mockSet, mockUser),
    ).rejects.toThrow(mockError);

    expect(mockConvertIdInCriteria).toHaveBeenCalledWith(mockCriteria);
    expect(mockCollection.updateMany).not.toHaveBeenCalled();
    expect(mockLogChange).toHaveBeenCalledWith(
      'updatePartialManyByCriteria',
      { ...mockCriteria, set: mockSet },
      undefined,
      mockUser,
      mockError,
    );
  });
});

describe('shared-mongo: MongoItemRepository delete function', () => {
  let repository: MongoItemRepository<any>;
  let mockCollection: any;
  let mockLogChange: jest.Mock;

  beforeEach(() => {
    mockCollection = {
      deleteOne: jest.fn(),
    };

    mockLogChange = jest.fn().mockResolvedValue(undefined);

    repository = new MongoItemRepository<any>(null as any);

    jest
      .spyOn(repository as any, 'collectionContext')
      .mockImplementation(async (callback: any) => {
        return callback(mockCollection);
      });

    jest
      .spyOn(repository as any, 'logChange')
      .mockImplementation(mockLogChange);
  });

  it('should call deleteOne and logChange on success', async () => {
    const mockUser: IUser = { username: 'testUser', permissions: [''] };
    const mockRepoOptions: IItemRepositoryOptions = {
      transaction: { session: {} } as IMongoTransaction,
    };
    const mockId = '123';

    mockCollection.deleteOne.mockResolvedValueOnce({});

    await repository.delete(mockId, mockUser, mockRepoOptions);

    expect(mockCollection.deleteOne).toHaveBeenCalledWith(
      { _id: mockId },
      { session: (mockRepoOptions.transaction as IMongoTransaction).session },
    );
    expect(mockLogChange).toHaveBeenCalledWith(
      'delete',
      { id: mockId },
      mockRepoOptions,
      mockUser,
      null,
    );
  });

  it('should call logChange with error if deleteOne fails', async () => {
    const mockUser: IUser = { username: 'testUser', permissions: [''] };
    const mockRepoOptions: IItemRepositoryOptions = {
      transaction: { session: {} } as IMongoTransaction,
    };
    const mockId = '123';
    const mockError = new Error('deleteOne failed');

    mockCollection.deleteOne.mockRejectedValueOnce(mockError);

    await expect(
      repository.delete(mockId, mockUser, mockRepoOptions),
    ).rejects.toThrow(mockError);

    expect(mockCollection.deleteOne).toHaveBeenCalledWith(
      { _id: mockId },
      { session: (mockRepoOptions.transaction as IMongoTransaction).session },
    );
    expect(mockLogChange).toHaveBeenCalledWith(
      'delete',
      { id: mockId },
      mockRepoOptions,
      mockUser,
      mockError,
    );
  });

  it('should work without repoOptions', async () => {
    const mockUser: IUser = { username: 'testUser', permissions: [''] };
    const mockId = '123';

    mockCollection.deleteOne.mockResolvedValueOnce({});

    await repository.delete(mockId, mockUser);

    expect(mockCollection.deleteOne).toHaveBeenCalledWith(
      { _id: mockId },
      { session: undefined },
    );
    expect(mockLogChange).toHaveBeenCalledWith(
      'delete',
      { id: mockId },
      undefined,
      mockUser,
      null,
    );
  });
});

describe('shared-mongo: MongoItemRepository getById function', () => {
  let repository: MongoItemRepository<any>;
  let mockCollection: any;

  beforeEach(() => {
    mockCollection = {
      findOne: jest.fn(),
    };

    repository = new MongoItemRepository<any>(null as any);

    jest
      .spyOn(repository as any, 'collectionContext')
      .mockImplementation(async (callback: any) => {
        return callback(mockCollection);
      });

    jest
      .spyOn(repository as any, 'getModelToResult')
      .mockImplementation((item: any) => item);
  });

  it('should call findOne and return the result', async () => {
    const mockId = '123';
    const mockRepoOptions: IItemRepositoryOptions = {
      transaction: { session: {} } as IMongoTransaction,
    };
    const mockItem = { _id: mockId, name: 'testItem' };

    mockCollection.findOne.mockResolvedValueOnce(mockItem);

    const result = await repository.getById(mockId, mockRepoOptions);

    expect(mockCollection.findOne).toHaveBeenCalledWith(
      { _id: mockId },
      { session: (mockRepoOptions.transaction as IMongoTransaction).session },
    );
    expect(result).toEqual(mockItem);
  });

  it('should return null if no item is found', async () => {
    const mockId = '123';
    const mockRepoOptions: IItemRepositoryOptions = {
      transaction: { session: {} } as IMongoTransaction,
    };

    mockCollection.findOne.mockResolvedValueOnce(null);

    const result = await repository.getById(mockId, mockRepoOptions);

    expect(mockCollection.findOne).toHaveBeenCalledWith(
      { _id: mockId },
      { session: (mockRepoOptions.transaction as IMongoTransaction).session },
    );
    expect(result).toBeNull();
  });

  it('should work without repoOptions', async () => {
    const mockId = '123';
    const mockItem = { _id: mockId, name: 'testItem' };

    mockCollection.findOne.mockResolvedValueOnce(mockItem);

    const result = await repository.getById(mockId);

    expect(mockCollection.findOne).toHaveBeenCalledWith(
      { _id: mockId },
      { session: undefined },
    );
    expect(result).toEqual(mockItem);
  });
});

describe('shared-mongo: MongoItemRepository getByCriteria function', () => {
  let repository: MongoItemRepository<any>;
  let mockCollection: any;

  beforeEach(() => {
    mockCollection = {
      aggregate: jest.fn(),
    };

    repository = new MongoItemRepository<any>(null as any);

    jest
      .spyOn(repository as any, 'collectionContext')
      .mockImplementation(async (callback: any) => {
        return callback(mockCollection);
      });

    jest
      .spyOn(repository as any, 'convertIdInCriteria')
      .mockImplementation(jest.fn());
    jest
      .spyOn(repository as any, 'generateSearch')
      .mockImplementation(jest.fn());
    jest.spyOn(repository as any, 'getCount').mockResolvedValue(42);
    jest
      .spyOn(repository as any, 'getModelToResult')
      .mockImplementation((item: any) => item);
  });

  it('should aggregate data based on criteria and options', async () => {
    const criteria = { field: 'value' };
    const options = { sort: { field: 1 }, skip: 10, limit: 5 };
    const mockData = [{ id: 1 }, { id: 2 }];

    mockCollection.aggregate.mockReturnValueOnce({
      toArray: jest.fn().mockResolvedValueOnce(mockData),
    });

    const result = await repository.getByCriteria(criteria, options);

    expect(repository['convertIdInCriteria']).toHaveBeenCalledWith(criteria);
    expect(repository['generateSearch']).toHaveBeenCalledWith(criteria);
    expect(repository['getCount']).toHaveBeenCalledWith(
      criteria,
      mockCollection,
    );

    expect(mockCollection.aggregate).toHaveBeenCalledWith(
      [
        { $match: criteria },
        { $sort: options.sort },
        { $skip: options.skip },
        { $limit: options.limit },
      ],
      { allowDiskUse: undefined, session: undefined },
    );

    expect(result).toEqual({ data: mockData, totalCount: 42 });
  });

  it('should handle no criteria or options', async () => {
    const mockData = [{ id: 1 }];

    mockCollection.aggregate.mockReturnValueOnce({
      toArray: jest.fn().mockResolvedValueOnce(mockData),
    });

    const result = await repository.getByCriteria(undefined, undefined);

    expect(repository['convertIdInCriteria']).toHaveBeenCalledWith(undefined);
    expect(repository['generateSearch']).toHaveBeenCalledWith(undefined);
    expect(repository['getCount']).toHaveBeenCalledWith(
      undefined,
      mockCollection,
    );

    expect(mockCollection.aggregate).toHaveBeenCalledWith([], {
      allowDiskUse: undefined,
      session: undefined,
    });

    expect(result).toEqual({ data: mockData, totalCount: 42 });
  });

  it('should include additional pipeline stages when options are provided', async () => {
    const criteria = { field: 'value' };
    const options = {
      project: { field: 1 },
      group: { _id: '$field', count: { $sum: 1 } },
    };
    const mockData = [{ _id: 'field1', count: 10 }];

    mockCollection.aggregate.mockReturnValueOnce({
      toArray: jest.fn().mockResolvedValueOnce(mockData),
    });

    const result = await repository.getByCriteria(criteria, options);

    expect(mockCollection.aggregate).toHaveBeenCalledWith(
      [
        { $match: criteria },
        { $project: options.project },
        { $group: options.group },
      ],
      { allowDiskUse: undefined, session: undefined },
    );

    expect(result).toEqual({ data: mockData, totalCount: 42 });
  });
});

// Mock MongoDB components
// jest.mock('mongodb', () => {
//   const originalModule = jest.requireActual('mongodb');
//
//   const mockGridFSBucket = jest.fn().mockImplementation(() => ({}));
//   const mockDb = jest.fn().mockReturnValue({
//     GridFSBucket: mockGridFSBucket,
//   });
//   const mockConnect = jest.fn().mockResolvedValue({
//     db: jest.fn(() => mockDb()),
//   });
//
//   return {
//     ...originalModule,
//     MongoClient: {
//       connect: mockConnect,
//     },
//   };
// });

// describe('shared-mongo: MongoItemRepository changesByCriteria function', () => {
//   let mongoItemRepository: MongoItemRepository<any>;
//   let mockClient: any;
//   let mockDb: any;
//   let mockCollection: any;
//   let mockChangeStream: any;
//   const mockMongoConfig: MongoConfig = {
//     database: 'testDb',
//     collection: 'testCollection',
//     type: null,
//     host: 'host',
//     port: 4200
//   };
//
//   const mongodbMock = jest.requireMock("mongodb");
//   const mockConnect = mongodbMock.MongoClient.connect;
//
//   beforeEach(() => {
//     mockClient = { db: jest.fn().mockReturnThis(), close: jest.fn() };
//     mockDb = { collection: jest.fn().mockReturnThis() };
//     mockCollection = { watch: jest.fn() };
//     mockChangeStream = { on: jest.fn() };
//     mockClient.db.mockReturnValue(mockDb);
//     mockDb.collection.mockReturnValue(mockCollection);
//     mockCollection.watch.mockReturnValue(mockChangeStream);
//     mockConnect.mockResolvedValue(mockClient);
//
//     mongoItemRepository = new MongoItemRepository(mockMongoConfig);
//   });
//
//   afterEach(() => {
//     jest.clearAllMocks();
//   });
//
//   it('should establish a MongoDB connection and emit changes', (done) => {
//     const mockResult = {
//       'documentKey': { '_id': '123' },
//       'operationType': 'insert',
//       'fullDocument': { id: '123', name: 'Item 1' },
//     };
//
//     mockChangeStream.on.mockImplementationOnce((event, callback) => {
//       if (event === 'change') {
//         callback(mockResult); // Simulate a change event
//       }
//     });
//
//     const criteria = { id: '123' };
//
//     mongoItemRepository.changesByCriteria(criteria).subscribe({
//       next: (itemChangedData: ItemChangedData) => {
//         expect(itemChangedData).toEqual({
//           id: '123',
//           type: 'create', // 'insert' should be mapped to 'create'
//           data: mockResult.fullDocument,
//         });
//         done();
//       },
//       error: done.fail,
//     });
//
//     expect(mockConnect).toHaveBeenCalledTimes(1);
//     expect(mockCollection.watch).toHaveBeenCalledWith([
//       { $match: { 'documentKey._id': '123' } },
//     ]);
//   });
//
//   it('should establish a MongoDB connection and emit changes for general updates', (done) => {
//     const mockResult = {
//       'documentKey': { '_id': '123' },
//       'operationType': 'update',
//       'updateDescription': { updatedFields: { name: 'Updated Item' } },
//     };
//
//     mockChangeStream.on.mockImplementationOnce((event, callback) => {
//       if (event === 'change') {
//         callback(mockResult); // Simulate a change event
//       }
//     });
//
//     const criteria = { id: '123' };
//
//     mongoItemRepository.changesByCriteria(criteria).subscribe({
//       next: (itemChangedData: ItemChangedData) => {
//         expect(itemChangedData).toEqual({
//           id: '123',
//           type: 'update', // 'update' should be mapped to 'update'
//           data: mockResult.updateDescription,
//         });
//         done();
//       },
//       error: done.fail,
//     });
//
//     expect(mockConnect).toHaveBeenCalledTimes(1);
//     expect(mockCollection.watch).toHaveBeenCalledWith([
//       { $match: { 'documentKey._id': '123' } },
//     ]);
//   });
//
//   it('should handle errors properly and close the connection', (done) => {
//     const mockError = new Error('Connection error');
//
//     mockChangeStream.on.mockImplementationOnce((event, callback) => {
//       if (event === 'change') {
//         callback(mockError); // Simulate an error during the change event
//       }
//     });
//
//     const criteria = { id: '123' };
//
//     mongoItemRepository.changesByCriteria(criteria).subscribe({
//       next: () => {},
//       error: (error) => {
//         expect(error).toEqual(mockError);
//         expect(mockConnect).toHaveBeenCalledTimes(1);
//         expect(mockClient.close).toHaveBeenCalledTimes(1);
//         done();
//       },
//     });
//   });
//
//   it('should finalize the stream and close the connection', (done) => {
//     const mockResult = {
//       'documentKey': { '_id': '123' },
//       'operationType': 'insert',
//       'fullDocument': { id: '123', name: 'Item 1' },
//     };
//
//     mockChangeStream.on.mockImplementationOnce((event, callback) => {
//       if (event === 'change') {
//         callback(mockResult); // Simulate a change event
//       }
//     });
//
//     const criteria = { id: '123' };
//
//     const subscription = mongoItemRepository.changesByCriteria(criteria).subscribe({
//       next: (itemChangedData: ItemChangedData) => {
//         expect(itemChangedData).toEqual({
//           id: '123',
//           type: 'create',
//           data: mockResult.fullDocument,
//         });
//         subscription.unsubscribe(); // Unsubscribe to finalize the stream
//         done();
//       },
//       error: done.fail,
//     });
//
//     subscription.add(() => {
//       expect(mockClient.close).toHaveBeenCalledTimes(1); // Ensure the connection is closed after unsubscribe
//     });
//   });
// });
