import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Custom decorator to extract the user object from the request.
 *
 * @example
 * ```ts
 * import { Controller, Get } from '@nestjs/common';
 *
 * import { IUser } from '@smartsoft001/users';
 *
 * import { User } from './user.decorator';
 *
 * @Controller('profile')
 * export class ProfileController {
 *   @Get()
 *   getProfile(@User() user: IUser) {
 *     return user;
 *   }
 * }
 * ```
 */
export const User = createParamDecorator((_, context: ExecutionContext) => {
  const [req] = context.getArgs();
  return req.user;
});
