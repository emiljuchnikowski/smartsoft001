/**
 * Connection settings, registered by the host application as a provider
 * (`{ provide: MongoConfig, useValue: { ... } }`). The class is a DI token
 * and a shape, never constructed with values, hence the definite assignment.
 */
export class MongoConfig {
  host?: string;
  port?: number;
  database!: string;
  username?: string;
  password?: string;
  collection?: string;
  url?: string;
  type?: any;
}
