export type SmartHttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type SmartHttpResponseType = 'json' | 'text' | 'blob';

export interface SmartHttpRequest {
  method: SmartHttpMethod;
  url: string;
  body?: unknown;
  headers?: Record<string, string>;
  /** How the response body is read (default `json`). */
  responseType?: SmartHttpResponseType;
}

export interface SmartHttpResponse<T> {
  status: number;
  headers: Headers;
  body: T;
}

/**
 * Rewrites a request before it is sent, e.g. to add an `Authorization`
 * header. Interceptors run in the order they were added.
 */
export type SmartHttpInterceptor = (
  request: SmartHttpRequest,
) => SmartHttpRequest | Promise<SmartHttpRequest>;

export interface SmartHttpClientOptions {
  /** The `fetch` to use; defaults to the global one. */
  fetch?: typeof fetch;
  interceptors?: SmartHttpInterceptor[];
}

/** A non-2xx response. `body` holds the parsed error payload, if any. */
export class SmartHttpError extends Error {
  constructor(
    readonly status: number,
    readonly body: any,
    readonly headers: Headers | null = null,
  ) {
    super(`Http failure response: ${status}`);
    this.name = 'SmartHttpError';
  }
}

type RequestOptions = Omit<SmartHttpRequest, 'method' | 'url' | 'body'>;

/**
 * A small `fetch` wrapper with the surface the services need: JSON in and
 * out, text and blob responses, the response headers (the CRUD service reads
 * `Location` after a create) and interceptors.
 */
export class SmartHttpClient {
  private readonly fetchFn: typeof fetch | undefined;
  private readonly interceptors: SmartHttpInterceptor[];

  constructor(options: SmartHttpClientOptions = {}) {
    this.fetchFn = options.fetch;
    this.interceptors = [...(options.interceptors ?? [])];
  }

  addInterceptor(interceptor: SmartHttpInterceptor): void {
    this.interceptors.push(interceptor);
  }

  async request<T = any>(
    request: SmartHttpRequest,
  ): Promise<SmartHttpResponse<T>> {
    let current: SmartHttpRequest & { headers: Record<string, string> } = {
      ...request,
      headers: { ...(request.headers ?? {}) },
    };

    for (const interceptor of this.interceptors) {
      const next = await interceptor(current);

      current = { ...next, headers: { ...(next.headers ?? {}) } };
    }

    const fetchFn = this.fetchFn ?? globalThis.fetch;

    if (!fetchFn) {
      throw new Error('SmartHttpClient: no fetch implementation is available');
    }

    const isBinary =
      (typeof FormData !== 'undefined' && current.body instanceof FormData) ||
      (typeof Blob !== 'undefined' && current.body instanceof Blob);
    const hasBody = current.body !== undefined && current.body !== null;

    if (hasBody && !isBinary && !hasHeader(current.headers, 'content-type')) {
      current.headers['Content-Type'] = 'application/json';
    }

    const response = await fetchFn(current.url, {
      method: current.method,
      headers: current.headers,
      body: !hasBody
        ? undefined
        : isBinary || typeof current.body === 'string'
          ? (current.body as BodyInit)
          : JSON.stringify(current.body),
    });

    if (!response.ok) {
      throw new SmartHttpError(
        response.status,
        await readBody(response, 'json'),
        response.headers,
      );
    }

    return {
      status: response.status,
      headers: response.headers,
      body: (await readBody(response, current.responseType ?? 'json')) as T,
    };
  }

  async get<T = any>(url: string, options: RequestOptions = {}): Promise<T> {
    return (await this.request<T>({ ...options, method: 'GET', url })).body;
  }

  async post<T = any>(
    url: string,
    body?: unknown,
    options: RequestOptions = {},
  ): Promise<T> {
    return (await this.request<T>({ ...options, method: 'POST', url, body }))
      .body;
  }

  async put<T = any>(
    url: string,
    body?: unknown,
    options: RequestOptions = {},
  ): Promise<T> {
    return (await this.request<T>({ ...options, method: 'PUT', url, body }))
      .body;
  }

  async patch<T = any>(
    url: string,
    body?: unknown,
    options: RequestOptions = {},
  ): Promise<T> {
    return (await this.request<T>({ ...options, method: 'PATCH', url, body }))
      .body;
  }

  async delete<T = any>(url: string, options: RequestOptions = {}): Promise<T> {
    return (await this.request<T>({ ...options, method: 'DELETE', url })).body;
  }
}

/**
 * Adds `Authorization: Bearer <token>` to every request while `getToken`
 * returns a token, e.g. `createAuthInterceptor(() => auth.getAccessToken())`.
 */
export function createAuthInterceptor(
  getToken: () => string | null | undefined,
): SmartHttpInterceptor {
  return (request) => {
    const token = getToken();

    if (!token || hasHeader(request.headers, 'authorization')) return request;

    return {
      ...request,
      headers: { ...(request.headers ?? {}), Authorization: `Bearer ${token}` },
    };
  };
}

function hasHeader(
  headers: Record<string, string> | undefined,
  name: string,
): boolean {
  return Object.keys(headers ?? {}).some((key) => key.toLowerCase() === name);
}

async function readBody(
  response: Response,
  type: SmartHttpResponseType,
): Promise<unknown> {
  if (type === 'blob') return response.blob();

  const text = await response.text();

  if (type === 'text') return text;
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
