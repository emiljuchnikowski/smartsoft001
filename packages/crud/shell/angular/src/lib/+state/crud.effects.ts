import "reflect-metadata";

import { Injectable } from "@angular/core";
import { catchError, first, tap } from "rxjs/operators";
import { of } from "rxjs";
import { Action, ActionsSubject, select, State, Store } from "@ngrx/store";

import { CrudService } from "../services/crud/crud.service";
import { IEntity } from "@smartsoft001/domain-core";
import * as CrudActions from "./crud.actions";
import { CrudConfig } from "../crud.config";
import { getCrudFilter } from "./crud.selectors";

@Injectable()
export class CrudEffects<T extends IEntity<string>> {
  constructor(
    private actions$: ActionsSubject,
    private service: CrudService<T>,
    private config: CrudConfig<T>,
    private store: Store<any>,
    private state: State<any>
  ) {}

  init(): void {
    const metadata = Reflect.getMetadata(this.config.entity, CrudEffects);

    if (metadata) return;

    Reflect.defineMetadata(this.config.entity, true, CrudEffects);

    this.actions$.subscribe((action: Action & any) => {
      switch (action.type) {
        case `[${this.config.entity}] Create`:
          this.service
            .create(action.item)
            .pipe(
              tap(() =>
                this.store.dispatch(
                  CrudActions.createSuccess(this.config.entity, action.item)
                )
              ),
              catchError((error) => {
                this.store.dispatch(
                  CrudActions.createFailure(
                    this.config.entity,
                    action.item,
                    error
                  )
                );
                return of();
              })
            )
            .subscribe();
          break;

        case `[${this.config.entity}] Create Success`:
          const createState = this.state.getValue()[this.config.entity];
          this.store.dispatch(
            CrudActions.read(
              this.config.entity,
              createState.filter ? { ...createState.filter, offset: 0 } : null
            )
          );
          break;

        case `[${this.config.entity}] Create Many`:
          this.service
            .createMany(action.data.items, action.data.options)
            .pipe(
              tap(() =>
                this.store.dispatch(
                  CrudActions.createManySuccess(this.config.entity, {
                    items: action.data.items,
                    options: action.data.options,
                  })
                )
              ),
              catchError((error) => {
                this.store.dispatch(
                  CrudActions.createManyFailure(
                    this.config.entity,
                    {
                      items: action.data.items,
                      options: action.data.options,
                    },
                    error
                  )
                );
                return of();
              })
            )
            .subscribe();
          break;

        case `[${this.config.entity}] Create Many Success`:
          const createManyState = this.state.getValue()[this.config.entity];
          this.store.dispatch(
            CrudActions.read(
              this.config.entity,
              createManyState.filter
                ? { ...createManyState.filter, offset: 0 }
                : null
            )
          );
          break;

        case `[${this.config.entity}] Read`:
          this.service
            .getList(action.filter)
            .pipe(
              tap((result) =>
                this.store.dispatch(
                  CrudActions.readSuccess(
                    this.config.entity,
                    action.filter,
                    result
                  )
                )
              ),
              catchError((error) => {
                this.store.dispatch(
                  CrudActions.readFailure(
                    this.config.entity,
                    action.filter,
                    error
                  )
                );
                return of();
              })
            )
            .subscribe();
          break;

        case `[${this.config.entity}] Export`:
          this.service
            .exportList(action.filter, action.format)
            .pipe(
              tap((result) =>
                this.store.dispatch(
                  CrudActions.exportListSuccess(
                    this.config.entity,
                    action.filter
                  )
                )
              ),
              catchError((error) => {
                this.store.dispatch(
                  CrudActions.exportListFailure(
                    this.config.entity,
                    action.filter,
                    error
                  )
                );
                return of();
              })
            )
            .subscribe();
          break;

        case `[${this.config.entity}] Select`:
          this.service
            .getById(action.id)
            .pipe(
              tap((result) =>
                this.store.dispatch(
                  CrudActions.selectSuccess(
                    this.config.entity,
                    action.id,
                    result
                  )
                )
              ),
              catchError((error) => {
                this.store.dispatch(
                  CrudActions.selectFailure(
                    this.config.entity,
                    action.id,
                    error
                  )
                );
                return of();
              })
            )
            .subscribe();
          break;

        case `[${this.config.entity}] Update`:
          this.service
            .updatePartial(action.item)
            .pipe(
              tap(() =>
                this.store.dispatch(
                  CrudActions.updateSuccess(this.config.entity, action.item)
                )
              ),
              catchError((error) => {
                this.store.dispatch(
                  CrudActions.updateFailure(
                    this.config.entity,
                    action.item,
                    error
                  )
                );
                this.store.dispatch(CrudActions.read(this.config.entity));
                return of();
              })
            )
            .subscribe();
          break;

        case `[${this.config.entity}] Update Success`:
          this.store
            .pipe(select(getCrudFilter(this.config.entity)), first())
            .subscribe((filter) => {
              this.store.dispatch(
                CrudActions.read(this.config.entity, {
                  ...filter,
                  offset: 0,
                })
              );

              this.store.dispatch(CrudActions.select(this.config.entity, action.item.id));
            });
          break;

        case `[${this.config.entity}] Update partial`:
          this.service
            .updatePartial(action.item)
            .pipe(
              tap(() =>
                this.store.dispatch(
                  CrudActions.updatePartialSuccess(
                    this.config.entity,
                    action.item
                  )
                )
              ),
              catchError((error) => {
                this.store.dispatch(
                  CrudActions.updatePartialFailure(
                    this.config.entity,
                    action.item,
                    error
                  )
                );
                this.store.dispatch(CrudActions.read(this.config.entity));
                return of();
              })
            )
            .subscribe();
          break;

        case `[${this.config.entity}] Update partial Success`:
          this.store
            .pipe(select(getCrudFilter(this.config.entity)), first())
            .subscribe((filter) => {
              this.store.dispatch(
                CrudActions.read(this.config.entity, {
                  ...filter,
                  offset: 0,
                })
              );

              this.store.dispatch(CrudActions.select(this.config.entity, action.item.id));
            });
          break;

        case `[${this.config.entity}] Update partial many`:
          this.service
            .updatePartialMany(action.items)
            .pipe(
              tap(() =>
                this.store.dispatch(
                  CrudActions.updatePartialManySuccess(
                    this.config.entity,
                    action.items
                  )
                )
              ),
              catchError((error) => {
                this.store.dispatch(
                  CrudActions.updatePartialManyFailure(
                    this.config.entity,
                    action.items,
                    error
                  )
                );
                this.store.dispatch(CrudActions.read(this.config.entity));
                return of();
              })
            )
            .subscribe();
          break;

        case `[${this.config.entity}] Update partial many Success`:
          this.store
            .pipe(select(getCrudFilter(this.config.entity)), first())
            .subscribe((filter) => {
              this.store.dispatch(
                CrudActions.read(this.config.entity, {
                  ...filter,
                  offset: 0,
                })
              );
            });
          break;

        case `[${this.config.entity}] Delete`:
          this.service
            .delete(action.id)
            .pipe(
              tap(() =>
                this.store.dispatch(
                  CrudActions.deleteSuccess(this.config.entity, action.id)
                )
              ),
              catchError((error) => {
                this.store.dispatch(
                  CrudActions.deleteFailure(
                    this.config.entity,
                    action.id,
                    error
                  )
                );
                return of();
              })
            )
            .subscribe();
          break;

        case `[${this.config.entity}] Delete Success`:
            this.store
                .pipe(select(getCrudFilter(this.config.entity)), first())
                .subscribe((filter) => {
                    this.store.dispatch(
                        CrudActions.read(this.config.entity, {
                            ...filter,
                            offset: 0,
                        })
                    );
                });
          break;

        default:
          break;
      }
    });
  }
}
