// #region usage
import { HttpModule } from '@nestjs/axios';
import { Inject, Injectable, Module, Provider } from '@nestjs/common';

import { GoogleService } from '@smartsoft001/google';

/** The OAuth client id of the application, as Google issued it. */
export const DOCS_GOOGLE_CLIENT_ID = 'docs-client.apps.googleusercontent.com';

/** Injection token for the trusted Google client ids. */
export const GOOGLE_CLIENT_IDS = 'GOOGLE_CLIENT_IDS';

/**
 * `GoogleService` needs the list of OAuth client ids the application trusts.
 * Both methods GET `https://www.googleapis.com/oauth2/v1/tokeninfo` and accept
 * the token only when Google reports it as unexpired and issued to one of
 * those clients (`audience` and `issued_to`). Otherwise they throw an
 * `UnauthorizedException`. `getUserId` returns `user_id`, `getData` reshapes
 * the response into `{ id, email }`.
 *
 * The allowlist comes from server configuration, never from the login
 * request: a token issued to any other app would otherwise log its user in.
 * Wrapping the service keeps the allowlist and the tokeninfo call in one
 * place.
 */
@Injectable()
export class GoogleAccountsService {
  constructor(
    private readonly google: GoogleService,
    @Inject(GOOGLE_CLIENT_IDS) private readonly clientIds: string[],
  ) {}

  async getUserId(token: string): Promise<string> {
    return this.google.getUserId(token, this.clientIds);
  }
}

export const googleProviders: Provider[] = [
  GoogleService,
  GoogleAccountsService,
  // In an application, read this from the environment or a config service.
  { provide: GOOGLE_CLIENT_IDS, useValue: [DOCS_GOOGLE_CLIENT_ID] },
];

/**
 * `HttpModule` supplies the `HttpService` that `GoogleService` injects. An
 * application that already imports `AuthShellNestjsModule.forRoot` gets
 * `GoogleService` from there instead, exported alongside `FbService`, and
 * only needs the wrapper. The `google` grant of that module reads its
 * allowlist from `TokenConfig.googleClientIds`.
 */
@Module({
  imports: [HttpModule],
  providers: googleProviders,
  exports: [GoogleAccountsService],
})
export class GoogleLoginModule {}
// #endregion
