// #region usage
import { HttpModule } from '@nestjs/axios';
import { Module, Provider } from '@nestjs/common';

import { PaynowConfig, PaynowService } from '@smartsoft001/paynow';

/**
 * `PaynowService` implements `ITransPaymentSingleService` from
 * `@smartsoft001/trans-domain`, so an application normally gets it from
 * `TransShellNestjsModule.forRoot({ paynowConfig })`, which registers the
 * service only when that key is present. Register the two providers by hand
 * when you want the Paynow calls without the rest of the transaction shell.
 *
 * `PaynowConfig` is a plain class used as its own injection token. Its
 * required fields have no initialisers, so pass an object literal to
 * `useValue` instead of calling `new PaynowConfig()`.
 */
export const paynowProviders: Provider[] = [
  PaynowService,
  {
    provide: PaynowConfig,
    useValue: {
      // `apiKey` travels as the `Api-Key` header. `apiSignatureKey` never
      // leaves the process: the service signs each body with it locally
      // (HMAC-SHA256) and sends the digest as the `Signature` header.
      apiKey: 'paynow-api-key',
      apiSignatureKey: 'paynow-api-signature-key',
      continueUrl: 'https://app.example.com/orders/thank-you',
      // `test: true` sends every request to https://api.sandbox.paynow.pl,
      // `false` or absent sends it to https://api.paynow.pl.
      test: true,
    } satisfies PaynowConfig,
  },
];

/**
 * `HttpModule` supplies the `HttpService` the service injects. Its third
 * dependency, `ModuleRef`, comes from Nest itself: `PaynowService` uses it to
 * look up an optional `IPaynowConfigProvider` under the
 * `PAYNOW_CONFIG_PROVIDER` token and falls back to the config above when
 * there is none.
 */
@Module({
  imports: [HttpModule],
  providers: paynowProviders,
  exports: [PaynowService],
})
export class PaynowPaymentsModule {}
// #endregion
