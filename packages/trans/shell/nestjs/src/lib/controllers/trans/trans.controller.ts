import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import type { Request } from 'express';

import type { ITransCreate } from '@smartsoft001/trans-domain';
import { TransService } from '@smartsoft001/trans-shell-app-services';

@Controller('')
export class TransController {
  constructor(private readonly service: TransService) {}

  @Post()
  async create<T>(@Body() obj: ITransCreate<T>, @Req() req: Request) {
    // `socket` is what the deprecated `connection` alias pointed at. The
    // address is absent only once the socket is gone; an empty ip then goes to
    // the payment provider, which rejects it, instead of a crash before that.
    const remoteAddress = req.socket.remoteAddress ?? '';
    obj.clientIp =
      remoteAddress.indexOf('::') === 0 ? '10.0.0.1' : remoteAddress;
    const { redirectUrl, orderId } = await this.service.create(obj);
    return {
      url: redirectUrl,
      orderId,
    };
  }

  @Post(':id/refresh')
  async refresh<T>(
    @Param('id') orderId: string,
    @Body() obj: unknown,
  ): Promise<void> {
    await this.service.refresh(orderId, {});
  }
}
