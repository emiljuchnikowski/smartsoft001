import {TokenFactory} from "./lib/feature-create-token/token.factory";
import {User} from "./lib/entities/user.entity";

export * from './lib/entities';
export * from './lib/feature-create-token';

export const DOMAIN_SERVICES = [
    TokenFactory
];

export const ENTITIES = [
    User
];
