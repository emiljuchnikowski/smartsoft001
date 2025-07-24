import {Injectable} from "@angular/core";

import {CrudConfig} from "../../crud.config";

@Injectable()
export class SocketService<T>// extends Socket
{
    // constructor(private crudConfig: CrudConfig<T>) {
    //     super( {
    //         url: crudConfig.apiUrl,
    //         options: {
    //             transports: ["websocket"],
    //             path: new URL(crudConfig.apiUrl).pathname + '/_socket/'
    //         }
    //     });
    // }
}

@Injectable()
export class NotSocketService<T> { }
