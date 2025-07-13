import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DetailsService {
  private _root: any;

  get $root(): any {
    return this._root;
  }

  constructor() {
    this.init();
  }

  init(): void {
    this._root = null;
  }

  setRoot(obj: any, force = false): void {
    if (!this._root || force) this._root = obj;
  }
}
