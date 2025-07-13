import { Body, Controller, Post, Req } from '@nestjs/common';
import { IAuthToken, IAuthTokenRequest } from '@smartsoft001/auth-domain';
import { AuthService } from '@smartsoft001/auth-shell-app-services';
import { Request } from 'express';


@Controller('token')
export class TokenController {
  constructor(private readonly service: AuthService) {}

  @Post()
  create(
    @Body() req: IAuthTokenRequest,
    @Req() httpReq: Request,
  ): Promise<IAuthToken> {
    return this.service.create(req, httpReq);
  }
}
