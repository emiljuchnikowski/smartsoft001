import { Test, TestingModule } from '@nestjs/testing';

import {
  IAttachmentRepository,
  IItemRepository,
  IUnitOfWork,
} from '@smartsoft001/domain-core';

import { MongoModule } from './mongo.module';
import { MongoUnitOfWork } from './mongo.unitofwork';
import { MongoAttachmentRepository } from './repositories/attachment.repository';
import { MongoItemRepository } from './repositories/item.repository';

describe('mongo: MongoModule', () => {
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        MongoModule.forRoot({
          host: 'localhost',
          port: 27017,
          database: 'test',
        }),
      ],
    }).compile();
  });

  afterEach(async () => {
    await moduleRef?.close();
  });

  it('should resolve IItemRepository to MongoItemRepository', () => {
    const repository = moduleRef.get(IItemRepository);

    expect(repository).toBeInstanceOf(MongoItemRepository);
  });

  it('should resolve IAttachmentRepository to MongoAttachmentRepository', () => {
    const repository = moduleRef.get(IAttachmentRepository);

    expect(repository).toBeInstanceOf(MongoAttachmentRepository);
  });

  it('should resolve IUnitOfWork to MongoUnitOfWork', () => {
    const unitOfWork = moduleRef.get(IUnitOfWork);

    expect(unitOfWork).toBeInstanceOf(MongoUnitOfWork);
  });
});
