// #region usage
import { DomainValidationError } from '@smartsoft001/domain-core';
import { CreatorService, ITransCreate } from '@smartsoft001/trans-domain';

import { OrderData, startPayment } from './creator-service.example';

/**
 * `CreatorService.create` validates the request before it touches the
 * repository, so a rejected request leaves no transaction behind. The checks
 * run in this order, and the first one that fails wins:
 *
 * 1. `config is empty` - no request at all.
 * 2. `name is empty` - `name` is missing or blank. It becomes the order
 *    description shown by the payment provider.
 * 3. `client ip is empty` - `clientIp` is missing or blank. PayU requires the
 *    buyer address, which `TransController` reads off the incoming request.
 * 4. `amount is empty` - `amount` is missing, zero, negative or below one.
 * 5. `data is empty` - the `data` payload is missing.
 * 6. `system is empty` - `system` is missing or is not one of
 *    `payu`, `paypal`, `revolut`, `paynow`. An unknown provider reports the
 *    same message as a missing one.
 *
 * Every failure is a `DomainValidationError`, and the message is the bare
 * sentence above with no field prefix.
 *
 * The validation throws synchronously, before the returned promise exists.
 * Awaiting the call, as below, is what turns it into a rejection you can
 * catch in one place.
 */
export async function startPaymentOrExplain(
  creator: CreatorService<OrderData>,
  config: ITransCreate<OrderData>,
): Promise<{ orderId: string } | { error: string }> {
  try {
    const result = await startPayment(creator, config);

    return { orderId: result.orderId };
  } catch (error) {
    if (error instanceof DomainValidationError) {
      return { error: error.message };
    }

    throw error;
  }
}
// #endregion
