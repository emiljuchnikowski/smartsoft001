// #region usage
import { HttpModule } from '@nestjs/axios';
import { Module, Provider } from '@nestjs/common';

import { RevolutConfig, RevolutService } from '@smartsoft001/revolut';

/**
 * `RevolutService` implements `ITransPaymentSingleService` from
 * `@smartsoft001/trans-domain`, so an application normally gets it from
 * `TransShellNestjsModule.forRoot({ revolutConfig })`, which registers the
 * service only when that key is present. Register the two providers by hand
 * when you want the Revolut calls without the rest of the transaction shell.
 *
 * `RevolutConfig` is a plain class used as its own injection token. Its
 * `token` field has no initialiser, so pass an object literal to `useValue`
 * instead of calling `new RevolutConfig()`. Unlike the other three payment
 * services, `RevolutService` injects the config with `@Optional()`: it
 * resolves without this provider and only fails once a method needs the
 * merchant token.
 */
export const revolutProviders: Provider[] = [
  RevolutService,
  {
    provide: RevolutConfig,
    useValue: {
      // The merchant secret API key, sent as a bearer token alongside the
      // `Revolut-Api-Version` header, pinned to the exported
      // `REVOLUT_API_VERSION` ('2024-09-01').
      token: 'revolut-secret-api-key',
      // `test: true` sends every request to
      // https://sandbox-merchant.revolut.com, `false` or absent sends it to
      // https://merchant.revolut.com.
      test: true,
    } satisfies RevolutConfig,
  },
];

/**
 * `HttpModule` supplies the `HttpService` the service injects. Its second
 * dependency, `ModuleRef`, comes from Nest itself: `RevolutService` uses it to
 * look up an optional `IRevolutConfigProvider` under the
 * `REVOLUT_CONFIG_PROVIDER` token and falls back to the config above when
 * there is none.
 */
@Module({
  imports: [HttpModule],
  providers: revolutProviders,
  exports: [RevolutService],
})
export class RevolutPaymentsModule {}
// #endregion
