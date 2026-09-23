import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { SERVICES } from '@smartsoft001/crud-shell-app-services';
import { MongoModule } from '@smartsoft001/mongo';
import { SharedConfig, SharedModule } from '@smartsoft001/nestjs';

import { CONTROLLERS } from './controllers';
import { GATEWAYS } from './gateways';
import { AuthJwtGuard } from './guards/auth/auth.guard';

@Module({})
export class CrudShellNestjsModule {
  static forRoot<T>(
    options: SharedConfig & {
      db: {
        host: string;
        port: number;
        database: string;
        username?: string;
        password?: string;
        collection?: string;
        type?: T;
      };
    } & {
      restApi: boolean;
      socket: boolean;
    },
  ): DynamicModule {
    // Without a token config the REST API is served without JWT auth, as before.
    const tokenConfig = options.tokenConfig;

    return {
      module: CrudShellNestjsModule,
      controllers: options.restApi ? CONTROLLERS : [],
      providers: [
        ...SERVICES,
        ...(options.socket ? GATEWAYS : []),
        AuthJwtGuard,
      ],
      imports: [
        ...(options.restApi && tokenConfig?.secretOrPrivateKey
          ? [
              PassportModule.register({
                defaultStrategy: 'jwt',
                session: false,
              }),
              JwtModule.register({
                secret: tokenConfig.secretOrPrivateKey,
                signOptions: {
                  expiresIn: tokenConfig.expiredIn,
                },
              }),
            ]
          : []),
        SharedModule.forFeature(options),
        MongoModule.forRoot(options.db),
      ],
      exports: [...SERVICES, AuthJwtGuard, MongoModule.forRoot(options.db)],
    };
  }
}

@Module({})
export class CrudShellNestjsCoreModule {
  /**
   * The core module always registers JWT auth, so the token config is not
   * optional here: a missing one used to fail at startup with a TypeError.
   */
  static forRoot<T>(
    options: SharedConfig & {
      tokenConfig: NonNullable<SharedConfig['tokenConfig']>;
      db: {
        host: string;
        port: number;
        database: string;
        username?: string;
        password?: string;
        collection?: string;
        type?: any;
      };
    },
  ): DynamicModule {
    return {
      module: CrudShellNestjsCoreModule,
      providers: [...SERVICES, ...GATEWAYS, AuthJwtGuard],
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt', session: false }),
        JwtModule.register({
          secret: options.tokenConfig.secretOrPrivateKey,
          signOptions: {
            expiresIn: options.tokenConfig.expiredIn,
          },
        }),
        SharedModule.forRoot(options),
        MongoModule.forRoot(options.db),
      ],
      exports: [],
    };
  }
}
