import { Signal } from '@angular/core';

export interface IFormProvider {
  submit(): void;
}

export interface IAppProvider {
  logged: Signal<boolean>;
  username: Signal<string>;
  logout: () => void;
}
