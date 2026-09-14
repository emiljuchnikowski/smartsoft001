// #region usage
import { Module } from '@nestjs/common';

import { SharedModule } from '@smartsoft001/nestjs';

@Module({
  imports: [
    SharedModule.forRoot({
      tokenConfig: {
        secretOrPrivateKey: 'change-me',
        expiredIn: 3600,
      },
      permissions: {
        create: ['admin'],
        read: ['admin', 'user'],
        update: ['admin'],
        delete: ['admin'],
      },
      db: {
        host: 'localhost',
        port: 27017,
        database: 'my-app',
      },
    }),
  ],
})
export class AppModule {}
// #endregion
