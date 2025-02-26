import {Trans, TransStatus} from "./entities";

export interface ITransInternalService<T> {
    create(trans: Trans<T>): Promise<any>;

    refresh(trans: Trans<any>): Promise<any>;
}

export interface ITransPaymentService {
    [key: string]: ITransPaymentSingleService;
}

export interface ITransPaymentSingleService {
    create(obj: {
        id: string,
        name: string,
        amount: number,
        firstName?: string,
        lastName?: string,
        email?: string,
        contactPhone?: string,
        clientIp: string,
        data: any,
        options: any,
    }): Promise<{ orderId: string, redirectUrl?: string, responseData?: any }>;

    getStatus<T>(trans: Trans<T>): Promise<{ status: TransStatus, data: any }>;

    refund(trans: Trans<any>, comment: string): Promise<any>;
}
