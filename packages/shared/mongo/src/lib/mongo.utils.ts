import { MongoConfig } from './mongo.module';

export function getMongoUrl(config: MongoConfig): string {
  if (!config.host) {
    throw new Error('MongoConfig.host is required to build the connection url');
  }

  let url: string;
  if (config.username && config.password)
    url = `mongodb://${config.username}:${config.password}@${config.host}:${config.port}`;
  else url = `mongodb://${config.host}:${config.port}`;

  url = url + '?authSource=' + config.database;

  if (config.host.indexOf('ondigitalocean.com') > -1) {
    url = url.replace('mongodb://', 'mongodb+srv://');
    url = url + '&tls=true';
  }

  return url;
}
