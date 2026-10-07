export class TransConfig {
  /** Enable only when the internal API durably honors Idempotency-Key. */
  idempotentInternalApi?: boolean;
  constructor(
    public internalApiUrl: string,
    public tokenConfig: {
      secretOrPrivateKey: string;
      expiredIn: number;
    },
  ) {}
}
