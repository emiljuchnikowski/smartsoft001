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
  secretOrPrivateKey!: string;
}
