import { IAuthTokenRequest } from "./interfaces";
import { User } from "../entities/user.entity";

export const AUTH_TOKEN_VALIDATION_PROVIDER = "AUTH_TOKEN_VALIDATION_PROVIDER";

export abstract class ITokenValidationProvider {
    abstract replace?: boolean;

    abstract check(
        data: {
            request?: IAuthTokenRequest;
            user?: User;
        }
    ): Promise<void>;
}
