// #region usage
import { Module } from '@nestjs/common';

import { PASSWORD_HASHER, Pbkdf2PasswordHasher } from '@smartsoft001/utils';

import { AuthModule } from '../auth/auth-module.example';
import { NotesModule } from '../crud/crud-module.example';

@Module({
  imports: [AuthModule, NotesModule],
  providers: [
    // One provider for the whole application: login verifies with it and
    // CrudService hashes every stored `password` with it.
    { provide: PASSWORD_HASHER, useClass: Pbkdf2PasswordHasher },
  ],
})
export class AppModule {}
// #endregion
