export class RevolutConfig {
    test?: boolean;
    token: string;
}

export const REVOLUT_CONFIG_PROVIDER = "REVOLUT_CONFIG_PROVIDER";

export abstract class IRevolutConfigProvider {
    abstract get(data: any): Promise<RevolutConfig>;
}
