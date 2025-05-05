// import { ISpecification } from './interfaces';
// import {
//   BasicSpecification,
//   MergeSpecification,
//   OrSpecification,
//   AndSpecification,
// } from './specifications';
import { MongoConfig } from '@smartsoft001/mongo';
import { getMongoUrl } from './mongo.utils';

const mockData: (MongoConfig & { result: string; testName: string })[] = [
  {
    host: 'host',
    port: 4200,
    database: 'db-string',
    result: 'mongodb://host:4200?authSource=db-string',
    testName: 'Basic',
  },
  {
    host: 'ondigitalocean.com',
    port: 4200,
    database: 'db-string',
    result:
      'mongodb+srv://ondigitalocean.com:4200?authSource=db-string&tls=true',
    testName: 'Specific host',
  },
  {
    host: 'host',
    port: 4200,
    database: 'db-string',
    result: 'mongodb://host:4200?authSource=db-string',
    testName: 'Only username',
    username: 'username',
  },
  {
    host: 'host',
    port: 4200,
    database: 'db-string',
    result: 'mongodb://host:4200?authSource=db-string',
    testName: 'Only password',
    password: 'password',
  },
  {
    host: 'host',
    port: 4200,
    database: 'db-string',
    result: 'mongodb://username:password@host:4200?authSource=db-string',
    testName: 'Username and Password',
    username: 'username',
    password: 'password',
  },
];

describe('shared-mongo: utils getMongoUrl function', () => {
  for (const data of mockData) {
    it(data.testName, () => {
      expect(getMongoUrl(data)).toBe(data.result);
    });
  }
});
