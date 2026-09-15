// #region usage
import { Module } from '@nestjs/common';

import { TransShellNestjsModule } from '@smartsoft001/trans-shell-nestjs';

/**
 * Transactions with no payment provider wired in yet. The module already
 * provides `TransService` and the three domain services, and it mounts the
 * controllers that accept a new transaction and the provider webhooks.
 */
@Module({
  imports: [
    TransShellNestjsModule.forRoot({
      // The JWT secret must not be empty: the passport strategy is built
      // eagerly, even though the transaction routes are the module's own.
      tokenConfig: {
        secretOrPrivateKey: 'change-me',
        expiredIn: 3600,
      },
      permissions: {
        create: ['admin'],
        read: ['admin', 'user'],
        update: ['admin'],
        delete: ['admin'],
      },
      // Your own back end, called when a transaction is created or refreshed.
      // An empty url turns those calls off instead of pointing them anywhere.
      internalApiUrl: '',
      // Transactions land in the `trans` collection, which the module names
      // itself. The connection is opened lazily, on the first query.
      db: {
        host: 'localhost',
        port: 27017,
        database: 'my-app',
      },
    }),
  ],
})
export class PaymentsModule {}

/**
 * The same module with PayU enabled. Each payment provider is gated by its
 * own config block: pass `payuConfig` and the module registers `PayuConfig`
 * and `PayuService`, leave it out and neither exists. The same holds for
 * `paypalConfig`, `revolutConfig` and `paynowConfig`.
 */
@Module({
  imports: [
    TransShellNestjsModule.forRoot({
      tokenConfig: {
        secretOrPrivateKey: 'change-me',
        expiredIn: 3600,
      },
      permissions: {
        create: ['admin'],
        read: ['admin', 'user'],
        update: ['admin'],
        delete: ['admin'],
      },
      internalApiUrl: '',
      db: {
        host: 'localhost',
        port: 27017,
        database: 'my-app',
      },
      payuConfig: {
        clientId: 'id',
        clientSecret: 'secret',
        posId: '1',
        // PayU calls `notifyUrl` with the payment result and sends the buyer
        // back to `continueUrl`. `test: true` targets the sandbox.
        notifyUrl: 'https://my-app.example/payu',
        continueUrl: 'https://my-app.example/thank-you',
        test: true,
      },
    }),
  ],
})
export class PaymentsWithPayuModule {}
// #endregion
