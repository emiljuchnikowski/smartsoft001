import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway, WsResponse
} from "@nestjs/websockets";
import { Socket } from "socket.io";
import { CrudService } from "@smartsoft001/crud-shell-app-services";
import { IEntity } from "@smartsoft001/domain-core";
import {Observable, Subscription} from "rxjs";
import {ItemChangedData} from "@smartsoft001/crud-shell-dtos";

@WebSocketGateway({
  transports: ["websocket"],
  path: "/" + process.env.URL_PREFIX + "/_socket",
  namespace: "/" + process.env.URL_PREFIX
})
export class CrudGateway<T extends IEntity<string>>
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private _clientsSubscriptions: Map<string, Subscription>;

  constructor(private service: CrudService<T>) {}

  @SubscribeMessage("changes")
  handleFilter(
      @MessageBody() data: { id?: string }, @ConnectedSocket() client: Socket
  ): Observable<WsResponse<ItemChangedData>> {
    const event = 'changes';

    return new Observable<WsResponse<ItemChangedData>>((observer => {
      this.clearSubscription(client);

      this._clientsSubscriptions.set(client.id, this.service.changes(data).subscribe(res => {
        observer.next({ event, data: res });
      }, error => observer.error(error)));
    }));
  }

  afterInit(server: any) {
    this._clientsSubscriptions = new Map<string, Subscription>();
    console.log("CrudGateway Init");
  }

  handleDisconnect(client: any) {
    this.clearSubscription(client);

    console.log(`Client disconnected: ${client.id}`);
  }

  private clearSubscription(client: any) {
    if (this._clientsSubscriptions.has(client.id)) {
      this._clientsSubscriptions.get(client.id).unsubscribe();
      this._clientsSubscriptions.delete(client.id);
    }
  }

  handleConnection(client: any, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }
}
