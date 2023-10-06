import { Guid } from 'guid-typescript';

export class GuidService {
  /***
   * Create guid as string
   */
  static create(): string {
    return Guid.raw();
  }
}
