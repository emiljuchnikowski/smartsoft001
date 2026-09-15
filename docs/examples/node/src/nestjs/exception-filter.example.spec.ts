import { ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import {
  DomainForbiddenError,
  DomainValidationError,
} from '@smartsoft001/domain-core';
import { AppExceptionFilter } from '@smartsoft001/nestjs';

import { ErrorHandlingModule } from './exception-filter.example';

function createResponse() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
}

function createHost(response: ReturnType<typeof createResponse>) {
  return {
    switchToHttp: () => ({ getResponse: () => response }),
  } as unknown as ArgumentsHost;
}

describe('docs-examples-node: ErrorHandlingModule', () => {
  beforeEach(() => {
    jest.spyOn(Logger, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should register AppExceptionFilter under the APP_FILTER token', async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [ErrorHandlingModule],
    }).compile();

    const providers = Reflect.getMetadata('providers', ErrorHandlingModule);

    expect(moduleRef).toBeDefined();
    expect(providers).toEqual([
      { provide: APP_FILTER, useClass: AppExceptionFilter },
    ]);
  });

  it('should answer a DomainValidationError with status 400 and the message', () => {
    const response = createResponse();
    const filter = new AppExceptionFilter();

    filter.catch(
      new DomainValidationError('Required fields: name'),
      createHost(response),
    );

    expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(response.json).toHaveBeenCalledWith({
      details: 'Required fields: name',
    });
  });

  it('should answer a DomainForbiddenError with status 403 and the message', () => {
    const response = createResponse();
    const filter = new AppExceptionFilter();

    filter.catch(
      new DomainForbiddenError('Context forbidden'),
      createHost(response),
    );

    expect(response.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
    expect(response.json).toHaveBeenCalledWith({
      details: 'Context forbidden',
    });
  });
});
