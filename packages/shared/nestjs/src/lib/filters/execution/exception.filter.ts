import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  DomainForbiddenError,
  DomainValidationError,
} from '@smartsoft001/domain-core';

/**
 * Exception filter to handle and format exceptions thrown by the application.
 *
 * @class
 * @implements {ExceptionFilter}
 * @throws {HttpException} If the exception is an instance of HttpException.
 * @throws {DomainValidationError} If the exception is of type DomainValidationError.
 * @throws {DomainForbiddenError} If the exception is of type DomainForbiddenError.
 *
 * @example
 * ```ts
 * import { Module } from '@nestjs/common';
 * import { APP_FILTER } from '@nestjs/core';
 *
 * import { AppExceptionFilter } from '@smartsoft001/nestjs';
 *
 * @Module({
 *   providers: [
 *     {
 *       provide: APP_FILTER,
 *       useClass: AppExceptionFilter,
 *     },
 *   ],
 * })
 * export class AppModule {}
 * ```
 */
@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  /**
   * Method to catch and handle exceptions.
   *
   * @param {any} exception - The exception thrown.
   * @param {ArgumentsHost} host - The arguments host.
   */
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = null;
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception['message'];
    } else if (exception['type'] === DomainValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = exception['message'];
    } else if (exception['type'] === DomainForbiddenError) {
      status = HttpStatus.FORBIDDEN;
      message = exception['message'];
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
    }

    Logger.error(
      exception['stack'] || exception['message'] || exception,
      AppExceptionFilter.name,
    );

    const result = response.status(status);
    if (message && result.json) {
      result.json({
        details: message,
      });
    } else if (!message && result.json) {
      result.json();
    } else if (message && !result.json) {
      result.send({
        details: message,
      });
    } else {
      result.send();
    }
  }
}
