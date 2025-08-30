import { DynamicModule } from '@nestjs/common';

import {
  IAttachmentRepository,
  IItemRepository,
  IUnitOfWork,
} from '@smartsoft001/domain-core';

import { MongoConfig } from './mongo.config';
import { MongoUnitOfWork } from './mongo.unitofwork';
import { MongoAttachmentRepository } from './repositories/attachment.repository';
import { MongoItemRepository } from './repositories/item.repository';

export class MongoModule {
  static forRoot(config: MongoConfig): DynamicModule {
    const providers = [
      { provide: MongoConfig, useValue: config },
      { provide: IItemRepository, useClass: MongoItemRepository },
      { provide: IAttachmentRepository, useClass: MongoAttachmentRepository },
      { provide: IUnitOfWork, useClass: MongoUnitOfWork },
    ];

    return {
      module: MongoModule,
      providers: providers,
      exports: providers,
    };
  }
}

export { MongoConfig } from './mongo.config';
export { MongoItemRepository } from './repositories/item.repository';
