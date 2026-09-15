import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { Observable, of } from 'rxjs';

import {
  GoogleAccountsService,
  googleProviders,
} from './google-service.example';

/**
 * `GoogleService` reads the tokeninfo response through `HttpService`, so a
 * stub that returns a canned payload covers the whole call without a socket.
 * The id lives under `user_id`, not `id`. Recording the url proves which
 * request the service would have sent.
 */
class RecordingHttpService {
  readonly calls: string[] = [];

  get(url: string): Observable<{ data: { user_id: string } }> {
    this.calls.push(url);

    return of({ data: { user_id: '42' } });
  }
}

describe('docs-examples-node: GoogleAccountsService', () => {
  let moduleRef: TestingModule;
  let httpService: RecordingHttpService;
  let service: GoogleAccountsService;

  beforeEach(async () => {
    httpService = new RecordingHttpService();

    moduleRef = await Test.createTestingModule({
      providers: [
        ...googleProviders,
        { provide: HttpService, useValue: httpService },
      ],
    }).compile();

    service = moduleRef.get(GoogleAccountsService);
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  it('should return the google user id for an access token', async () => {
    const result: string = await service.getUserId('token');

    expect(result).toBe('42');
  });

  it('should ask the tokeninfo endpoint about the token', async () => {
    await service.getUserId('token');

    expect(httpService.calls).toEqual([
      'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=token',
    ]);
  });

  it('should make no http call while registering the service', () => {
    expect(httpService.calls).toEqual([]);
  });
});
