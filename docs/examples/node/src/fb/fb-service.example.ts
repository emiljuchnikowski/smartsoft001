// #region usage
import { HttpModule } from '@nestjs/axios';
import { Inject, Injectable, Module, Provider } from '@nestjs/common';

import { IFbAppCredentials, FbService } from '@smartsoft001/fb';

/** The id of the Facebook app, as the Meta developer console shows it. */
export const DOCS_FB_APP_ID = '1234567890';

/** Injection token for the trusted Facebook app ids. */
export const FB_APP_IDS = 'FB_APP_IDS';

/** Injection token for the app id and secret that build the app access token. */
export const FB_APP_CREDENTIALS = 'FB_APP_CREDENTIALS';

/**
 * `FbService` needs the list of Facebook apps the application trusts and the
 * credentials of one app. Both methods first GET
 * `https://graph.facebook.com/debug_token`, authenticated with the app access
 * token `<appId>|<appSecret>`, and accept the token only when Facebook reports
 * it as valid and issued to one of those apps (`app_id`). Otherwise they throw
 * an `UnauthorizedException`. `getUserId` returns the `user_id` of that
 * answer; `getData` then reads the id and the email from `/me`.
 *
 * The allowlist and the secret come from server configuration, never from the
 * login request: a token granted to any other app would otherwise log its user
 * in. Wrapping the service keeps them and the Graph calls in one place.
 */
@Injectable()
export class FacebookAccountsService {
  constructor(
    private readonly fb: FbService,
    @Inject(FB_APP_IDS) private readonly appIds: string[],
    @Inject(FB_APP_CREDENTIALS) private readonly credentials: IFbAppCredentials,
  ) {}

  async getUserId(token: string): Promise<string> {
    return this.fb.getUserId(token, this.appIds, this.credentials);
  }
}

export const facebookProviders: Provider[] = [
  FbService,
  FacebookAccountsService,
  // In an application, read these from the environment or a config service.
  { provide: FB_APP_IDS, useValue: [DOCS_FB_APP_ID] },
  {
    provide: FB_APP_CREDENTIALS,
    useValue: { appId: DOCS_FB_APP_ID, appSecret: 'docs-app-secret' },
  },
];

/**
 * `HttpModule` supplies the `HttpService` that `FbService` injects. An
 * application that already imports `AuthShellNestjsModule.forRoot` gets
 * `FbService` from there instead, exported alongside `GoogleService`, and
 * only needs the wrapper. The `fb` grant of that module reads its allowlist
 * from `TokenConfig.fbAppIds` and its credentials from
 * `TokenConfig.fbAppCredentials`.
 */
@Module({
  imports: [HttpModule],
  providers: facebookProviders,
  exports: [FacebookAccountsService],
})
export class FacebookLoginModule {}
// #endregion
