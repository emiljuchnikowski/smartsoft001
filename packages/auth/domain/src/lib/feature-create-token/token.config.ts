import { Injectable } from '@nestjs/common';

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
  secretOrPrivateKey!: string;
}
