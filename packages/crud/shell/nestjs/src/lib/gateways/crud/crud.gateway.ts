import { Optional } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
  WsException,
} from '@nestjs/websockets';
import {
  Observable,
  Subscription,
  from,
  switchMap,
  concatMap,
  map,
  filter,
} from 'rxjs';
import type { Socket } from 'socket.io';

import { CrudService } from '@smartsoft001/crud-shell-app-services';
import { ItemChangedData } from '@smartsoft001/crud-shell-dtos';
import { IEntity } from '@smartsoft001/domain-core';
import { SharedConfig } from '@smartsoft001/nestjs';

@WebSocketGateway({
  transports: ['websocket'],
  path: '/' + process.env.URL_PREFIX + '/_socket',
  namespace: '/' + process.env.URL_PREFIX,
})
export class CrudGateway<T extends IEntity<string>>
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private _clientsSubscriptions = new Map<string, Subscription>();

  constructor(
    private service: CrudService<T>,
    @Optional() private config?: SharedConfig,
    @Optional() private jwt?: JwtService,
  ) {}

  @SubscribeMessage('changes')
  handleFilter(
    @MessageBody() data: { id?: string },
    @ConnectedSocket() client: Socket,
  ): Observable<WsResponse<Pick<ItemChangedData, 'id' | 'type'>>> {
    const event = 'changes';

    return new Observable<WsResponse<Pick<ItemChangedData, 'id' | 'type'>>>(
      (observer) => {
        this.clearSubscription(client);
        const subscription = from(this.authorize(data, client))
          .pipe(
            switchMap(() => this.service.changes({ id: data.id })),
            filter((change) => change.id === data.id),
            concatMap((change) =>
              from(this.authorize(data, client)).pipe(
                map(() => ({
                  event,
                  data: { id: change.id, type: change.type },
                })),
              ),
            ),
          )
          .subscribe(observer);
        this._clientsSubscriptions.set(client.id, subscription);
        return () => {
          subscription.unsubscribe();
          if (this._clientsSubscriptions.get(client.id) === subscription) {
            this._clientsSubscriptions.delete(client.id);
          }
        };
      },
    );
  }

  private async authorize(
    data: { id?: string },
    client: Socket,
  ): Promise<void> {
    try {
      const token = client.handshake?.auth?.['token'];
      if (
        !data ||
        typeof data.id !== 'string' ||
        !data.id ||
        data.id.length > 128 ||
        !this.jwt ||
        !this.config?.changePolicy ||
        typeof token !== 'string' ||
        token.length > 8192
      ) {
        throw new Error('Denied');
      }
      const payload = await this.jwt.verifyAsync(token);
      if (typeof payload.sub !== 'string' || !payload.sub)
        throw new Error('Denied');
      const user = {
        username: payload.sub,
        permissions: Array.isArray(payload.permissions)
          ? payload.permissions.filter((p: unknown) => typeof p === 'string')
          : [],
      };
      if ((await this.config.changePolicy({ id: data.id, user })) !== true)
        throw new Error('Denied');
    } catch {
      throw new WsException('Change subscription denied');
    }
  }

  afterInit(server: any) {
    this._clientsSubscriptions = new Map<string, Subscription>();
    console.log('CrudGateway Init');
  }

  handleDisconnect(client: any) {
    this.clearSubscription(client);

    console.log(`Client disconnected: ${client.id}`);
  }

  private clearSubscription(client: { id: string }) {
    const subscription = this._clientsSubscriptions.get(client.id);

    if (subscription) {
      subscription.unsubscribe();
      this._clientsSubscriptions.delete(client.id);
    }
  }

  handleConnection(client: any, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }
}
