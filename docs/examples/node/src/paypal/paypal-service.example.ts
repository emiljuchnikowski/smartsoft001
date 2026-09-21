// #region usage
import { Module, Provider } from '@nestjs/common';

import { PaypalConfig, PaypalService } from '@smartsoft001/paypal';

/**
 * `PaypalService` implements `ITransPaymentSingleService` from
 * `@smartsoft001/trans-domain`, so an application normally gets it from
 * `TransShellNestjsModule.forRoot({ paypalConfig })`, which registers the
 * service only when that key is present. Register the two providers by hand
 * when you want the PayPal calls without the rest of the transaction shell.
 *
 * `PaypalConfig` is the one config class in this family with a positional
 * constructor, so build it with `new` rather than an object literal. The
 * argument order is clientId, clientSecret, currencyCode, returnUrl, apiUrl,
 * cancelUrl, test.
 *
 * Credentials travel with every SDK call, so nothing is sent while the
 * provider is being registered.
 */
export const paypalProviders: Provider[] = [
  PaypalService,
  {
    provide: PaypalConfig,
    useValue: new PaypalConfig(
      'paypal-client-id',
      'paypal-client-secret',
      // Currency of every item and total the service builds.
      'PLN',
      // `returnUrl` is kept for callers; the service builds the PayPal return
      // url from `apiUrl` below and ignores this field today.
      'https://app.example.com/orders/thank-you',
      // `apiUrl` is your own API base, not a PayPal host: the service appends
      // `paypal/{id}/confirm` to it, which is the route the PayPal controller
      // in `@smartsoft001/trans-shell-nestjs` serves. Keep the trailing slash.
      'https://api.example.com/',
      // Where PayPal sends a buyer who abandons the payment.
      'https://app.example.com/orders/canceled',
      // `test: true` runs the SDK in `sandbox` mode, `false` in `live`.
      true,
    ),
  },
];

/**
 * The module needs no HTTP client, because this package routes every call
 * through `paypal-rest-sdk`. The second dependency, `ModuleRef`, comes from
 * Nest itself: `PaypalService` uses it to look up an optional
 * `IPaypalConfigProvider` under the `PAYPAL_CONFIG_PROVIDER` token and falls
 * back to the config above when there is none.
 */
@Module({
  providers: paypalProviders,
  exports: [PaypalService],
})
export class PaypalPaymentsModule {}
// #endregion
