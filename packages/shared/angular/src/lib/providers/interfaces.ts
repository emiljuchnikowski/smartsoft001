import {Observable} from "rxjs";

export interface IFormProvider {
    submit(): void;
}

export interface IAppProvider {
    logged$: Observable<boolean>;
    username$: Observable<string>;
    logout: () => void;
}
