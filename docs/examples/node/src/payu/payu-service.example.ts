// #region usage
import { HttpModule } from '@nestjs/axios';
import { Module, Provider } from '@nestjs/common';

import { PayuConfig, PayuService } from '@smartsoft001/payu';

/**
 * `PayuService` implements `ITransPaymentSingleService` from
 * `@smartsoft001/trans-domain`, so an application normally gets it from
 * `TransShellNestjsModule.forRoot({ payuConfig })`, which registers the
 * service only when that key is present. Register the two providers by hand
 * when you want the PayU calls without the rest of the transaction shell.
 *
 * `PayuConfig` is a plain class used as its own injection token. Its required
 * fields have no initialisers, so pass an object literal to `useValue` instead
 * of calling `new PayuConfig()`.
 */
export const payuProviders: Provider[] = [
  PayuService,
  {
    provide: PayuConfig,
    useValue: {
      clientId: 'payu-client-id',
      clientSecret: 'payu-client-secret',
      posId: 'payu-pos-id',
      notifyUrl: 'https://api.example.com/trans/payu/notify',
      continueUrl: 'https://app.example.com/orders/thank-you',
      // `test: true` sends every request to https://secure.snd.payu.com,
      // `false` or absent sends it to https://secure.payu.com.
      test: true,
    } satisfies PayuConfig,
  },
];

/**
 * `HttpModule` supplies the `HttpService` the service injects. Its third
 * dependency, `ModuleRef`, comes from Nest itself: `PayuService` uses it to
 * look up an optional `IPayuConfigProvider` under the `PAYU_CONFIG_PROVIDER`
 * token and falls back to the config above when there is none.
 */
@Module({
  imports: [HttpModule],
  providers: payuProviders,
  exports: [PayuService],
})
export class PayuPaymentsModule {}
// #endregion
