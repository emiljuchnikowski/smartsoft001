import {Body, Controller, Param, Post, Req} from "@nestjs/common";

import {ITransCreate} from "@smartsoft001/trans-domain";
import {TransService} from "@smartsoft001/trans-shell-app-services";

@Controller('')
export class TransController {
    constructor(private readonly service: TransService) {
    }

    @Post()
    async create<T>(@Body() obj: ITransCreate<T>, @Req() req) {
        obj.clientIp = req.connection.remoteAddress.indexOf("::") === 0 ? "10.0.0.1" : req.connection.remoteAddress;
        const { redirectUrl, orderId } = await this.service.create(obj);
        return {
            url: redirectUrl,
            orderId
        }
    }

    @Post(':id/refresh')
    async refresh<T>( @Param('id') orderId, @Body() obj): Promise<void> {
        await this.service.refresh(orderId, {});
    }
}
