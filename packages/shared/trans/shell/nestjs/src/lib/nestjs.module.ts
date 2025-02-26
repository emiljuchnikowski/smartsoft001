import { DynamicModule, Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { HttpModule } from "@nestjs/axios";

import { SERVICES } from "@smartsoft001/trans-shell-app-services";
import { DOMAIN_SERVICES, TransConfig } from "@smartsoft001/trans-domain";
import { PayuConfig, PayuService } from "@smartsoft001/payu";
import { PaypalConfig, PaypalService } from "@smartsoft001/paypal";
import { RevolutConfig, RevolutService } from "@smartsoft001/revolut";
import { CrudShellNestjsModule } from "@smartsoft001/crud-shell-nestjs";
import { SharedConfig } from "@smartsoft001/nestjs";
import { PaynowConfig, PaynowService } from "@smartsoft001/paynow";

import { CONTROLLERS } from "./controllers";

@Module({
  imports: [HttpModule],
})
export class TransShellNestjsModule {
  static forRoot(
    config: SharedConfig &
      TransConfig & {
        payuConfig?: PayuConfig;
        paypalConfig?: PaypalConfig;
        revolutConfig?: RevolutConfig;
        paynowConfig?: PaynowConfig;
      } & {
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
      module: TransShellNestjsModule,
      controllers: CONTROLLERS,
      providers: [
        ...SERVICES,
        ...DOMAIN_SERVICES,
        { provide: TransConfig, useValue: config },
        ...(config.payuConfig
          ? [{ provide: PayuConfig, useValue: config.payuConfig }, PayuService]
          : []),
        ...(config.paypalConfig
          ? [
              { provide: PaypalConfig, useValue: config.paypalConfig },
              PaypalService,
            ]
          : []),
        ...(config.revolutConfig
          ? [
              { provide: RevolutConfig, useValue: config.revolutConfig },
              RevolutService,
            ]
          : []),
        ...(config.paynowConfig
          ? [
              { provide: PaynowConfig, useValue: config.paynowConfig },
              PaynowService,
            ]
          : []),
      ],
      imports: [
        CrudShellNestjsModule.forRoot({
          ...config,
          db: {
            ...config.db,
            collection: "trans",
          },
          restApi: false,
          socket: false,
        }),
        PassportModule.register({ defaultStrategy: "jwt", session: false }),
        JwtModule.register({
          secret: config.tokenConfig.secretOrPrivateKey,
          signOptions: {
            expiresIn: config.tokenConfig.expiredIn,
          },
        }),
      ],
      exports: [
        ...SERVICES,
        TransConfig,
        ...(config.payuConfig ? [PayuConfig, PayuService] : []),
        ...(config.paypalConfig ? [PaypalConfig, PaypalService] : []),
        ...(config.revolutConfig ? [RevolutConfig, RevolutService] : []),
      ],
    };
  }
}

@Module({
  imports: [HttpModule],
})
export class TransShellNestjsCoreModule {
  static forRoot(
    config: SharedConfig &
      TransConfig & {
        payuConfig?: PayuConfig;
        paypalConfig?: PaypalConfig;
        revolutConfig?: RevolutConfig;
        paynowConfig?: PaynowConfig;
      } & {
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
      module: TransShellNestjsCoreModule,
      providers: [
        ...SERVICES,
        ...DOMAIN_SERVICES,
        { provide: TransConfig, useValue: config },
        ...(config.payuConfig
          ? [{ provide: PayuConfig, useValue: config.payuConfig }, PayuService]
          : []),
        ...(config.paypalConfig
          ? [
              { provide: PaypalConfig, useValue: config.paypalConfig },
              PaypalService,
            ]
          : []),
        ...(config.paynowConfig
          ? [
              { provide: PaynowConfig, useValue: config.paynowConfig },
              PaynowService,
            ]
          : []),
      ],
      imports: [
        CrudShellNestjsModule.forRoot({
          ...config,
          db: {
            ...config.db,
            collection: "trans",
          },
          restApi: false,
          socket: false,
        }),
        PassportModule.register({ defaultStrategy: "jwt", session: false }),
        JwtModule.register({
          secret: config.tokenConfig.secretOrPrivateKey,
          signOptions: {
            expiresIn: config.tokenConfig.expiredIn,
          },
        }),
      ],
      exports: [
        ...SERVICES,
        TransConfig,
        ...(config.payuConfig ? [PayuConfig, PayuService] : []),
        ...(config.paypalConfig ? [PaypalConfig, PaypalService] : []),
        ...(config.revolutConfig ? [RevolutConfig, RevolutService] : []),
        ...(config.paynowConfig ? [PaynowConfig, PaynowService] : []),
      ],
    };
  }
}
