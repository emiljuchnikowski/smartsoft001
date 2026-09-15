// #region usage
import { HttpModule } from '@nestjs/axios';
import { Injectable, Module, Provider } from '@nestjs/common';

import { GoogleService } from '@smartsoft001/google';

/**
 * `GoogleService` needs no configuration: the access token is a per-call
 * argument, and `HttpService` is its only dependency. Both methods GET
 * `https://www.googleapis.com/oauth2/v1/tokeninfo`, which validates the token
 * and answers with `user_id` and `email`; `getUserId` returns the first,
 * `getData` reshapes both into `{ id, email }`.
 *
 * Wrapping it keeps the tokeninfo call in one place, so the rest of an
 * application depends on this service instead of on the package.
 */
@Injectable()
export class GoogleAccountsService {
  constructor(private readonly google: GoogleService) {}

  async getUserId(token: string): Promise<string> {
    return this.google.getUserId(token);
  }
}

export const googleProviders: Provider[] = [
  GoogleService,
  GoogleAccountsService,
];

/**
 * `HttpModule` supplies the `HttpService` that `GoogleService` injects. An
 * application that already imports `AuthShellNestjsModule.forRoot` gets
 * `GoogleService` from there instead, exported alongside `FbService`, and
 * only needs the wrapper.
 */
@Module({
  imports: [HttpModule],
  providers: googleProviders,
  exports: [GoogleAccountsService],
})
export class GoogleLoginModule {}
// #endregion
