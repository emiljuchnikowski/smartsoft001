import {DynamicModule, Module} from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import { TypeOrmModule } from '@nestjs/typeorm';

import {TokenController} from "./controllers/token/token.controller";
import {DOMAIN_SERVICES, ENTITIES, TokenConfig} from "@smartsoft001/auth-domain";
import {AuthService} from "@smartsoft001/auth-shell-app-services";
import {FbService} from "@smartsoft001/fb";
import {GoogleService} from "@smartsoft001/google";

@Module({ })
export class AuthShellNestjsModule {
    static forRoot(options: {
        tokenConfig: TokenConfig
    }): DynamicModule {
        return {
            module: AuthShellNestjsModule,
            controllers: [ TokenController ],
            providers: [
                { provide: TokenConfig, useValue: options.tokenConfig },
                AuthService,
                FbService,
                GoogleService,
                ...DOMAIN_SERVICES,
            ],
            imports: [
                HttpModule,
                TypeOrmModule.forFeature(ENTITIES),
                PassportModule.register({ defaultStrategy: 'jwt', session: false }),
                JwtModule.register({
                    secret: options.tokenConfig.secretOrPrivateKey,
                    signOptions: {
                        expiresIn: options.tokenConfig.expiredIn
                    }
                })
            ],
            exports: [
                FbService,
                GoogleService,
            ]
        }
    }
}

@Module({ })
export class AuthShellNestjsCoreModule {
    static forRoot(options: {
        tokenConfig: TokenConfig
    }): DynamicModule {
        return {
            module: AuthShellNestjsModule,
            providers: [
                { provide: TokenConfig, useValue: options.tokenConfig },
                AuthService,
                ...DOMAIN_SERVICES,
            ],
            exports: [
                AuthService,
                ...DOMAIN_SERVICES,
                { provide: TokenConfig, useValue: options.tokenConfig },
            ],
            imports: [
                TypeOrmModule.forFeature(ENTITIES),
                PassportModule.register({ defaultStrategy: 'jwt', session: false }),
                JwtModule.register({
                    secret: options.tokenConfig.secretOrPrivateKey,
                    signOptions: {
                        expiresIn: options.tokenConfig.expiredIn
                    }
                })
            ]
        }
    }
}
