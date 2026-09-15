import { Test, TestingModule } from '@nestjs/testing';

import { CrudService } from '@smartsoft001/crud-shell-app-services';
import { CrudController } from '@smartsoft001/crud-shell-nestjs';
import { IItemRepository } from '@smartsoft001/domain-core';
import { MongoItemRepository } from '@smartsoft001/mongo';

import { NotesModule } from './crud-module.example';

describe('docs-examples-node: NotesModule', () => {
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [NotesModule],
    }).compile();
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  it('should provide the CRUD application service', () => {
    const service = moduleRef.get(CrudService);

    expect(service).toBeInstanceOf(CrudService);
  });

  it('should register the REST controller', () => {
    const controller = moduleRef.get(CrudController);

    expect(controller).toBeInstanceOf(CrudController);
  });

  it('should back the service with the MongoDB repository', () => {
    const repository = moduleRef.get(IItemRepository);

    expect(repository).toBeInstanceOf(MongoItemRepository);
  });
});
