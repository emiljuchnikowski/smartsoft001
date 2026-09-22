import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FbService {
  constructor(private http: HttpService) {}

  async getUserId(token: string): Promise<string> {
    const { data } = await firstValueFrom(
      this.http.get('https://graph.facebook.com/me?access_token=' + token),
    );

    return data.id;
  }

  async getData(token: string): Promise<{ id: string; email: string }> {
    const { data } = await firstValueFrom(
      this.http.get(
        'https://graph.facebook.com/me?fields=email,id&access_token=' + token,
      ),
    );

    return data;
  }
}
