import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { Observable, of } from 'rxjs';

import {
  FacebookAccountsService,
  facebookProviders,
} from './fb-service.example';

/**
 * `FbService` reads the Graph response through `HttpService`, so a stub that
 * returns a canned payload covers the whole call without a socket. Recording
 * the url proves which request the service would have sent.
 */
class RecordingHttpService {
  readonly calls: string[] = [];

  get(url: string): Observable<{ data: { id: string } }> {
    this.calls.push(url);

    return of({ data: { id: '42' } });
  }
}

describe('docs-examples-node: FacebookAccountsService', () => {
  let moduleRef: TestingModule;
  let httpService: RecordingHttpService;
  let service: FacebookAccountsService;

  beforeEach(async () => {
    httpService = new RecordingHttpService();

    moduleRef = await Test.createTestingModule({
      providers: [
        ...facebookProviders,
        { provide: HttpService, useValue: httpService },
      ],
    }).compile();

    service = moduleRef.get(FacebookAccountsService);
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  it('should return the facebook user id for an access token', async () => {
    const result: string = await service.getUserId('token');

    expect(result).toBe('42');
  });

  it('should ask the graph api for the account behind the token', async () => {
    await service.getUserId('token');

    expect(httpService.calls).toEqual([
      'https://graph.facebook.com/me?access_token=token',
    ]);
  });

  it('should make no http call while registering the service', () => {
    expect(httpService.calls).toEqual([]);
  });
});
