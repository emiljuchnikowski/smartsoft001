import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GoogleService {
  constructor(private http: HttpService) {}

  async getUserId(token: string): Promise<string> {
    const { data } = await firstValueFrom(
      this.http.get(
        'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + token,
      ),
    );

    return data.user_id;
  }

  async getData(token: string): Promise<{ email: string; id: string }> {
    const { data } = await firstValueFrom(
      this.http.get(
        'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + token,
      ),
    );

    return {
      id: data.user_id,
      email: data.email,
    };
  }
}
