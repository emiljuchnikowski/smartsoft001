// #region usage
import { Module } from '@nestjs/common';

import { MongoModule } from '@smartsoft001/mongo';

@Module({
  imports: [
    MongoModule.forRoot({
      host: 'localhost',
      port: 27017,
      database: 'my-app',
      collection: 'items',
    }),
  ],
})
export class DataModule {}
// #endregion
