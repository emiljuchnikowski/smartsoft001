import { Injectable } from '@nestjs/common';
import { ClientSession, MongoClient, TransactionOptions } from 'mongodb';

import { ITransaction, IUnitOfWork } from '@smartsoft001/domain-core';

import { MongoConfig } from './mongo.module';
import { getMongoUrl } from './mongo.utils';

export interface IMongoTransaction extends ITransaction {
  session: ClientSession;
}

@Injectable()
export class MongoUnitOfWork extends IUnitOfWork {
  constructor(private config: MongoConfig) {
    super();
  }

  async scope(
    definition: (transaction: ITransaction) => Promise<void>,
  ): Promise<void> {
    const client = await MongoClient.connect(this.getUrl());

    // Step 1: Start a Client Session
    const session = client.startSession();

    // Step 2: Optional. Define options to use for the transaction
    const transactionOptions: TransactionOptions = {
      readPreference: 'primary',
      readConcern: { level: 'local' },
      writeConcern: { w: 'majority' },
    };

    // Step 3: Use withTransaction to start a transaction, execute the callback, and commit (or abort on error)
    // Note: The callback for withTransaction MUST be async and/or return a Promise.

    let error = null;
    try {
      await session.withTransaction(async () => {
        await definition({
          session,
          connection: client,
        } as IMongoTransaction);
      }, transactionOptions);
    } catch (e) {
      error = e;
    } finally {
      await session.endSession();
      await client.close();
    }

    if (error) throw error;
  }

  private getUrl(): string {
    return getMongoUrl(this.config);
  }
}
