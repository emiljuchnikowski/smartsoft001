import { Injectable } from '@nestjs/common';

import { FbAppCredentials } from '@smartsoft001/fb';

/**
 * Token settings, registered by the host application as a provider
 * (`{ provide: TokenConfig, useValue: { ... } }`). The class is a DI token and
 * a shape, never constructed with values, hence the definite assignment.
 */
@Injectable()
export class TokenConfig {
  expiredIn!: number;
  clients: Array<string> = [];
  /** Trusted OAuth clients for Google access-token login. Never taken from a request. */
  googleClientIds?: string[];
  /** Trusted Facebook apps for Facebook access-token login. Never taken from a request. */
  fbAppIds?: string[];
  /** The app that asks Facebook's `debug_token` to inspect tokens. Keep the secret server-side. */
  fbAppCredentials?: FbAppCredentials;
  secretOrPrivateKey!: string;
}
