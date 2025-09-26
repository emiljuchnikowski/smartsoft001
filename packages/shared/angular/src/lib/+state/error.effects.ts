import { Injectable } from '@angular/core';
import { createEffect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { ErrorService } from '../services';

@Injectable()
export class ErrorEffects {
  error$: Observable<any> = createEffect(
    () =>
      this.actions$.pipe(
        filter((action: any) => {
          return action.type.indexOf(' Failure') > -1;
        }),
        tap((action: Action & { error: any }) => {
          this.service.log(action.error).then();
        }),
      ),
    { dispatch: false },
  );

  constructor(
    private actions$: Actions,
    private service: ErrorService,
  ) {}
}
