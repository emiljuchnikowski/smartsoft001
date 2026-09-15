// #region usage
import { HttpModule } from '@nestjs/axios';
import { Injectable, Module, Provider } from '@nestjs/common';

import { FbService } from '@smartsoft001/fb';

/**
 * `FbService` needs no configuration: the access token is a per-call
 * argument, and `HttpService` is its only dependency. `getUserId` resolves a
 * token against `https://graph.facebook.com/me`; `getData` asks the same
 * endpoint for the id and the email.
 *
 * Wrapping it keeps the Graph call in one place, so the rest of an
 * application depends on this service instead of on the package.
 */
@Injectable()
export class FacebookAccountsService {
  constructor(private readonly fb: FbService) {}

  async getUserId(token: string): Promise<string> {
    return this.fb.getUserId(token);
  }
}

export const facebookProviders: Provider[] = [
  FbService,
  FacebookAccountsService,
];

/**
 * `HttpModule` supplies the `HttpService` that `FbService` injects. An
 * application that already imports `AuthShellNestjsModule.forRoot` gets
 * `FbService` from there instead, exported alongside `GoogleService`, and
 * only needs the wrapper.
 */
@Module({
  imports: [HttpModule],
  providers: facebookProviders,
  exports: [FacebookAccountsService],
})
export class FacebookLoginModule {}
// #endregion
