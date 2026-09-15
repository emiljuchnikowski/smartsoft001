// #region usage
import { Module } from '@nestjs/common';

import { AuthShellNestjsModule } from '@smartsoft001/auth-shell-nestjs';

@Module({
  imports: [
    AuthShellNestjsModule.forRoot({
      tokenConfig: {
        secretOrPrivateKey: 'change-me',
        expiredIn: 3600,
        clients: ['docs-client'],
      },
    }),
  ],
})
export class AuthModule {}
// #endregion
