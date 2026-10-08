import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

/** The Facebook app that asks Graph to inspect tokens, as `<appId>|<appSecret>`. */
export interface IFbAppCredentials {
  appId: string;
  appSecret: string;
}

const GRAPH = 'https://graph.facebook.com';
const INVALID_TOKEN = 'Invalid Facebook token';

@Injectable()
export class FbService {
  constructor(private http: HttpService) {}

  /**
   * Returns the (app-scoped) user id of a token issued to one of `appIds`.
   * `appIds` and `credentials` come from server configuration, never from a request.
   */
  async getUserId(
    token: string,
    appIds: readonly string[],
    credentials: IFbAppCredentials,
  ): Promise<string> {
    return this.verify(token, appIds, credentials);
  }

  async getData(
    token: string,
    appIds: readonly string[],
    credentials: IFbAppCredentials,
  ): Promise<{ id: string; email: string }> {
    const userId = await this.verify(token, appIds, credentials);
    const data = await this.request(
      `${GRAPH}/me?fields=email,id&access_token=${encodeURIComponent(token)}`,
    );
    if (!data || data.id !== userId) {
      throw new UnauthorizedException(INVALID_TOKEN);
    }
    return data;
  }

  /** Asks `debug_token` whether the token is valid and which app it was issued to. */
  private async verify(
    token: string,
    appIds: readonly string[],
    credentials: IFbAppCredentials,
  ): Promise<string> {
    if (
      !token ||
      typeof token !== 'string' ||
      token.length > 8192 ||
      !appIds?.length ||
      !credentials?.appId ||
      !credentials?.appSecret
    ) {
      throw new UnauthorizedException(
        'Invalid Facebook token or app configuration',
      );
    }
    const appAccessToken = `${credentials.appId}|${credentials.appSecret}`;
    const body = await this.request(
      `${GRAPH}/debug_token?input_token=${encodeURIComponent(token)}` +
        `&access_token=${encodeURIComponent(appAccessToken)}`,
    );
    const data = body?.data;
    if (
      !data ||
      data.is_valid !== true ||
      !appIds.includes(data.app_id) ||
      typeof data.user_id !== 'string' ||
      !data.user_id
    ) {
      throw new UnauthorizedException(INVALID_TOKEN);
    }
    return data.user_id;
  }

  private async request(url: string) {
    try {
      const { data } = await firstValueFrom(this.http.get(url));
      return data;
    } catch {
      // The HTTP error carries the request URL: the user token and the app secret.
      throw new UnauthorizedException(INVALID_TOKEN);
    }
  }
}
