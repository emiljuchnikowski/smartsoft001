// #region usage
import { HttpService } from '@nestjs/axios';
import { ModuleRef } from '@nestjs/core';

import { IItemRepository } from '@smartsoft001/domain-core';
import { PayuService } from '@smartsoft001/payu';
import {
  CreatorService,
  RefresherService,
  RefundService,
  Trans,
  TransConfig,
} from '@smartsoft001/trans-domain';
import { TransService } from '@smartsoft001/trans-shell-app-services';

import { InMemoryTransRepository, OrderData } from './creator-service.example';

/**
 * `TransService` falls back to an HTTP internal service that posts every new
 * transaction to `TransConfig.internalApiUrl`. An empty url short-circuits
 * that fallback to a resolved promise, so nothing here ever reaches the
 * network. This stub records any call that would break that promise.
 */
export class OfflineHttpService {
  readonly calls: string[] = [];

  post(url: string): never {
    this.calls.push(`POST ${url}`);
    throw new Error('the example is offline');
  }

  put(url: string): never {
    this.calls.push(`PUT ${url}`);
    throw new Error('the example is offline');
  }
}

/**
 * Stand-in for `PayuService`. In an application this provider appears only
 * when you pass a `payuConfig` to `TransShellNestjsModule.forRoot`. The real
 * service also implements `getStatus` and `refund`, which the webhook and the
 * refund flow use; creating a transaction needs `create` alone.
 */
export class StubPayuService {
  readonly orders: string[] = [];

  async create(obj: {
    name: string;
  }): Promise<{ orderId: string; redirectUrl: string }> {
    this.orders.push(obj.name);

    return { orderId: 'ORD-2', redirectUrl: 'https://pay.example/ORD-2' };
  }
}

/**
 * `TransService` is the application-level entry point: it picks the payment
 * provider by `system`, resolves the internal service and delegates to the
 * three domain services. Nest normally injects all of this. Building it by
 * hand shows exactly what it depends on.
 *
 * `moduleRef.get` is how `TransService` looks up a custom internal service
 * registered under `TRANS_TOKEN_INTERNAL_SERVICE`. A throwing stub reproduces
 * the common case where no such provider exists, and the built-in fallback
 * takes over.
 *
 * The three payment services left `undefined` are `@Optional()` injections.
 * Only the one named by `system` is ever called.
 */
export function createTransService(
  repository: InMemoryTransRepository,
  httpService: OfflineHttpService,
  payuService: StubPayuService,
): TransService {
  const itemRepository = repository as unknown as IItemRepository<
    Trans<OrderData>
  >;

  const config = new TransConfig('', {
    secretOrPrivateKey: 'change-me',
    expiredIn: 3600,
  });

  const moduleRef = {
    get: () => {
      throw new Error('no internal service is registered');
    },
  } as unknown as ModuleRef;

  return new TransService(
    moduleRef,
    new CreatorService(itemRepository),
    new RefresherService(itemRepository),
    new RefundService(itemRepository),
    httpService as unknown as HttpService,
    config,
    itemRepository,
    payuService as unknown as PayuService,
    undefined as never,
    undefined as never,
    undefined as never,
  );
}
// #endregion
