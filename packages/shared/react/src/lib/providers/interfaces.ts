export interface IFormProvider {
  submit(): void;
}

/** What the app shell needs to know about the signed-in user. */
export interface IAppProvider {
  logged: boolean;
  username: string;
  logout: () => void;
}
