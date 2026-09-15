import { Test, TestingModule } from '@nestjs/testing';

import { IItemRepository } from '@smartsoft001/domain-core';
import { MongoConfig, MongoItemRepository } from '@smartsoft001/mongo';

import { DataModule } from './mongo-module.example';

describe('docs-examples-node: DataModule', () => {
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [DataModule],
    }).compile();
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  it('should provide the MongoDB implementation of IItemRepository', () => {
    const repository = moduleRef.get(IItemRepository);

    expect(repository).toBeInstanceOf(MongoItemRepository);
  });

  it('should expose the database name passed to MongoModule.forRoot', () => {
    const config = moduleRef.get(MongoConfig);

    expect(config.database).toBe('my-app');
  });
});
