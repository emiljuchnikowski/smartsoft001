import { jest } from '@jest/globals';
import { MongoClient, ClientSession, TransactionOptions } from 'mongodb';

import { MongoConfig } from './mongo.config';
import { IMongoTransaction, MongoUnitOfWork } from './mongo.unitofwork';

const mockData: {
  config: MongoConfig;
  url: string;
} = {
  config: {
    host: 'host',
    port: 4200,
    database: 'db-string',
  },
  url: 'mongodb://host:4200?authSource=db-string',
};

describe('shared-mongo: MongoUnitOfWork scope function', () => {
  let mockClient: Partial<MongoClient>;
  let mockSession: Partial<ClientSession>;
  let model: MongoUnitOfWork;

  beforeEach(() => {
    model = new MongoUnitOfWork(mockData.config);

    mockSession = {
      withTransaction: jest.fn(
        async <T>(
          callback: (session: ClientSession) => Promise<T>,
          options: TransactionOptions,
        ): Promise<T> => {
          return callback(mockSession as ClientSession); // Pass the mocked session
        },
      ) as ClientSession['withTransaction'],
      endSession: jest.fn(() => Promise.resolve()),
    };

    mockClient = {
      startSession: jest.fn(() => mockSession as ClientSession),
      close: jest.fn(() => Promise.resolve()),
    };

    jest
      .spyOn(MongoClient, 'connect')
      .mockResolvedValue(mockClient as MongoClient);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should execute the definition within a transaction', async () => {
    const mockDefinition = jest.fn(async (transaction: IMongoTransaction) => {
      expect(transaction.session).toBe(mockSession);
      expect(transaction.connection).toBe(mockClient);
    });

    await expect(model.scope(mockDefinition)).resolves.not.toThrow();

    expect(MongoClient.connect).toHaveBeenCalledWith(mockData.url);
    expect(mockClient.startSession).toHaveBeenCalled();
    expect(mockSession.withTransaction).toHaveBeenCalled();
    expect(mockDefinition).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
    expect(mockClient.close).toHaveBeenCalled();
  });

  it('should throw an error if the definition throws an error', async () => {
    const mockError = new Error('Test error');
    const mockDefinition = jest.fn(async () => {
      throw mockError;
    });

    await expect(model.scope(mockDefinition)).rejects.toThrow(mockError);

    expect(MongoClient.connect).toHaveBeenCalledWith(mockData.url);
    expect(mockClient.startSession).toHaveBeenCalled();
    expect(mockSession.withTransaction).toHaveBeenCalled();
    expect(mockDefinition).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
    expect(mockClient.close).toHaveBeenCalled();
  });
});
