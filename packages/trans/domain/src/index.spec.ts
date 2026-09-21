import * as publicApi from './index';
import { RefundService } from './lib/feature-refund-trans';

describe('trans-domain: public API', () => {
  it('should export the base class the transaction services extend', () => {
    // `TransBaseService` holds `addHistory` and `setError`. Without it on the
    // entry point a fourth service written outside this package cannot inherit
    // that handling and has to reimplement it.
    expect(publicApi.TransBaseService).toBeDefined();
    expect(RefundService.prototype).toBeInstanceOf(publicApi.TransBaseService);
  });
});
