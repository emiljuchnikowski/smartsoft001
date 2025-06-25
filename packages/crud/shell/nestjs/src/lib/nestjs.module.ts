import { DynamicModule, Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

import {
  SERVICES,
} from "@smartsoft001/crud-shell-app-services";
import { SharedConfig, SharedModule } from "@smartsoft001/nestjs";
import { MongoModule } from "@smartsoft001/mongo";

import { CONTROLLERS } from "./controllers";
import { AuthJwtGuard } from "./guards/auth/auth.guard";
import { GATEWAYS } from "./gateways";

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
    }
  ): DynamicModule {
    return {
      module: CrudShellNestjsModule,
      controllers: options.restApi ? CONTROLLERS : [],
      providers: [
        ...SERVICES,
        ...(options.socket ? GATEWAYS : []),
        AuthJwtGuard,
      ],
      imports: [
        ...(options.restApi && options.tokenConfig.secretOrPrivateKey
          ? [
              PassportModule.register({
                defaultStrategy: "jwt",
                session: false,
              }),
              JwtModule.register({
                secret: options.tokenConfig.secretOrPrivateKey,
                signOptions: {
                  expiresIn: options.tokenConfig.expiredIn,
                },
              }),
            ]
          : []),
        SharedModule.forFeature(options),
        MongoModule.forRoot(options.db)
      ],
      exports: [
        ...SERVICES,
        AuthJwtGuard,
        MongoModule.forRoot(options.db)
      ],
    };
  }
}

@Module({})
export class CrudShellNestjsCoreModule {
  static forRoot<T>(
    options: SharedConfig & {
      db: {
        host: string;
        port: number;
        database: string;
        username?: string;
        password?: string;
        collection?: string;
        type?: any;
      };
    }
  ): DynamicModule {
    return {
      module: CrudShellNestjsModule,
      providers: [
        ...SERVICES,
        ...GATEWAYS,
        AuthJwtGuard,
      ],
      imports: [
        PassportModule.register({ defaultStrategy: "jwt", session: false }),
        JwtModule.register({
          secret: options.tokenConfig.secretOrPrivateKey,
          signOptions: {
            expiresIn: options.tokenConfig.expiredIn,
          },
        }),
        SharedModule.forRoot(options),
        MongoModule.forRoot(options.db)
      ],
      exports: [],
    };
  }
}
