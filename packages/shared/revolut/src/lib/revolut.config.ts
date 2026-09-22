/**
 * Injection token filled by the host application (`useValue` or a subclass);
 * `token` is therefore definitely assigned, never by a constructor.
 */
export class RevolutConfig {
  test?: boolean;
  token!: string;
}

export const REVOLUT_API_VERSION = '2024-09-01';

export const REVOLUT_CONFIG_PROVIDER = 'REVOLUT_CONFIG_PROVIDER';

export abstract class IRevolutConfigProvider {
  abstract get(data: any): Promise<RevolutConfig>;
}
