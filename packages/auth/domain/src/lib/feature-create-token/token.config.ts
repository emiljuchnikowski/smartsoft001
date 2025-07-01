import {Injectable} from "@nestjs/common";

@Injectable()
export class TokenConfig {
    expiredIn: number;
    clients: Array<string> = [];
    secretOrPrivateKey: string;
}
