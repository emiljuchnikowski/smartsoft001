import { DynamicModule } from '@nestjs/common';

import { JwtStrategy, PermissionService } from './auth';
import { SharedConfig } from './shared.config';

/**
 * SharedModule class provides methods to configure the module's core functionalities and database settings.
 */
export class SharedModule {
  /**
   * Configures the module's core functionalities.
   *
   * @param {SharedConfig} config - An object containing the module's configuration.
   * @returns {DynamicModule} A DynamicModule object with providers and exports.
   */
  static forFeature(config: SharedConfig): DynamicModule {
    return {
      module: SharedModule,
      providers: [
        { provide: SharedConfig, useValue: config },
        JwtStrategy,
        PermissionService,
      ],
      exports: [
        { provide: SharedConfig, useValue: config },
        PermissionService,
        JwtStrategy,
      ],
    };
  }

  /**
   * Extends the forFeature() configuration by adding database settings. Use in AppModule.
   *
   * @param {SharedConfig & { db: { host: string; port: number; database: string; username?: string; password?: string; }}} config - An extended SharedConfig object that includes additional database settings.
   * @returns {DynamicModule} A DynamicModule object that imports and exports the forFeature() configuration.
   */
  static forRoot(
    config: SharedConfig & {
      db: {
        host: string;
        port: number;
        database: string;
        username?: string;
        password?: string;
      };
    },
  ): DynamicModule {
    return {
      module: SharedModule,
      imports: [SharedModule.forFeature(config)],
      exports: [SharedModule.forFeature(config)],
    };
  }
}
