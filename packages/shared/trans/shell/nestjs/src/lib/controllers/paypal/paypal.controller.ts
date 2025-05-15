import {Body, Controller, HttpCode, Post, Get, Param, Query, Res, HttpStatus, Optional} from "@nestjs/common";

import { TransService } from "@smartsoft001/trans-shell-app-services";
import {PaypalConfig, PaypalService} from "@smartsoft001/paypal";

@Controller("paypal")
export class PaypalController {
  constructor(
      private readonly service: TransService,
      @Optional() private readonly config: PaypalConfig,
      @Optional() private readonly paypalService: PaypalService
  ) {}

  @Post()
  @HttpCode(200)
  async refreshStatus(
    @Body() obj: { item_number1: string }
  ): Promise<string> {
    try {
      const trans = await this.service.getById(obj.item_number1);
      await this.service.refresh(trans.externalId, obj);
      return "ok";
    } catch (e) {
      console.error('ERROR ---> ', obj);
      console.error(e);
      throw e;
    }
  }

  @Get(":id/confirm")
  async confirm(
      @Param('id') id,
      @Query("PayerID") payerId,
      @Query("paymentId") paymentId,
      @Res() res
  ){
    try {
      const trans = await this.service.getById(id);

      if (trans.externalId !== paymentId) {
        throw new Error('Invalid externaId');
      }

      const payment = await this.paypalService.confirm(payerId, paymentId, trans.amount / 100, trans.data);

      await this.service.refresh(paymentId, payment);

      return res.redirect(HttpStatus.MOVED_PERMANENTLY, this.config.returnUrl);
    } catch (e) {
      console.log(e)

      return res.redirect(HttpStatus.MOVED_PERMANENTLY, this.config.cancelUrl);
    }
  }
}
