export class DomainValidationError extends Error {
  type = DomainValidationError;

  constructor(msg: string) {
    super(msg);
  }
}

export class DomainForbiddenError extends Error {
  type = DomainForbiddenError;

  constructor(msg: string) {
    super(msg);
  }
}
