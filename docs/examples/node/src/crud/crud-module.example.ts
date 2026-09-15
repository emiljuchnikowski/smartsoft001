// #region usage
import { Module } from '@nestjs/common';

import { CrudShellNestjsModule } from '@smartsoft001/crud-shell-nestjs';

@Module({
  imports: [
    CrudShellNestjsModule.forRoot({
      // The JWT secret guards the REST routes. It must not be empty when
      // `restApi` is on, because the passport strategy is built eagerly.
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
      // The connection is opened lazily, on the first query.
      db: {
        host: 'localhost',
        port: 27017,
        database: 'my-app',
        collection: 'notes',
      },
      restApi: true,
      socket: false,
    }),
  ],
})
export class NotesModule {}
// #endregion
