export class TransConfig {
    constructor(
        public internalApiUrl: string,
        public tokenConfig: {
            secretOrPrivateKey: string,
            expiredIn: number
        }
    ) {}
}
