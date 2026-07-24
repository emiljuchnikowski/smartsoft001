import { Injectable } from '@angular/core';

// NOTE: Restored 1:1 from the legacy library (FRA-293 / GAP-01).
// This is an inert stub: both classes are empty injectables. The original
// real-time implementation never existed as live code — the constructor below
// (which would have extended ngx-socket-io's `Socket`) was always commented out.
// `NotSocketService` is the null-object fallback used when `options.socket` is off.
@Injectable()
export class SocketService<T> /* extends Socket */ {
  // constructor(private crudConfig: CrudConfig<T>) {
  //     super({
  //         url: crudConfig.apiUrl,
  //         options: {
  //             transports: ['websocket'],
  //             path: new URL(crudConfig.apiUrl).pathname + '/_socket/',
  //         },
  //     });
  // }
}

@Injectable()
export class NotSocketService<T> {}
