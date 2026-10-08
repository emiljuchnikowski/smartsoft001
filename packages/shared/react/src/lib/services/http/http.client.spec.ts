/**
 * @jest-environment node
 */
import {
  createAuthInterceptor,
  SmartHttpClient,
  SmartHttpError,
} from './http.client';

function response(body: string, init: ResponseInit = {}): Response {
  return new Response(body, { status: 200, ...init });
}

describe('@smartsoft001/react: SmartHttpClient', () => {
  it('should parse a JSON body', async () => {
    const fetch = jest.fn(async () => response('{"a":1}'));
    const client = new SmartHttpClient({ fetch });

    expect(await client.get('/api')).toEqual({ a: 1 });
  });

  it('should send a JSON body with its content type', async () => {
    const fetch = jest.fn(async (_url: string, _init?: RequestInit) =>
      response(''),
    );
    const client = new SmartHttpClient({
      fetch: fetch as unknown as typeof globalThis.fetch,
    });

    await client.post('/api', { a: 1 });

    expect(fetch.mock.calls[0][1]).toMatchObject({
      method: 'POST',
      body: '{"a":1}',
      headers: { 'Content-Type': 'application/json' },
    });
  });

  it('should return null for an empty body', async () => {
    const client = new SmartHttpClient({ fetch: async () => response('') });

    expect(await client.delete('/api/1')).toBeNull();
  });

  it('should read a text body', async () => {
    const client = new SmartHttpClient({ fetch: async () => response('a;b') });

    expect(await client.get('/api', { responseType: 'text' })).toBe('a;b');
  });

  it('should expose the response headers', async () => {
    const client = new SmartHttpClient({
      fetch: async () =>
        response('', { status: 201, headers: { Location: '/api/items/42' } }),
    });

    const result = await client.request({ method: 'POST', url: '/api/items' });

    expect(result.headers.get('Location')).toBe('/api/items/42');
  });

  it('should reject a failed response with the error body', async () => {
    const client = new SmartHttpClient({
      fetch: async () => response('{"details":"nope"}', { status: 400 }),
    });

    await expect(client.get('/api')).rejects.toMatchObject({
      status: 400,
      body: { details: 'nope' },
    });
  });

  it('should reject with a SmartHttpError', async () => {
    const client = new SmartHttpClient({
      fetch: async () => response('', { status: 500 }),
    });

    await expect(client.get('/api')).rejects.toBeInstanceOf(SmartHttpError);
  });

  it('should add the bearer token through the auth interceptor', async () => {
    const fetch = jest.fn(async (_url: string, _init?: RequestInit) =>
      response(''),
    );
    const client = new SmartHttpClient({
      fetch: fetch as unknown as typeof globalThis.fetch,
      interceptors: [createAuthInterceptor(() => 'abc')],
    });

    await client.get('/api');

    expect(
      (fetch.mock.calls[0][1]?.headers as Record<string, string>)[
        'Authorization'
      ],
    ).toBe('Bearer abc');
  });

  it('should send no authorization header without a token', async () => {
    const fetch = jest.fn(async (_url: string, _init?: RequestInit) =>
      response(''),
    );
    const client = new SmartHttpClient({
      fetch: fetch as unknown as typeof globalThis.fetch,
      interceptors: [createAuthInterceptor(() => null)],
    });

    await client.get('/api');

    expect(fetch.mock.calls[0][1]?.headers).toEqual({});
  });
});
