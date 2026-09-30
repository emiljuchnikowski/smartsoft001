import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GoogleService {
  constructor(private http: HttpService) {}

  async getUserId(
    token: string,
    clientIds: readonly string[] = [],
  ): Promise<string> {
    const data = await this.verify(token, clientIds);
    return data.user_id;
  }

  async getData(
    token: string,
    clientIds: readonly string[] = [],
  ): Promise<{ email: string; id: string }> {
    const data = await this.verify(token, clientIds);
    return {
      id: data.user_id,
      email: data.email,
    };
  }

  private async verify(token: string, clientIds: readonly string[]) {
    if (
      !token ||
      typeof token !== 'string' ||
      token.length > 8192 ||
      !clientIds.length
    ) {
      throw new UnauthorizedException(
        'Invalid Google token or client configuration',
      );
    }
    try {
      const { data } = await firstValueFrom(
        this.http.get(
          'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' +
            encodeURIComponent(token),
        ),
      );
      if (
        !data ||
        typeof data.user_id !== 'string' ||
        !data.user_id ||
        !clientIds.includes(data.audience) ||
        !clientIds.includes(data.issued_to) ||
        typeof data.expires_in !== 'number' ||
        !Number.isFinite(data.expires_in) ||
        data.expires_in <= 0
      ) {
        throw new UnauthorizedException('Invalid Google token');
      }
      return data;
    } catch {
      // The HTTP error may contain the access token in its request URL.
      throw new UnauthorizedException('Invalid Google token');
    }
  }
}
