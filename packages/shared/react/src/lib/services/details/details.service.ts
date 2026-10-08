/**
 * Holds the root object of the form or details view being shown, so a
 * nested field's `enabled` specification can refer to `$root`.
 */
export class DetailsService {
  private _root: any = null;

  get $root(): any {
    return this._root;
  }

  init(): void {
    this._root = null;
  }

  setRoot(obj: any, force = false): void {
    if (!this._root || force) this._root = obj;
  }
}
