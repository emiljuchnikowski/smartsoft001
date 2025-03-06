import {TransSystem} from "../entities/trans.entity";

export interface ITransCreate<T> {
    amount: number;
    name: string;
    system: TransSystem;
    firstName: string;
    lastName: string;
    email: string;
    contactPhone: string;
    data: T;
    options: any;
    clientIp: string;
}
