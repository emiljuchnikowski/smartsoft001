import { SmartHttpClient } from '@smartsoft001/react';

/** One request the fake API received. */
export interface FakeRequest {
  method: string;
  url: string;
  headers: Record<string, string>;
  body: unknown;
}

export interface FakeApi {
  /** Every request, in the order it was sent. */
  requests: FakeRequest[];
  /** A `fetch` answering from memory, for `globalThis.fetch`. */
  fetch: typeof fetch;
  /** A `SmartHttpClient` over that `fetch`, for `<SmartProvider http>`. */
  http: SmartHttpClient;
  /** `METHOD url` of every request. */
  calls(): string[];
}

type Item = { id: string } & Record<string, unknown>;

/**
 * A REST resource under `apiUrl` held in memory, answering the requests of
 * `CrudService` the way `@smartsoft001/crud-shell-nestjs` does: a page as
 * `{ data, totalCount, links }`, one item by id, CSV text when the request
 * asks for `text/csv`, `201` with a `Location` header for a create, and an
 * empty body for the other writes. It records every request and does not
 * filter: the specs assert the requests, not the result.
 */
export function createFakeApi(apiUrl: string, items: Item[]): FakeApi {
  const requests: FakeRequest[] = [];

  const fetchFn = async (url: string, init: RequestInit = {}) => {
    const method = (init.method ?? 'GET').toUpperCase();
    const headers = { ...((init.headers ?? {}) as Record<string, string>) };
    const body =
      typeof init.body === 'string' ? JSON.parse(init.body) : init.body;

    requests.push({ method, url, headers, body });

    const path = url.split('?')[0];
    const id = path.startsWith(apiUrl + '/')
      ? decodeURIComponent(path.slice(apiUrl.length + 1))
      : undefined;
    const responseHeaders: Record<string, string> = {};
    let status = 200;
    let text = '';

    if (method === 'GET' && id) {
      text = JSON.stringify(items.find((item) => item.id === id) ?? null);
    } else if (method === 'GET' && headers['Content-Type'] === 'text/csv') {
      text = ['id,title', ...items.map((i) => `${i.id},${i['title']}`)].join(
        '\n',
      );
    } else if (method === 'GET') {
      text = JSON.stringify({
        data: items,
        totalCount: items.length,
        links: {},
      });
    } else if (method === 'POST') {
      status = 201;
      responseHeaders['location'] = `${apiUrl}/${items.length + 1}`;
    }

    return {
      ok: true,
      status,
      headers: {
        get: (name: string) => responseHeaders[name.toLowerCase()] ?? null,
      },
      text: async () => text,
      blob: async () => new Blob([text]),
    } as unknown as Response;
  };

  return {
    requests,
    fetch: fetchFn as unknown as typeof fetch,
    http: new SmartHttpClient({ fetch: fetchFn as unknown as typeof fetch }),
    calls: () => requests.map((request) => `${request.method} ${request.url}`),
  };
}
