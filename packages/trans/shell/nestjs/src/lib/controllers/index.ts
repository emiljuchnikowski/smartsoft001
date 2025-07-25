import { PaynowController } from './paynow/paynow.controller';
import { PaypalController } from './paypal/paypal.controller';
import { PayUController } from './payu/payu.controller';
import { TransController } from './trans/trans.controller';

export * from './trans/trans.controller';
export * from './payu/payu.controller';
export * from './paypal/paypal.controller';
export * from './paynow/paynow.controller';

export const CONTROLLERS = [
  TransController,
  PayUController,
  PaypalController,
  PaynowController,
];
