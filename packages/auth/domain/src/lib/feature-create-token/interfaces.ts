import {IUserCredentials} from "@smartsoft001/users";

export type IAuthTokenRequest = IAuthTokenRequestPassword
    | IAuthTokenRequestRefreshToken
    | IAuthTokenRequestCustom
    | IAuthTokenRequestFb
    | IAuthTokenRequestGoogle;

export interface IAuthTokenRequestFb extends IUserCredentials {
    grant_type: "fb";
    fb_token: string;
    fb_user_id?: string;
    scope?: string;
    client_id: string;
}

export interface IAuthTokenRequestGoogle extends IUserCredentials {
    grant_type: "google";
    google_token: string;
    google_user_id?: string;
    scope?: string;
    client_id: string;
}

export interface IAuthTokenRequestPassword extends IUserCredentials {
    grant_type: "password";
    username: string;
    password: string;
    scope?: string;
    client_id: string;
}

export interface IAuthTokenRequestRefreshToken {
    grant_type: "refresh_token";
    refresh_token: string;
    scope?: string;
}

export interface IAuthToken {
    access_token: string;
    refresh_token: string;
    expired_in: number;
    token_type: 'bearer';
    username?: string;
}

export interface IAuthTokenRequestCustom {
    grant_type: string;
    [key: string]: string;
}
