import {Body, Controller, HttpCode, Post} from "@nestjs/common";

import {TransService} from "@smartsoft001/trans-shell-app-services";

@Controller('paynow')
export class PaynowController {
    constructor(private readonly service: TransService) {
    }

    @Post()
    @HttpCode(200)
    async refreshStatus(@Body() obj: { paymentId: string }): Promise<string> {
        try {
            await this.service.refresh(obj.paymentId, obj);
            return 'ok';
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
}
