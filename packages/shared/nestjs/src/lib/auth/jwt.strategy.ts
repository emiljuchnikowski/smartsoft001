import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { SharedConfig } from '../shared.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: SharedConfig) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.tokenConfig?.secretOrPrivateKey as string,
    });
  }

  async validate(payload: any) {
    return {
      ...payload,
      permissions: payload.permissions,
      username: payload.sub,
    };
  }
}
